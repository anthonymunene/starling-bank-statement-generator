import {createTransport} from "nodemailer";
import OAuth2Client from "./auth.js";
import {googleEmailConfig} from "../variables.js";

export const sendEmailService = async (
    to,
    subject,
    html,
    attachment,
    dependencies = {
        authClient: OAuth2Client,
        mailClient: createTransport
    }
) => {
    const {authClient, mailClient} = dependencies
    try {
        authClient.setCredentials({
            refresh_token: googleEmailConfig.refreshToken,
        });
        const accessToken = await authClient.getAccessToken();
        const transportOptions = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: googleEmailConfig.email,
                clientId: googleEmailConfig.clientId,
                clientSecret: googleEmailConfig.clientSecret,
                refreshToken: googleEmailConfig.refreshToken,
                accessToken: accessToken.token,
            },
        };
        const smtpTransport = mailClient(transportOptions);
        const mailOptions = {
            from: googleEmailConfig.email,
            to,
            subject,
            html,
            attachment
        };
        await smtpTransport.sendMail(mailOptions).then(info => console.log(info));
    } catch (error) {
        console.error(error);
    }
};