import {getDaysInMonth, getLastThreeMonthsPeriod} from "../service/pdf-generator/index.js";
import {describe, it} from "node:test"
import assert from 'node:assert/strict'

describe('PDF generator', () => {
    it("should generate the correct last day for a given month", () =>{
        const lastDay = getDaysInMonth("07")
        assert.equal(lastDay,31)
    })
    it('should generate the last 3 months based on the current month being the 1st', () => {
        const firstOfTheMonth = new Date('August 01, 2024 00:01:00')
        const {start, end} = getLastThreeMonthsPeriod(firstOfTheMonth)
        assert.equal(start, '2024-05-01')
        assert.equal(end, '2024-07-31')
    });
});