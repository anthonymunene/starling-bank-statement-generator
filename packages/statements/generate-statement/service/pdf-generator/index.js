import fs from "fs";
import Starling from "starling-developer-sdk";
import {starlingAPIConfig} from "../variables.js";

export const downloadPDF = async (pdf, start, end) => {

    const fileName = `d3ployed-statement-period-${start}-to-${end}.pdf`
    fs.writeFileSync(fileName, pdf)
    console.log(`${fileName} saved successfully`)
}

export const getDaysInMonth = (monthNumber) => {
    try {
        const month = Number(monthNumber);

        if (isNaN(month) || month < 1 || month > 12) {
            throw new Error("Invalid month number. Please enter a number between 1 and 12.");
        }

        const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return daysInMonth[month];
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

export const getLastThreeMonthsPeriod = (currentDate) => {
    const year = currentDate.getFullYear();
    const fromMonth = (currentDate.getMonth() - 2).toString().padStart(2, '0');
    const toMonth = (currentDate.getMonth()).toString().padStart(2, '0'); // we want the previous month's invoice as we always generate these on the first
    return {start: `${year}-${fromMonth}-01`, end: `${year}-${toMonth}-${getDaysInMonth(toMonth)}`};
}

export const generatePDF = async (dependencies = {getLastThreeMonthsPeriod, downloadPDF, Starling}) => {
    const {accountUUID, apiToken} = starlingAPIConfig

    try {
        const client = new Starling({
            apiUrl: 'https://api.starlingbank.com',
            accessToken: `${apiToken}`
        })
        const currentDate = new Date()
        const {start, end} = getLastThreeMonthsPeriod(currentDate)
        client.account.getStatementForRange({
            accountUid: `${accountUUID}`,
            start,
            end,
            format: "application/pdf",
            responseType: "arraybuffer"
        }).then(async ({data}) => {
            await downloadPDF(data, start, end).then(() => {
            });
        })

    } catch (error) {
        console.log(error);
        return error;
    }
}