import {sendEmailService} from "./sendEmail.js";
import {appConfig} from "../variables.js";

export const getEmailHTML = (title) => `<html lang="uk">
<head>
    <title>${title}</title>
</head>
<body>
    <p>Dear ${appConfig.recipientName},</p>
    <p>Find attached the last 3 months of bank statements for ${appConfig.company}</p>
    <p>Regards</p>
    <p style="font-size: small">Anthony Munene</p>
    <p>${appConfig.company}</p>
</body>
</html>`;

export const sendEmail = async (to, subject, attachment) => {
    const html = getEmailHTML(subject);
    await sendEmailService(to, subject, html, attachment);
};