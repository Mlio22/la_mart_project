const {
  sleep,
  refreshElementGetters,
  addItemDirectly,
  addItemThroughSearchItem,
  expectItemCount,
  expectItemValues,
  expectSummaryPriceValue,
  deleteItemByIndex,
} = require("./helper");

const expect = require("chai").expect;

function item(app) {
  describe("#items", () => {
    let actionButtons, barcodeInputs, names, quantities, prices, amountInputs, totalPrices, searchItemElement;

    const refreshElementGettersInItem = async () => {
      const itemElements = await refreshElementGetters(app);
      [actionButtons, barcodeInputs, names, quantities, prices, amountInputs, totalPrices, searchItemElement] =
        itemElements;
    };

    beforeEach("refreshing element getter", async () => {
      await refreshElementGettersInItem();

      // always check first element after refreshing
      // check first item content status
      await expectItemCount(app, 1);
      expect(await actionButtons[0].getAttribute("disabled")).to.be.string("true");
    });

    describe("adding items", () => {
      describe("add item directly", () => {
        it("add item (directly correct)", async () => {
          // add one item
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");
        });

        it("add multiple items (directly correct)", async () => {
          // add 6 items, because AVAILABLE_ITEM has only 5 items, 1 of it must be duplicated
          await addItemDirectly(app, "222");
          await addItemDirectly(app, "221");
          await addItemDirectly(app, "121");
          await addItemDirectly(app, "222");
          await addItemDirectly(app, "132");
          await addItemDirectly(app, "231");

          await expectItemCount(app, 6);

          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(app, 1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 2, [null, "121", "A", "200.000", "Kotak", "1", "200.000"]);
          await expectItemValues(app, 3, [null, "132", "B", "10.000", "Box", "1", "10.000"]);
          await expectItemValues(app, 4, [null, "231", "D", "10.500", "Pcs", "1", "10.500"]);
          await expectItemValues(app, 5, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "264.500");
        });
      });

      describe("add through search item", () => {
        it("add item", async () => {
          //   enter 22 to first barcode, the first item on searchItem index will be selected automatically, check addItemThroughSearchItem for details
          await addItemThroughSearchItem(app, "22");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "2.000");
        });

        it("add different items", async () => {
          // add first item throught searchItem
          await addItemThroughSearchItem(app, "22");

          await expectItemCount(app, 2);
          expect(await actionButtons[0].getAttribute("disabled")).to.be.null;

          // add second item
          await addItemThroughSearchItem(app, "22", 1);

          await refreshElementGettersInItem();

          await expectItemCount(app, 3);
          await expectItemValues(app, 0, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 1, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 2, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "23.000");
        });

        it("add duplicated items", async () => {
          // add first item throught searchItem
          await addItemThroughSearchItem(app, "22");

          await refreshElementGettersInItem();
          await expectItemCount(app, 2);
          expect(await actionButtons[0].getAttribute("disabled")).to.be.null;

          // add second item (the same item as above)
          await addItemThroughSearchItem(app, "22");

          await refreshElementGettersInItem();

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "221", "C", "2.000", "Sachet", "2", "4.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "4.000");
        });
      });

      describe("hybridly add item (through searchitem and directly)", () => {
        it("add one item directly and one item through searchItem (different items)", async () => {
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");

          await addItemThroughSearchItem(app, "22");

          await expectItemCount(app, 3);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 2, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "23.000");
        });

        it("add one item directly and one item through search item (duplicate)", async () => {
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");

          await addItemThroughSearchItem(app, "22", 1);

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "42.000");
        });

        it("add one item directly and one item through searchItem (different items) and add one item more from direct (diferent)", async () => {
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");

          await addItemThroughSearchItem(app, "22");

          await expectItemCount(app, 3);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 2, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "23.000");

          await addItemDirectly(app, "121");

          await expectItemCount(app, 4);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 2, [null, "121", "A", "200.000", "Kotak", "1", "200.000"]);
          await expectItemValues(app, 3, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "223.000");
        });

        it("add one item directly and one item through search item (duplicate) and add  one item more from direct (duplicate)", async () => {
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");

          await addItemThroughSearchItem(app, "22", 1);

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "42.000");

          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "3", "63.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "63.000");
        });

        it("add one item directly and one item through searchItem (different items) and add one item more from searchItem (diferent)", async () => {
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");

          await addItemThroughSearchItem(app, "22");

          await expectItemCount(app, 3);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 2, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "23.000");

          await addItemThroughSearchItem(app, "12");

          await expectItemCount(app, 4);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(app, 2, [null, "121", "A", "200.000", "Kotak", "1", "200.000"]);
          await expectItemValues(app, 3, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "223.000");
        });

        it("add one item directly and one item through search item (duplicate) and add  one item more from searchItem (duplicate)", async () => {
          await addItemDirectly(app, "222");

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "21.000");

          await addItemThroughSearchItem(app, "22", 1);

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "42.000");

          await addItemThroughSearchItem(app, "22", 1);

          await expectItemCount(app, 2);
          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "3", "63.000"]);
          await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
          await expectSummaryPriceValue(app, "63.000");
        });
      });
    });

    describe("deleting item", () => {
      it("deletes an item", async () => {
        await addItemDirectly(app, "222");
        await addItemDirectly(app, "221");

        // deletes first item
        await deleteItemByIndex(app);

        // checking
        await expectItemCount(app, 2);
        await expectItemValues(app, 0, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
        await expectItemValues(app, 1, ["true", "", "", "0", "", "1", "0"]);
        await expectSummaryPriceValue(app, "2.000");
      });

      it("deletes multiple item", async () => {
        await addItemDirectly(app, "222");
        await addItemDirectly(app, "221");

        await deleteItemByIndex(app, 1);
        await deleteItemByIndex(app);

        await expectItemCount(app, 1);
        await expectItemValues(app, 0, ["true", "", "", "0", "", "1", "0"]);
        await expectSummaryPriceValue(app, "0");
      });
    });

    describe("modifying item", () => {
      describe("changing item amount", () => {
        it("should change amount by amount element", async () => {
          await addItemDirectly(app, "222");

          const amountElement = amountInputs[0];
          await amountElement.click(); // focus to that element
          await amountElement.keys("\ue013"); // arrow up

          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectSummaryPriceValue(app, "42.000");

          await amountElement.keys("\ue015"); // arrow down

          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectSummaryPriceValue(app, "21.000");
        });

        it("should change amount by arrow button in barcode input. before barcode input", async () => {
          await barcodeInputs[0].keys("\ue013"); // arrow up
          await expectItemValues(app, 0, ["true", "", "", "0", "", "2", "0"]);

          await barcodeInputs[0].keys("\ue015"); // arrow down
          await expectItemValues(app, 0, ["true", "", "", "0", "", "1", "0"]);

          await barcodeInputs[0].keys("\ue013"); // arrow up
          await addItemDirectly(app, "222");

          await expectItemValues(app, 0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectSummaryPriceValue(app, "42.000");
        });
      });
    });
  });
}

module.exports = item;
