const { sleep } = require("./helper");
const expect = require("chai").expect;

async function item(app) {
  describe("#items", () => {
    let actionButtons, barcodeInputs, names, quantities, prices, amountInputs, totalPrices, searchItemElement;

    beforeEach("refreshing", async () => {
      app.client.refresh();
      await refreshElementGetters();

      // always check first element after refreshing
      // check first item content status
      expect(barcodeInputs.length).to.be.equal(1);
      expect(await actionButtons[0].getAttribute("disabled")).to.be.string("true");
    });

    async function refreshElementGetters() {
      actionButtons = await app.client.$$(".cashier .action-content button");
      barcodeInputs = await app.client.$$(".cashier .barcode-content input");
      names = await app.client.$$(".cashier .name-content");
      quantities = await app.client.$$(".cashier .type-content");
      prices = await app.client.$$(".cashier .price-content");
      amountInputs = await app.client.$$(".cashier .amount-content input");
      totalPrices = await app.client.$$(".cashier .total-price-content");
    }

    const addDirectly = async (barcode) => {
      // add item directly. the barcode must be precise, or it'll open searchItem
      await refreshElementGetters();

      // add the barcode to latest item
      await barcodeInputs[barcodeInputs.length - 1].setValue(barcode);
      await barcodeInputs[barcodeInputs.length - 1].keys("\uE007"); // enter
      await sleep(75);

      await refreshElementGetters();
    };

    const addThroughSearchItem = async (starterBarcode, searchItemIndex = 0) => {
      // add item through searchItem. must be not precise, otherwise it'll set directly and searchItem won't open
      await refreshElementGetters();

      // add the starter barcode to latest item
      await barcodeInputs[barcodeInputs.length - 1].setValue(starterBarcode);
      await barcodeInputs[barcodeInputs.length - 1].keys("\uE007"); // enter

      searchItemElement = await app.client.$(".cashier .submenu .search-item");
      expect(await searchItemElement.isDisplayed()).to.be.true;

      // select item on searchItem
      for (i = 0; i < searchItemIndex; i++) {
        await searchItemElement.keys("\ue015"); // down arrow
      }

      await searchItemElement.keys("\uE007"); // enter
      await refreshElementGetters();
    };

    const expectItemValues = async (itemIndex, itemValues) => {
      await refreshElementGetters();
      // check item values
      const [a_action, a_barcode, a_name, a_price, a_quantity, a_amount, a_totalPrice] = itemValues;

      const actionButtonStatus = await actionButtons[itemIndex].getAttribute("disabled"),
        barcodeInput = await barcodeInputs[itemIndex].getValue(),
        name = await names[itemIndex].getText(),
        price = await prices[itemIndex].getText(),
        quantity = await quantities[itemIndex].getText(),
        amountInput = await amountInputs[itemIndex].getValue(),
        totalPrice = await totalPrices[itemIndex].getText();

      // expecting
      expect(actionButtonStatus).to.be.equal(a_action);
      expect(barcodeInput).to.be.string(a_barcode);
      expect(name).to.be.string(a_name);
      expect(price).to.be.string(a_price);
      expect(quantity).to.be.string(a_quantity);
      expect(amountInput).to.be.string(a_amount);
      expect(totalPrice).to.be.string(a_totalPrice);
    };

    const deleteItemByIndex = async (itemIndex = 0) => {
      await refreshElementGetters();

      const itemActionButton = actionButtons[itemIndex];
      await itemActionButton.click();

      await refreshElementGetters();
    };

    describe("adding items", () => {
      describe("add item directly", () => {
        it("add item (directly correct)", async () => {
          // add one item
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add multiple items (directly correct)", async () => {
          // add 6 items, because AVAILABLE_ITEM has only 5 items, 1 of it must be duplicated
          await addDirectly("222");
          await addDirectly("221");
          await addDirectly("121");
          await addDirectly("222");
          await addDirectly("132");
          await addDirectly("231");

          // get totalAmount it that transaction
          let totalAmount = 0;
          for (const amount of amountInputs) {
            const amountValue = await amount.getValue();
            totalAmount += parseInt(amountValue);
          }

          // expect 6 + 1 of total amount, because 6 items added, and 1 is empty item (idle)
          expect(totalAmount).to.be.equal(6 + 1);
          expect(barcodeInputs.length).to.be.equal(6);

          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(2, [null, "121", "A", "200.000", "Kotak", "1", "200.000"]);
          await expectItemValues(3, [null, "132", "B", "10.000", "Box", "1", "10.000"]);
          await expectItemValues(4, [null, "231", "D", "10.500", "Pcs", "1", "10.500"]);
          await expectItemValues(5, ["true", "", "", "0", "", "1", "0"]);
        });
      });

      describe("add through search item", () => {
        it("add item", async () => {
          //   enter 22 to first barcode, the first item on searchItem index will be selected automatically, check addThroughSearchItem for details
          await addThroughSearchItem("22");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add different items", async () => {
          // add first item throught searchItem
          await addThroughSearchItem("22");

          expect(barcodeInputs.length).to.be.equal(2);
          expect(await actionButtons[0].getAttribute("disabled")).to.be.null;

          // add second item
          await addThroughSearchItem("22", 1);

          await refreshElementGetters();

          expect(barcodeInputs.length).to.be.equal(3);
          await expectItemValues(0, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(1, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(2, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add duplicated items", async () => {
          // add first item throught searchItem
          await addThroughSearchItem("22");

          await refreshElementGetters();
          expect(barcodeInputs.length).to.be.equal(2);
          expect(await actionButtons[0].getAttribute("disabled")).to.be.null;

          // add second item (the same item as above)
          await addThroughSearchItem("22");

          await refreshElementGetters();

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "221", "C", "2.000", "Sachet", "2", "4.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
        });
      });

      describe("hybridly add item (through searchitem and directly)", () => {
        it("add one item directly and one item through searchItem (different items)", async () => {
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22");

          expect(barcodeInputs.length).to.be.equal(3);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(2, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add one item directly and one item through search item (duplicate)", async () => {
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22", 1);

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add one item directly and one item through searchItem (different items) and add one item more from direct (diferent)", async () => {
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22");

          expect(barcodeInputs.length).to.be.equal(3);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(2, ["true", "", "", "0", "", "1", "0"]);

          await addDirectly("121");

          expect(barcodeInputs.length).to.be.equal(4);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(2, [null, "121", "A", "200.000", "Kotak", "1", "200.000"]);
          await expectItemValues(3, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add one item directly and one item through search item (duplicate) and add  one item more from direct (duplicate)", async () => {
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22", 1);

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "3", "63.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add one item directly and one item through searchItem (different items) and add one item more from searchItem (diferent)", async () => {
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22");

          expect(barcodeInputs.length).to.be.equal(3);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(2, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("12");

          expect(barcodeInputs.length).to.be.equal(4);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
          await expectItemValues(2, [null, "121", "A", "200.000", "Kotak", "1", "200.000"]);
          await expectItemValues(3, ["true", "", "", "0", "", "1", "0"]);
        });

        it("add one item directly and one item through search item (duplicate) and add  one item more from searchItem (duplicate)", async () => {
          await addDirectly("222");

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22", 1);

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);

          await addThroughSearchItem("22", 1);

          expect(barcodeInputs.length).to.be.equal(2);
          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "3", "63.000"]);
          await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
        });
      });
    });

    describe("deleting item", () => {
      it("deletes an item", async () => {
        await addDirectly("222");
        await addDirectly("221");

        // deletes first item
        await deleteItemByIndex();

        // checking
        expect(barcodeInputs.length).to.be.equal(2);
        await expectItemValues(0, [null, "221", "C", "2.000", "Sachet", "1", "2.000"]);
        await expectItemValues(1, ["true", "", "", "0", "", "1", "0"]);
      });

      it("deletes multiple item", async () => {
        await addDirectly("222");
        await addDirectly("221");

        await deleteItemByIndex(1);
        await deleteItemByIndex();

        expect(barcodeInputs.length).to.be.equal(1);
        await expectItemValues(0, ["true", "", "", "0", "", "1", "0"]);
      });
    });

    describe("modifying item", () => {
      describe("changing item amount", () => {
        it("should change amount by amount element", async () => {
          await addDirectly("222");

          const amountElement = amountInputs[0];
          await amountElement.click(); // focus to that element
          await amountElement.keys("\ue013"); // arrow up

          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);

          await amountElement.keys("\ue015"); // arrow down

          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "1", "21.000"]);
        });

        it("should change amount by arrow button in barcode input. before barcode input", async () => {
          await barcodeInputs[0].keys("\ue013"); // arrow up
          await expectItemValues(0, ["true", "", "", "0", "", "2", "0"]);

          await barcodeInputs[0].keys("\ue015"); // arrow down
          await expectItemValues(0, ["true", "", "", "0", "", "1", "0"]);

          await barcodeInputs[0].keys("\ue013"); // arrow up
          await addDirectly("222");

          await expectItemValues(0, [null, "222", "C", "21.000", "Bungkus", "2", "42.000"]);
        });
      });
    });
  });
}

module.exports = item;
