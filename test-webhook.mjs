import crypto from 'crypto';

const webhookSecret = 'pdl_wh_sec_ca7b2ece41c7b889db4c8eb5b62bafb6028638b2dd295c2ecde0a9c80d507b9a'; // From previous context 
const vercelApiUrl = 'https://aka-sounds-landing.vercel.app/api/webhook'; // Assuming this is the vercel app URL
// Let's use the user's email or a test email
const testEmail = 'support@akasounds.com';

const payload = {
    event_id: 'evt_test_123',
    event_type: 'transaction.completed',
    occurred_at: new Date().toISOString(),
    notification_id: 'ntf_test_123',
    data: {
        id: 'txn_test_123',
        status: 'completed',
        customer: {
            email: testEmail
        }
    }
};

const payloadString = JSON.stringify(payload);
const ts = Math.floor(Date.now() / 1000).toString();

// Paddle Webhook Signature Generation
// HMAC-SHA256 signature of `${ts}:${payloadString}`
const signatureInput = `${ts}:${payloadString}`;
const hmac = crypto.createHmac('sha256', webhookSecret);
hmac.update(signatureInput);
const signatureHash = hmac.digest('hex');

const paddleSignatureHeader = `ts=${ts};h1=${signatureHash}`;

async function testWebhook() {
    console.log(`Sending mock webhook to ${vercelApiUrl}...`);
    console.log(`Payload email: ${testEmail}`);

    try {
        const response = await fetch(vercelApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'paddle-signature': paddleSignatureHeader
            },
            body: payloadString
        });

        const result = await response.text();
        console.log(`Status Code: ${response.status}`);
        console.log(`Response Body: ${result}`);

        if (response.ok) {
            console.log("✅ Webhook triggered successfully. Check your email inbox!");
        } else {
            console.log("❌ Webhook failed. See response body above.");
        }

    } catch (error) {
        console.error("Error sending webhook:", error);
    }
}

testWebhook();
