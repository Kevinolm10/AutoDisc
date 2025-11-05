const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');

app.use(express.json())

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later'
})

app.use(limiter);

const discWebhook = 'https://discordapp.com/api/webhooks/1435719141008080926/igAUdpPex1AxlQvCjLrL1i16K8Sgf6nZiKra3BnG-4zmGEjWSSyjrIXIH81YskttBv9m'

app.get('/test', (req, res) => {
    res.send('yo!')
    app.rateLimit
})


app.listen(8000, () => {
    console.log('server is listening on port 8000')
})