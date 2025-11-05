const express = require('express');
require('dotenv').config();

const crypto = require('crypto');

const app = express();
app.use(express.json())

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
})

app.use(limiter);

const port = process.env.PORT;
const webhook = process.env.DISCORD_WEBHOOK;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

app.post('/github-webhook', async (req, res) => {
    app.rateLimit

    const signature = req.headers['x-hub-signature-256']
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET)
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature !== digest ) {
        console.log('❌ Signature mismatch!');
        console.log('Expected:', digest);
        console.log('Got:', signature);
        return res.status(401).send('Unauthorized')
    }

    const data = req.body
    console.log('Received push from Github:', JSON.stringify(data, null, 2))

    const repoName = data.repository?.name || 'Unknown';
    const pusher = data.pusher?.name || 'Unknown';
    const commitMsg = data.commits?.[0]?.message || 'No message';

    await fetch(webhook, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            content: `🚀 ${pusher} pushed to ${repoName}: "${commitMsg}"`
        })
    })


    res.status(200).send('Webhook received');
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})