import {getDaysInMonth, getLastThreeMonthsPeriod} from "../service/pdf-generator/index.js";
import {describe, it} from "node:test"
import assert from 'node:assert/strict'

describe('PDF generator', () => {
    it("should generate the correct last day for a given month", () =>{
        const lastDay = getDaysInMonth("07")
        assert.equal(lastDay,31)
    })
    it('should generate the last 3 months based on the current month being the 1st', () => {
        const firstOfTheMonth = new Date('2024-05-01')
        const {start, end} = getLastThreeMonthsPeriod(firstOfTheMonth)
        assert.equal(start, '2024-01-31')
        assert.equal(end, '2024-05-01')
    });

    it("should generate the previous years if the last 3 months happens before march", () => {
        const firstOfTheMonth = new Date('2025-02-01')
        const {start, end} = getLastThreeMonthsPeriod(firstOfTheMonth)
        assert.equal(start, '2024-10-31')
        assert.equal(end, '2025-02-01')
    })
});