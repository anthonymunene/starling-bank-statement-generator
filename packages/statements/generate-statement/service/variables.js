export const googleEmailConfig = {
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    email: process.env.GOOGLE_EMAIL,
};
export const appConfig = {
    recipient: process.env.RECIPIENT_EMAIL,
    recipientName: process.env.RECIPIENT_NAME,
    subject: process.env.MAIL_SUBJECT,
    company: process.env.COMPANY
}

export const starlingAPIConfig = {
    accountUUID: process.env.STARLING_ACCOUNT_UUID,
    apiToken: process.env.STARLING_API_TOKEN
}