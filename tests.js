"use strict";

const assert = require("assert");
const {
  daysBetween,
  addDays,
  todayKey,
  validatePeriod,
  computeCycle,
} = require("./app.js");

/* date math */
assert.strictEqual(daysBetween("2026-08-13", "2026-09-10"), 28);
assert.strictEqual(daysBetween("2026-01-01", "2026-01-01"), 0);
assert.strictEqual(daysBetween("2026-02-28", "2026-03-01"), 1); // non-leap February
assert.strictEqual(daysBetween("2026-12-31", "2027-01-01"), 1); // year boundary
assert.strictEqual(daysBetween("2026-09-10", "2026-09-14"), 4);

assert.strictEqual(addDays("2026-09-10", 28), "2026-10-08");
assert.strictEqual(addDays("2026-12-20", 20), "2027-01-09");
assert.strictEqual(addDays("2026-03-01", -1), "2026-02-28");

/* validation */
assert.ok(validatePeriod("", "2026-09-14"), "missing start rejected");
assert.ok(validatePeriod("2026-09-14", "2026-09-10"), "end before start rejected");
assert.ok(validatePeriod("not-a-date", ""), "invalid start rejected");
assert.strictEqual(validatePeriod("2026-09-10", "2026-09-14"), null);
assert.strictEqual(validatePeriod("2026-09-10", "2026-09-10"), null); // one-day period
assert.strictEqual(validatePeriod("2026-09-10", ""), null); // ongoing allowed

/* empty history */
assert.strictEqual(computeCycle([], 28).empty, true);

/* single period -> default cycle length, limited history */
let c = computeCycle([{ id: "1", start: "2026-09-10", end: "2026-09-14" }], 28);
assert.strictEqual(c.empty, false);
assert.strictEqual(c.limited, true);
assert.strictEqual(c.avgCycle, 28);
assert.strictEqual(c.next, "2026-10-08");
assert.strictEqual(c.avgDuration, 5);

/* single period honours configurable default */
c = computeCycle([{ id: "1", start: "2026-09-10", end: "2026-09-14" }], 32);
assert.strictEqual(c.avgCycle, 32);
assert.strictEqual(c.next, "2026-10-12");

/* two periods -> average from history */
c = computeCycle(
  [
    { id: "1", start: "2026-08-13", end: "2026-08-17" },
    { id: "2", start: "2026-09-10", end: "2026-09-14" },
  ],
  28
);
assert.strictEqual(c.limited, false);
assert.strictEqual(c.avgCycle, 28);
assert.strictEqual(c.last.start, "2026-09-10");
assert.strictEqual(c.next, "2026-10-08");

/* uneven cycle lengths -> rounded average, order-independent */
const uneven = [
  { id: "a", start: "2026-07-29", end: "2026-08-02" },
  { id: "b", start: "2026-07-01", end: "2026-07-05" },
  { id: "c", start: "2026-08-28", end: "2026-09-01" },
];
c = computeCycle(uneven, 28);
assert.strictEqual(c.lengths.length, 2); // 28 + 30
assert.strictEqual(c.avgCycle, 29);

/* relative-to-today: status, countdown, on-period detection */
const start = addDays(todayKey(), -10);
const end = addDays(todayKey(), -5);
c = computeCycle([{ id: "r", start, end }], 28);
assert.strictEqual(c.onPeriod, false);
assert.strictEqual(c.cycleDay, 11);
assert.strictEqual(c.daysUntil, 18);

c = computeCycle([{ id: "r", start: addDays(todayKey(), -2), end: todayKey() }], 28);
assert.strictEqual(c.onPeriod, true);
assert.strictEqual(c.periodDay, 3);

/* ongoing period (no end) counts as on period once started */
c = computeCycle([{ id: "r", start: addDays(todayKey(), -1), end: null }], 28);
assert.strictEqual(c.onPeriod, true);
assert.strictEqual(c.periodDay, 2);

console.log("All tests passed.");
