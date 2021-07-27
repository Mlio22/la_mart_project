const { expect } = require("chai");
const { refreshShortcutButtonGetter, addItemDirectly } = require("../helper");

function checkBalance(app) {
  describe("#F12", () => {
    let shortcutButtons;

    const expectCashierBalance = async (a_value) => {
      // open check balance shortcut
      await shortcutButtons[11].click();

      const balanceElement = await app.client.$(".submenu .check-balance .balance-content"),
        balanceValue = await balanceElement.getValue();

      expect(balanceValue).to.be.equal(a_value);
    };

    const addItemAndAction = async (action = "save", barcodes = []) => {
      for (const barcode of barcodes) {
        await addItemDirectly(app, barcode);
      }

      if (action === "save") {
        await shortcutButtons[5].click();
      }

      if (action === "complete") {
        // complete the transaction and start the new
        await shortcutButtons[3].click();

        const proceedPaymentButton = await app.client.$(".submenu .payment-actions button.proceed");
        await proceedPaymentButton.click();
      }
    };

    beforeEach(async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);
    });

    it("should show 0 in the price at start", async () => {
      await expectCashierBalance("0");
    });

    it("should correspond with completed transactions but not with saved transactions", async () => {
      // add certain transaction with completed or saved
      await addItemAndAction("complete", ["222", "121"]); // total: 221.000
      await expectCashierBalance("221.000");
      // clear transaction
      await shortcutButtons[10];

      await addItemAndAction("complete", ["222", "132"]); // total: 32.000
      await expectCashierBalance("252.000");
      // clear transaction
      await shortcutButtons[10];

      await addItemAndAction("save", ["231", "221"]); //total : 12.500
      await expectCashierBalance("252.000");
    });
  });
}

module.exports = checkBalance;
