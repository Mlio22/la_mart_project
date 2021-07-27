const { expect } = require("chai");
const { refreshShortcutButtonGetter, addItemDirectly, checkShortcutAvailability } = require("../helper");

function closeCashier(app) {
  let shortcutButtons;

  describe("#F10", () => {
    beforeEach(async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);
    });

    it("should not available if a transaction is working", async () => {
      await addItemDirectly(app, "222");
      await checkShortcutAvailability(app, { mustNotAvailable: [9] });
    });

    it("should close cashier if clicked", async () => {
      await shortcutButtons[9].click();

      const totalWindow = await app.client.getWindowCount();
      expect(totalWindow).to.be.equal(1);

      // reopen the cashier
      await app.client.windowByIndex(0);
      const cashierButton = await app.client.$(".menusWrapper__menu.open-cashier");
      await cashierButton.click();

      // focus to second window (cashier)
      await app.client.windowByIndex(1);
    });
  });
}

module.exports = closeCashier;
