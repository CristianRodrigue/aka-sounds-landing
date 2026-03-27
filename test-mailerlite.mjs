import dotenv from 'dotenv';
dotenv.config();

const mailerLiteKey = process.env.MAILERLITE_API_KEY;

async function test() {
    try {
        const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${mailerLiteKey}`
            },
            body: JSON.stringify({
                email: 'test_aka@example.com',
                status: 'active',
                fields: {
                    name: 'Test Product Name'
                }
            })
        });
        
        console.log(mlResponse.status);
        const text = await mlResponse.text();
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}

test();
