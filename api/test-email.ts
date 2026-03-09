import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Storage } from '@google-cloud/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const customerEmail = req.query.email as string;

        if (!customerEmail) {
            return res.status(400).json({ error: 'Please provide an email query parameter, e.g. ?email=you@test.com' });
        }

        console.log(`Processing test payment delivery for: ${customerEmail}`);

        // 3. Generate the Secure Signed URL from Google Cloud
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
            expires: Date.now() + 24 * 60 * 60 * 1000,
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
            subject: 'TEST: Your AKA SOUNDS Download Request!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #fff;">
                    <h1 style="color: #fff; text-align: center; text-transform: uppercase; letter-spacing: 2px;">AKA SOUNDS (TEST)</h1>
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
                </div>
            `
        });

        return res.status(200).json({ success: true, message: `Check your inbox at ${customerEmail}!` });

    } catch (error: any) {
        console.error('Test Error:', error);
        return res.status(500).json({ error: \`Error: \${error.message}\` });
    }
}
