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
            const fileName = process.env.GCP_FILE_NAME || '';

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
                subject: 'Your AKA SOUNDS Download Request!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #fff;">
                        <h1 style="color: #fff; text-align: center; text-transform: uppercase; letter-spacing: 2px;">AKA SOUNDS</h1>
                        <h2 style="color: #666; text-align: center;">Transaction Successful</h2>
                        <p style="font-size: 16px; line-height: 1.5; color: #ddd;">
                            Thank you for your purchase! Your payment has been confirmed.
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; color: #ddd;">
                            Click the button below to download your files securely. This link is unique to you and will expire in <strong style="color: #fff;">24 hours</strong>.
                        </p>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${url}" style="background-color: #fff; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase;">Download Now</a>
                        </div>
                        <p style="font-size: 15px; color: #aaa; text-align: center;">
                            If you have issues, just reply to this email!
                        </p>
                    </div>
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
