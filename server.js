const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const emailSender = require('./email-sender');

const app = express();
app.use(bodyParser.json());
app.use(cors())

app.post('/sendEmail', (req, res) => {
    emailSender(req.body).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(500).send();
    });
})

const listener = app.listen(process.env.PORT, function() {
    console.log('Listening on port ' + listener.address().port);
});
