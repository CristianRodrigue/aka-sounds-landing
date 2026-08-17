import crypto from 'crypto';

const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
const vercelApiUrl = process.env.PADDLE_WEBHOOK_TEST_URL;
const testEmail = process.env.PADDLE_WEBHOOK_TEST_EMAIL || 'test@example.invalid';

if (!webhookSecret || !vercelApiUrl) {
    console.error('PADDLE_WEBHOOK_SECRET and PADDLE_WEBHOOK_TEST_URL are required.');
    process.exit(1);
}

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
