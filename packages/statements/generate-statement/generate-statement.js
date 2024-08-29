import {generatePDF} from "./service/pdf-generator/index.js";
import {sendEmail} from "./service/email/createEmail.js";
import {googleEmailConfig} from "./service/variables.js";


async function main() {
    await generatePDF().then(pdf => {
        sendEmail(googleEmailConfig.email, 'testing starling email')
    }).catch(error => {
        console.error(error)
    })
}

main()
