const {
  refreshShortcutButtonGetter,
  addItemDirectly,
  checkShortcutAvailability,
  expectItemCount,
} = require("../helper");

function newPage(app) {
  describe("#F11", () => {
    let shortcutButtons;

    beforeEach(async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);
    });

    it("should not be available if transaction is working", async () => {
      await checkShortcutAvailability(app, { mustNotAvailable: [10] });
    });

    describe("on a completed transaction", () => {
      beforeEach(async () => {
        // start a tranasction and finish it
        await addItemDirectly(app, "222");
        await shortcutButtons[3].click(); // finish the transaction

        const proceedPaymentButton = await app.client.$(".submenu .payment-actions button.proceed");
        await proceedPaymentButton.click();
      });

      it("should available if transaction finished", async () => {
        checkShortcutAvailability(app, { mustAvailable: [10] });
      });

      it("the itemlist should be cleared after shortcut selected and shortcut must not available", async () => {
        await shortcutButtons[10].click();

        await expectItemCount(app, 1);
        await checkShortcutAvailability(app, { mustNotAvailable: [10] });
      });

      it("must be available after a completed transaction is reopened", async () => {
        await shortcutButtons[10].click();

        // reopen completed transaction
        await shortcutButtons[6].click();

        // slide to completed seciton
        const sliders = await app.client.$$(".open-transaction .type-slider .type");
        await sliders[1].click();

        // select the first completed transaction
        const competedTransaction = await app.client.$(".open-transaction .content .content-item");
        await competedTransaction.click();

        await checkShortcutAvailability(app, { mustAvailable: [10] });
      });
    });
  });
}
module.exports = newPage;
