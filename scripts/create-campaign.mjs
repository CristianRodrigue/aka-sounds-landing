import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const LEADS_GROUP_ID = "183137351324665069";

async function createCampaign(name, subject, html) {
    if (!MAILERLITE_API_KEY) {
        console.error("❌ MAILERLITE_API_KEY is missing in .env");
        return;
    }

    console.log(`🔑 Using API Key starting with: ${MAILERLITE_API_KEY.substring(0, 10)}...`);


    try {
        console.log(`🚀 Checking account access...`);
        const testRes = await fetch('https://connect.mailerlite.com/api/subscribers?limit=1', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
                'Accept': 'application/json'
            }
        });
        
        if (!testRes.ok) {
            const err = await testRes.text();
            console.error(`❌ Account check failed: ${testRes.status} ${err}`);
            return;
        }
        console.log(`✅ Account access verified!`);

        console.log(`🚀 Creating campaign: ${name}...`);

        
        // 1. Create the campaign object
        const createRes = await fetch('https://connect.mailerlite.com/api/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                name: name,
                type: 'regular',
                emails: [
                    {
                        subject: subject,
                        from_name: "AKA SOUNDS",
                        from: "info@akasounds.com"
                    }
                ],
                groups: [LEADS_GROUP_ID]
            })
        });

        const campaign = await createRes.json();
        if (!createRes.ok) {
            console.error("❌ Campaign creation failed:", JSON.stringify(campaign, null, 2));
            return;
        }

        const campaignId = campaign.data.id;

        console.log(`✅ Campaign created! ID: ${campaignId}`);

        // 2. Upload the HTML content
        console.log("📤 Uploading HTML content...");
        const contentRes = await fetch(`https://connect.mailerlite.com/api/campaigns/${campaignId}/content`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_API_KEY}`
            },
            body: JSON.stringify({
                html: html,
                plain: "Open in browser to see the full design."
            })
        });

        if (contentRes.ok) {
            console.log("🎉 SUCCESS! Draft created in MailerLite. Go check your 'Campaigns' section.");
        } else {
            const error = await contentRes.json();
            throw new Error(JSON.stringify(error));
        }

    } catch (err) {
        console.error("❌ Error creating campaign:", err.message);
    }
}

// Get arguments from command line
const [,, name, subject, htmlPath] = process.argv;

if (!name || !subject || !htmlPath) {
    console.error("❌ Usage: node scripts/create-campaign.mjs <name> <subject> <htmlPath>");
    process.exit(1);
}

import fs from 'fs';
const html = fs.readFileSync(htmlPath, 'utf8');

createCampaign(name, subject, html);
