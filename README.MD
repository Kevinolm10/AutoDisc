# GitHub to Discord Webhook Notifier

A simple Node.js server that automatically sends Discord notifications whenever code is pushed to a GitHub repository.

## What I Learned

- **Webhooks**: How applications can send real-time data to each other without constant polling
- **Authentication**: Using HMAC signatures to verify webhook requests are legitimate
- **Express.js**: Building a server with endpoints to receive POST requests
- **Environment Variables**: Securing sensitive data like API keys and secrets
- **Ngrok**: Exposing local servers to the internet for testing
- **Async/Await**: Handling asynchronous operations when sending data to Discord

## How It Works

1. You push code to your GitHub repository
2. GitHub automatically sends a webhook (POST request) to your server
3. Server verifies the request is really from GitHub using signature validation
4. Server extracts commit information (repo name, pusher, commit message)
5. Server forwards a formatted message to Discord
6. Discord displays the notification instantly

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **Crypto** - Built-in Node.js module for signature verification
- **dotenv** - Environment variable management
- **express-rate-limit** - Rate limiting to prevent abuse
- **GitHub Webhooks** - Event-driven data from GitHub
- **Discord Webhooks** - Sending messages to Discord channels
- **Ngrok** - Local development tunneling (development only)

## Setup Instructions

### Prerequisites
- Node.js installed
- GitHub repository (with admin access)
- Discord server (with permission to create webhooks)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
PORT=3000
DISCORD_WEBHOOK=your_discord_webhook_url_here
GITHUB_SECRET=your_github_secret_here
```

4. Get your Discord webhook URL
   - Go to Discord Server Settings → Integrations → Webhooks
   - Create New Webhook
   - Copy the webhook URL

5. Set up GitHub webhook
   - Go to your repository → Settings → Webhooks → Add webhook
   - **Payload URL**: `https://your-server-url/github-webhook`
   - **Content type**: `application/json`
   - **Secret**: Create a secret (same as in your `.env` file)
   - **Events**: Select "Just the push event"
   - Click "Add webhook"

### Running Locally (Development)

1. Start your server
```bash
node server.js
```

2. In a new terminal, start ngrok
```bash
ngrok http 3000
```

3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

4. Update GitHub webhook URL to: `https://abc123.ngrok.io/github-webhook`

5. Push code and watch Discord for notifications!

## Project Structure
```
.
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (not committed)
├── .gitignore         # Files to ignore in git
└── README.md          # This file
```

## Key Code Concepts

### Signature Verification
```javascript
const signature = req.headers['x-hub-signature-256'];
const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

if (signature !== digest) {
    return res.status(401).send('Unauthorized');
}
```
This ensures only GitHub can send valid webhooks to your server.

### Rate Limiting
```javascript
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 100,                  // 100 requests per minute
});
```
Prevents abuse by limiting request frequency.

## Future Development Ideas

- [ ] Add support for multiple repositories
- [ ] Include branch information in Discord message
- [ ] Add different emojis based on commit keywords (🐛 for "fix", ✨ for "feat")
- [ ] Filter notifications by branch (only notify for `main` branch)
- [ ] Add pull request notifications
- [ ] Include commit author avatar in Discord embed
- [ ] Add database to log all webhooks
- [ ] Create a web dashboard to view webhook history
- [ ] Support other events (issues, pull requests, releases)
- [ ] Add Slack/Telegram support alongside Discord

## Deployment (24/7 Hosting)

To run this continuously, deploy to a hosting service:

**Recommended: Render.com (Free)**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Add environment variables
5. Deploy
6. Update GitHub webhook with Render URL

**Other options:**
- Railway.app
- Fly.io
- DigitalOcean
- Heroku

## Troubleshooting

**Discord message not appearing?**
- Check console for errors
- Verify DISCORD_WEBHOOK URL is correct
- Test Discord webhook manually with curl

**GitHub webhook failing?**
- Check signature verification logs
- Ensure GITHUB_SECRET matches in both .env and GitHub settings
- Verify server is publicly accessible (ngrok running)

**Server not starting?**
- Run `npm install` to ensure dependencies are installed
- Check `.env` file exists and has all required variables
- Verify port 3000 isn't already in use

## Security Notes

- Never commit `.env` file to git
- Keep your GITHUB_SECRET and DISCORD_WEBHOOK private
- Rate limiting is enabled to prevent abuse
- Signature verification ensures webhook authenticity

## License

MIT

## What I Found Interesting

The most interesting part was understanding how webhooks reverse the typical API flow. Instead of constantly asking "is there new data?", the server just waits and gets notified instantly when something happens. It's way more efficient and makes real-time integrations possible without wasting resources.

Also learned that security is crucial - without signature verification, anyone could spam your endpoint with fake data!