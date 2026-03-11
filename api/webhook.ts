import { VercelRequest, VercelResponse } from '@vercel/node';
import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { Resend } from 'resend';
import { Storage } from '@google-cloud/storage';

// Vercel config to allow reading the raw body for webhook verification
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to read the raw body from the request stream
async function getRawBody(req: VercelRequest): Promise<string> {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const rawBody = await getRawBody(req);
        const signature = req.headers['paddle-signature'] as string || '';
        const secretKey = process.env.PADDLE_WEBHOOK_SECRET || '';
        const apiKey = process.env.PADDLE_API_KEY || ''; // We now need a real API key to fetch customer details

        const paddle = new Paddle(apiKey, {
            environment: Environment.production 
        });

        // 1. Verify the Webhook Signature
        const eventData = await paddle.webhooks.unmarshal(rawBody, secretKey, signature);

        // 2. We only care when a transaction is completed (paid)
        if (eventData && eventData.eventType === 'transaction.completed') {
            const transaction = eventData.data as any; 
            const customerId = transaction.customerId;

            let customerEmail = '';

            if (customerId) {
                try {
                    // Fetch the full customer object to get the email
                    const customer = await paddle.customers.get(customerId);
                    customerEmail = customer?.email || '';
                } catch (e) {
                    console.error("Failed to fetch customer details from Paddle:", e);
                }
            }

            if (!customerEmail) {
                console.error("Could not find customer email. Transaction Data:", transaction);
                return res.status(200).json({ error: 'No email found in event', debug: transaction });
            }

            console.log(`Processing successful payment for: ${customerEmail}`);

            // Determine which product was purchased based on the Price ID
            const purchasedPriceId = transaction.items && transaction.items.length > 0 ? transaction.items[0].price.id : null;
            
            // Map Price IDs to corresponding Google Cloud ZIP files
            let fileName = '';
            let productName = '';

            const PREMIUM_PRICE_ID = 'pri_01kkcjshgdd9p0yqgexv3nrt2f'; // Hardtechno Essentials Vol. 1
            const FREE_TRIAL_PRICE_ID = 'pri_01kkd2y0pdsxvg234s8zvfshqj'; // Free Trial

            if (purchasedPriceId === PREMIUM_PRICE_ID) {
                fileName = process.env.GCP_FILE_NAME || ''; 
                productName = 'Hardtechno Essentials Vol. 1';
            } else if (purchasedPriceId === FREE_TRIAL_PRICE_ID) {
                fileName = 'AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL 1.zip';
                productName = 'Hardtechno Essentials Vol. 1 (Free Trial)';
            } else {
                // Fallback in case ID is slightly different or not passed, assuming default product
                fileName = process.env.GCP_FILE_NAME || ''; 
                productName = 'Hardtechno Essentials Vol. 1';
                console.log(`Unknown Price ID (${purchasedPriceId}), defaulting to Premium Pack.`);
            }

            // 3. Generate the Secure Signed URL from Google Cloud
            // Fix literal \n issues in private keys uploaded to environment variables
            const privateKey = (process.env.GCP_PRIVATE_KEY || '').replace(/\\n/g, '\n');
            const storage = new Storage({
                credentials: {
                    client_email: process.env.GCP_CLIENT_EMAIL,
                    private_key: privateKey,
                },
            });

            const bucketName = process.env.GCP_BUCKET_NAME || '';

            const options = {
                version: 'v4' as const,
                action: 'read' as const,
                expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration
            };

            const [url] = await storage
                .bucket(bucketName)
                .file(fileName)
                .getSignedUrl(options);

            // 4. Send the Download Email using Resend
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'AKA SOUNDS <contact@akasounds.com>',
                to: customerEmail,
                subject: productName === 'Hardtechno Essentials Vol. 1 (Free Trial)' ? 'Your AKA SOUNDS Free Access!' : 'Your AKA SOUNDS Download Request!',
                html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#111111; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#111111; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color:#000000; border: 1px solid #333333; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 50px 20px; background-color: #050505; border-bottom: 1px solid #222222;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 6px; text-transform: uppercase;">AKA SOUNDS</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding: 50px 40px 30px 40px;">
              <h2 style="color: #ffffff; margin: 0 0 24px 0; font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">ACCESS GRANTED</h2>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0; text-align: center;">
                Thank you for securing your copy of <br><strong><span style="color:#ffffff;">${productName}</span></strong>. 
                <br><br>
                Your high-quality audio files are ready. This private download link is uniquely generated for you and will self-destruct in <strong style="color:#ffffff;">24 hours</strong>.
              </p>

              <!-- Button -->
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #ffffff;">
                    <a href="${url}" target="_blank" style="font-size: 16px; font-weight: 800; font-family: sans-serif; color: #000000; text-decoration: none; padding: 18px 45px; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 2px;">Download Files Now</a>
                  </td>
                </tr>
              </table>
              <p style="color: #555555; font-size: 12px; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Secure ZIP Archive</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 40px; background-color: #050505; border-top: 1px solid #222222;">
              <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0;">
                If you have any issues with your download, simply reply to this email.<br>
                Welcome to the underground.<br><br>
                &copy; ${new Date().getFullYear()} AKA SOUNDS
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
                `
            });

            console.log(`Successfully sent download email to ${customerEmail}`);
        }

        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('Webhook error:', error.message);
        // We log the error but still return 200 so paddle doesn't lock up or retry indefinitely.
        return res.status(200).json({ error: `Webhook Error: ${error.message}` });
    }
}
