const {
  refreshShortcutButtonGetter,
  addItemDirectly,
  checkShortcutAvailability,
  expectItemCount,
} = require("../helper.js");

function cancelTransaction(app) {
  let shortcutButtons;
  describe("#F9", () => {
    beforeEach("add an item to trigger cancel transaction", async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);
      await addItemDirectly(app, "222");
    });

    it("cancel shortcut should be available", async () => {
      await checkShortcutAvailability(app, { mustAvailable: [8] });
    });

    describe("several test for cancel transaction shortcut", () => {
      let cancelCancelationButton, proceedCancellationButton;
      beforeEach("open cancel-transaction", async () => {
        await shortcutButtons[8].click();

        proceedCancellationButton = await app.client.$(".submenu .cancel-transaction .option-yes");
        cancelCancelationButton = await app.client.$(".submenu .cancel-transaction .option-no");
      });

      it("should not delete element if cancellation is cancelled", async () => {
        await cancelCancelationButton.click();

        await expectItemCount(app, 2);
      });

      it("should delete element if cancellation is proceeded", async () => {
        await proceedCancellationButton.click();
        await expectItemCount(app, 1);
      });
    });
  });
}

module.exports = cancelTransaction;
