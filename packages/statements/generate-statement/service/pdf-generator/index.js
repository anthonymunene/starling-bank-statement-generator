import Starling from "starling-developer-sdk";
import {starlingAPIConfig} from "../variables.js";

export const getDaysInMonth = (monthNumber) => {
    try {
        const month = Number(monthNumber);

        if (Number.isNaN(month) || month < 1 || month > 12) {
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

export const generatePDF = async (dependencies = {getLastThreeMonthsPeriod, Starling}) => {
    const {accountUUID, apiToken} = starlingAPIConfig

    try {
        const client = new Starling({
            apiUrl: 'https://api.starlingbank.com',
            accessToken: `${apiToken}`
        })
        const currentDate = new Date()
       const {start, end} = getLastThreeMonthsPeriod(currentDate)
        const fileName = `d3ployed-statement-period-${start}-to-${end}.pdf`;
        const {data} = await client.account.getStatementForRange({
            accountUid: `${accountUUID}`,
            start,
            end,
            format: "application/pdf",
            responseType: "arraybuffer"
        })
        return {data, fileName}
        // return new Promise(resolve => {data, fileName})
    } catch (error) {
        console.log(error);
        return error;
    }
}