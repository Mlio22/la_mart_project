const { expect } = require("chai");
const { sleep } = require("./helper");

function stock(app) {
  describe("#items", () => {
    let stockItemElements;

    const expectStockItemValues = async (index, a_values = ["true", "", "", "", "", "", "", "", ""]) => {
      stockItemElements = await app.client.$$(".stock .stock-items .stock-contents");

      const [a_able, a_barcode, a_name, a_quantity, a_buyPrice, a_sellPrice, a_firstStock, a_stockIn, a_stockOut] =
        a_values;

      const stockItem = stockItemElements[index];
      const getInput = async (classname) => await stockItem.$(`.${classname}.content input`);

      const action_button = await stockItem.$(".actions.content button"),
        barcode = await getInput("codes"),
        name = await getInput("names"),
        quantities = await getInput("quantities"),
        buyPrice = await getInput("buy-prices"),
        sellPrice = await getInput("sell-prices"),
        firstStock = await getInput("first-stock"),
        stockIn = await getInput("stock-in"),
        stockOut = await getInput("stock-out");

      const is_able = await action_button.getAttribute("disabled"),
        barcodeValue = await barcode.getValue(),
        nameValue = await name.getValue(),
        quantitiesValue = await quantities.getValue(),
        buyPriceValue = await buyPrice.getValue(),
        sellPriceValue = await sellPrice.getValue(),
        firstStockValue = await firstStock.getValue(),
        stockInValue = await stockIn.getValue(),
        stockOutValue = await stockOut.getValue();

      // expecting
      expect(is_able).to.be.equal(a_able);
      expect(barcodeValue).to.be.equal(a_barcode);
      expect(nameValue).to.be.equal(a_name);
      expect(quantitiesValue).to.be.equal(a_quantity);
      expect(buyPriceValue).to.be.equal(a_buyPrice);
      expect(sellPriceValue).to.be.equal(a_sellPrice);
      expect(firstStockValue).to.be.equal(a_firstStock);
      expect(stockInValue).to.be.equal(a_stockIn);
      expect(stockOutValue).to.be.equal(a_stockOut);
    };

    const addItem = async (barcode) => {
      const barcodeInputs = await app.client.$$(".stock .stock-items .stock-contents .codes.content input"),
        latestBarcodeInput = barcodeInputs[barcodeInputs.length - 1];

      await latestBarcodeInput.setValue(`${barcode}`);
      await latestBarcodeInput.keys("\uE007");
      await sleep(1000);

      stockItemElements = await app.client.$$(".stock .stock-items .stock-contents");
    };

    before("get item elements", async () => {
      stockItemElements = await app.client.$$(".stock .stock-items .stock-contents");
    });

    it("should one item with empty item exists", async () => {
      await expectStockItemValues(0);
    });

    describe("adding item", () => {
      it("should add 2 items", async () => {
        await addItem(222);
        await addItem(221);

        await expectStockItemValues(0, [null, "222", "Sambal DEF", "Sachet", "Rp. 2.000", "Rp. 2.100", "30", "", ""]);
        await expectStockItemValues(1, [null, "221", "sambal ABC", "Botol", "Rp. 20.000", "Rp. 21.500", "10", "", ""]);
        await expectStockItemValues(2);
      });

      it("add new item");

      describe("add duplicated item", () => {
        it("should add duplicated known item and focus to duplicated item", async () => {
          await addItem(222);
          await addItem(222);

          //
          let stockInInput = await stockItemElements[0].$$(".stock-in.content input"),
            firstStockInInput = stockInInput[0],
            isFocused = await firstStockInInput.isFocused();

          expect(isFocused).to.be.true;

          await addItem(221);
          await addItem(221);

          stockInInput = await stockItemElements[1].$$(".stock-in.content input");
          secondStockInInput = stockInInput[0];
          isFocused = await secondStockInInput.isFocused();

          expect(isFocused).to.be.true;

          await addItem(222);

          stockInInput = await stockItemElements[0].$$(".stock-in.content input");
          firstStockInInput = stockInInput[0];
          isFocused = await firstStockInInput.isFocused();

          expect(isFocused).to.be.true;
        });
      });
    });

    describe("deleting item(s)", () => {
      beforeEach("adding an item", async () => {
        await addItem(222);
      });
    });
  });
}

module.exports = stock;
