const { sleep, checkShortcutAvailability } = require("./helper");

const searchItemSuite = require("./shortcuts/f2"),
  paymentSuite = require("./shortcuts/f4"),
  saveTransactionSuite = require("./shortcuts/f6"),
  openTransactionSuite = require("./shortcuts/f7"),
  cancelTransactionSuite = require("./shortcuts/f9"),
  closeCashierSuite = require("./shortcuts/f10"),
  newPageSuite = require("./shortcuts/f11"),
  checkBalanceSuite = require("./shortcuts/f12");

function shortcut(app) {
  describe("#shortcuts", () => {
    it("should check shortcuts availability at the first time", async () => {
      await checkShortcutAvailability(app, { mustAvailable: [0, 1, 9, 11], mustNotAvailable: [3, 4, 5, 6, 8, 10] });
    });

    searchItemSuite(app);
    paymentSuite(app);
    saveTransactionSuite(app);
    openTransactionSuite(app);
    cancelTransactionSuite(app);
    closeCashierSuite(app);
    newPageSuite(app);
    checkBalanceSuite(app);

    describe.skip("#F5", () => {});
  });
}

module.exports = shortcut;
