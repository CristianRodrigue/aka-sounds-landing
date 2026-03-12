import { Resend } from 'resend';

// Use the API key from the environment or hardcode temporarily if we know it
// Note: We'll run this via CLI where we need to pass the ENV var 
const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
    try {
        console.log("Sending email via Resend API...");
        const data = await resend.emails.send({
            from: 'AKA SOUNDS <contact@akasounds.com>',
            to: 'rodriguez.cami09@gmail.com',
            subject: 'Direct Resend API Test',
            html: '<p>If you receive this, Resend is working correctly.</p>'
        });

        console.log("Resend API Response:", data);
    } catch (error) {
        console.error("Resend API Error:", error);
    }
}

testResend();
