require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = async (requestBody) => {
    const createTransporter = async () => {
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'https://developers.google.com/oauthplayground');

        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) { reject(); }
                resolve(token);
            });
        });

        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.SOURCE_EMAIL,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            }
        });
    };

    const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
    };

    await sendEmail({
        from: `"MagoraBot 🤖" <${requestBody.email}>`,
        to: process.env.DESTINATION_EMAIL,
        subject: requestBody.subject,
        html: `<strong>Name:</strong> ${requestBody.name} <br/>
            <strong>E-mail:</strong> ${requestBody.email}  <br/>
            <strong>Message:</strong> ${requestBody.message}`});
}




