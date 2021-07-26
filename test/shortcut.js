const { sleep, checkShortcutAvailability } = require("./helper");
const expect = require("chai").expect;

const searchItemSuite = require("./shortcuts/f2"),
  paymentSuite = require("./shortcuts/f4"),
  saveTransaction = require("./shortcuts/f6");

function shortcut(app) {
  describe("#shortcuts", () => {
    it("should check shortcuts availability at the first time", async () => {
      await checkShortcutAvailability(app, { mustAvailable: [0, 1, 9, 11], mustNotAvailable: [3, 4, 5, 6, 8, 10] });
    });

    searchItemSuite(app);
    paymentSuite(app);
    saveTransaction(app);

    describe.skip("#F5", () => {});
  });
}

module.exports = shortcut;
