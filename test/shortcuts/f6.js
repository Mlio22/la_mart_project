const { refreshShortcutButtonGetter, addItemDirectly, checkShortcutAvailability } = require("../helper.js");
const expect = require("chai").expect;

function saveTransaction(app) {
  describe("#F6", () => {
    let shortcutButtons;
    beforeEach("added item before testing the submenu", async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);

      await addItemDirectly(app, "121");
    });

    it("save transaction shortcut should be available", async () => {
      await checkShortcutAvailability(app, { mustAvailable: [5] });
    });

    it("should wipe the transaction after save trasanction is clicked", async () => {
      await shortcutButtons[5].click();

      const items = await app.client.$$(".purchases-contents");
      expect(items.length).to.be.equal(1);
    });
  });
}

module.exports = saveTransaction;
