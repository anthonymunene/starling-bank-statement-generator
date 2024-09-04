import {generatePDF} from "./service/pdf-generator/index.js";
import {sendEmail} from "./service/email/createEmail.js";
import {appConfig} from "./service/variables.js";


export const main = async () => {
    await generatePDF().then(async (result) => {
        await sendEmail(appConfig.recipient, appConfig.subject, result)
    })
    return {body: "Mail sent successfully"}

}