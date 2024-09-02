import {generatePDF} from "./service/pdf-generator/index.js";
import {sendEmail} from "./service/email/createEmail.js";
import { appConfig} from "./service/variables.js";


export const main = async () => {
    const pdf = await generatePDF()

    const result = await sendEmail(appConfig.recipient, appConfig.subject, pdf)
    return {body: result}
    // await generatePDF().then(async pdf => {
    //     return {body: `email sent to ${pdf}`}
    //     // await sendEmail(appConfig.recipient, appConfig.subject, pdf).then(result => {
    //     //     return {body: `email sent to ${result.envelope.to[0]}`}
    //     // })
    // }).catch(error => {
    //     console.error(`generateStatement Error: ${error}`)
    //     return {body:`generateStatement Error: ${error}` }
    // })

}
