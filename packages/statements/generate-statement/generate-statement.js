import {generatePDF} from "./service/pdf-generator/index.js";
import {sendEmail} from "./service/email/createEmail.js";
import { appConfig} from "./service/variables.js";


export const main = async () => {
    await generatePDF().then(async pdf => {
        await sendEmail(appConfig.recipient, appConfig.subject, pdf).then(result => {
            return {body: `email sent to ${result.envelope.to[0]}`}
        })
    }).catch(error => {
        console.error(error)
    })
}
