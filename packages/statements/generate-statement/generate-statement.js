import {generatePDF} from "./service/pdf-generator/index.js";
import {sendEmail} from "./service/email/createEmail.js";
import { appConfig} from "./service/variables.js";


async function main() {
    await generatePDF().then(pdf => {
        sendEmail(appConfig.recipient, appConfig.subject, pdf)
    }).catch(error => {
        console.error(error)
    })
}

main()
