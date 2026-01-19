import axios from "axios";
import PDFDocument from "pdfkit";
import {subMonths, getMonth, getYear, format} from "date-fns";
import {starlingAPIConfig, appConfig} from "../variables.js";

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

const sanitiseMonth = (month) => month < 10 ? `0${month}`: `${month}`
const humanReadableMonth = (date) => getMonth(date) + 1

export const getLastThreeMonthsPeriod = (currentDate) => {
    const toYear = currentDate.getFullYear();
    const  currentDateFormat = format(currentDate, "yyyy-MM-dd")
    const getLastThreeMonths = subMonths(currentDate, 4)
    const fromYear = getYear(getLastThreeMonths)
    const toMonth = sanitiseMonth(humanReadableMonth(currentDateFormat));
    const fromMonth = sanitiseMonth(humanReadableMonth(getLastThreeMonths)); // we want the previous month's invoice as we always generate these on the first
    return {start: `${fromYear}-${fromMonth}-${getDaysInMonth(fromMonth)}`, end: `${toYear}-${toMonth}-01`};
}

/**
 * Parse CSV string into array of objects
 * @param {string} csvString - Raw CSV data
 * @returns {Array<Object>} Array of row objects with header keys
 */
export const parseCSV = (csvString) => {
    const lines = csvString.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
        });
        rows.push(row);
    }

    return rows;
};

/**
 * Convert CSV data to PDF buffer
 * @param {string} csvString - Raw CSV data
 * @param {string} startDate - Statement start date
 * @param {string} endDate - Statement end date
 * @returns {Promise<Buffer>} PDF buffer
 */
export const convertCSVtoPDF = (csvString, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        try {
            const transactions = parseCSV(csvString);
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(18).font('Helvetica-Bold').text('Bank Statement', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica').text(appConfig.company || 'Account Statement', { align: 'center' });
            doc.moveDown(0.3);
            doc.fontSize(10).text(`Period: ${startDate} to ${endDate}`, { align: 'center' });
            doc.moveDown(1);

            // Table header
            const tableTop = doc.y;
            const colWidths = { date: 70, description: 220, amount: 80, balance: 80 };
            const startX = 40;

            doc.fontSize(9).font('Helvetica-Bold');
            doc.text('Date', startX, tableTop);
            doc.text('Description', startX + colWidths.date, tableTop);
            doc.text('Amount', startX + colWidths.date + colWidths.description, tableTop, { width: colWidths.amount, align: 'right' });
            doc.text('Balance', startX + colWidths.date + colWidths.description + colWidths.amount, tableTop, { width: colWidths.balance, align: 'right' });

            // Line under header
            doc.moveTo(startX, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.moveDown(1);

            // Table rows
            doc.font('Helvetica').fontSize(8);
            let y = doc.y;

            transactions.forEach((tx, index) => {
                // Check if we need a new page
                if (y > 750) {
                    doc.addPage();
                    y = 50;
                }

                // Extract transaction data - field names match Starling CSV format
                const date = tx.Date || tx.date || tx['Transaction Date'] || '';
                const description = tx.Reference || tx.reference || tx.Description || tx.description || tx.Narrative || '';
                const amount = tx['Amount (GBP)'] || tx.Amount || tx.amount || '';
                const balance = tx['Balance (GBP)'] || tx.Balance || tx.balance || tx['Running Balance'] || '';

                doc.text(date.substring(0, 10), startX, y, { width: colWidths.date });
                doc.text(description.substring(0, 45), startX + colWidths.date, y, { width: colWidths.description });
                doc.text(amount, startX + colWidths.date + colWidths.description, y, { width: colWidths.amount, align: 'right' });
                doc.text(balance, startX + colWidths.date + colWidths.description + colWidths.amount, y, { width: colWidths.balance, align: 'right' });

                y += 15;
            });

            // Footer
            doc.moveDown(2);
            doc.fontSize(8).text(`Generated on ${new Date().toISOString().split('T')[0]}`, { align: 'center' });
            doc.text(`Total transactions: ${transactions.length}`, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Fetches statement data using the new feed-export API endpoint
 * This replaces the deprecated /statement/downloadForDateRange endpoint
 * The feed-export endpoint returns CSV data which is converted to PDF
 * @see https://developer.starlingbank.com/docs - Starling API Documentation
 */
export const generateStatement = async (dependencies = {getLastThreeMonthsPeriod, axios, convertCSVtoPDF}) => {
    const {accountUUID, apiToken} = starlingAPIConfig
    const apiUrl = 'https://api.starlingbank.com';

    try {
        const currentDate = new Date()
        const {start, end} = dependencies.getLastThreeMonthsPeriod(currentDate)
        const fileName = `d3ployed-statement-period-${start}-to-${end}.pdf`;

        // Using the new feed-export endpoint as per Starling API deprecation notice
        // Replaces: GET /api/v2/accounts/{accountUid}/statement/downloadForDateRange
        // New endpoint: GET /api/v2/accounts/{accountUid}/feed-export
        const url = `${apiUrl}/api/v2/accounts/${accountUUID}/feed-export`;

        const response = await dependencies.axios({
            method: 'GET',
            url,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'text/csv'
            },
            params: {
                start,
                end
            }
        });

        // Convert CSV response to PDF
        const csvString = typeof response.data === 'string' ? response.data : response.data.toString();
        const pdfBuffer = await dependencies.convertCSVtoPDF(csvString, start, end);

        return {data: pdfBuffer, fileName}
    } catch (error) {
        console.log('Error fetching statement from Starling API:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data?.toString());
        }
        throw error;
    }
}

// Keep the old function name as an alias for backward compatibility
export const generatePDF = generateStatement;