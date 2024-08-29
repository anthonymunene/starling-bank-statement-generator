export const googleEmailConfig = {
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
    email: process.env.GOOGLE_EMAIL || "",
    recipient: 'digital.sanity.tester@gmail.com',
    subject: 'D3ployed Bank'
};

export const starlingAPIConfig = {
    accountUUID: process.env.STARLING_ACCOUNT_UUID,
    apiToken : process.env.STARLING_API_TOKEN
}