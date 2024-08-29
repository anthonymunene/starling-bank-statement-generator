import {sendEmailService} from "./sendEmail.js";

export const getEmailHTML = (title) => `<html lang="uk">
<head>
    <title>${title}</title>
</head>
<body>
    <h1>${title}</h1>
    <p>Find attached the last 3 months of bank statements for D3ployed Ltd</p>
    <p>Regards</p>
    <p style="font-size: small">Anthony Munene</p>
</body>
</html>`;

export const sendEmail = async (to, subject) => {
    const html = getEmailHTML(subject, "This is a test email");
    await sendEmailService(to, subject, html);
};