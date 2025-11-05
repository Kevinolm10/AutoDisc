const express = require('express');
require('dotenv').config();

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

app.get('/test', (req, res) => {
    res.send('yo!')
    app.rateLimit
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Discord webhook URL: ${webhook}`);
})