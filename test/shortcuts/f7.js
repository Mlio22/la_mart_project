const expect = require("chai").expect;
const {
  refreshShortcutButtonGetter,
  addItemDirectly,
  checkShortcutAvailability,
  sleep,
  expectItemCount,
} = require("../helper.js");

function openTransaction(app) {
  let shortcutButtons;
  describe("#F7", () => {
    beforeEach(async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);
    });

    it("open transaction should be available", async () => {
      await addItemDirectly(app, "121");
      await shortcutButtons[5].click();

      await checkShortcutAvailability(app, { mustAvailable: [6] });
    });

    describe("several test for #F7", () => {
      beforeEach("open the open transaction submenu", async () => {});

      describe("#slide tab", () => {
        let openTransactionElement, slideElements, firstElement, secondElement;

        beforeEach("get open transanction element", async () => {
          // add an item then save it
          await addItemDirectly(app, "121");
          await shortcutButtons[5].click();

          // open open-transaction menu
          await shortcutButtons[6].click();

          slideElements = await app.client.$$(".open-transaction .type-slider .type");
          firstElement = slideElements[0];
          secondElement = slideElements[1];

          openTransactionElement = await app.client.$(".submenu .open-transaction");
        });

        it("should slide tab using tab key", async () => {
          await openTransactionElement.keys("\ue004"); // tab key
          const secondElementClass = await secondElement.getAttribute("class");
          expect(secondElementClass).to.be.equal("type active");

          await openTransactionElement.keys("\ue004"); // tab key
          const firstElementClass = await firstElement.getAttribute("class");
          expect(firstElementClass).to.be.equal("type active");
        });

        it("should slide tab using mouse click", async () => {
          await secondElement.click();
          const secondElementClass = await secondElement.getAttribute("class");
          expect(secondElementClass).to.be.equal("type active");

          await firstElement.click();
          const firstElementClass = await firstElement.getAttribute("class");
          expect(firstElementClass).to.be.equal("type active");
        });
      });

      describe("#open saved", () => {
        it("should open saved transaction", async () => {
          // add new transaction and save it
          await addItemDirectly(app, "121");
          await shortcutButtons[5].click();

          // add new transaction (with different item list) and save it
          await addItemDirectly(app, "121");
          await addItemDirectly(app, "222");
          await shortcutButtons[5].click();

          // open open-transaction menu
          await shortcutButtons[6].click();

          // select the second transaction
          const savedElements = await app.client.$$(".open-transaction .content .content-item"),
            secondSavedElement = savedElements[1];

          await secondSavedElement.doubleClick();

          // add delay for item addition
          await sleep(200);
          // check the item list
          await expectItemCount(app, 3);
        });

        it("should open completed transaction", async () => {
          // add a new item and complete it
          await addItemDirectly(app, "121");
          await shortcutButtons[3].click();

          const paymentElement = await app.client.$(".cashier .submenu .payment");
          await paymentElement.keys("\ue007"); // enter

          // set open page
          await shortcutButtons[10].click();

          // open open-tranaction
          await shortcutButtons[6].click();

          const slideElements = await app.client.$$(".open-transaction .type-slider .type"),
            completedSlide = slideElements[1];

          await completedSlide.click();

          const completedTransaction = await app.client.$(".open-transaction .content .content-item");
          await completedTransaction.click();

          // add delay for item addition
          await sleep(200);
          await expectItemCount(app, 1);
        });
      });
    });
  });
}

module.exports = openTransaction;
