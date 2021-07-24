const { sleep } = require("./helper");
const expect = require("chai").expect;

const AVAILABLE_ITEMS = [
  {
    barcode: "121",
    name: "A",
    quantity: "Kotak",
    price: 200000,
  },
  {
    barcode: "132",
    name: "B",
    quantity: "Box",
    price: 10000,
  },
  {
    barcode: "221",
    name: "C",
    quantity: "Sachet",
    price: 2000,
  },
  {
    barcode: "222",
    name: "C",
    quantity: "Bungkus",
    price: 21000,
  },
  {
    barcode: "231",
    name: "D",
    quantity: "Pcs",
    price: 10500,
  },
];

async function item(app) {
  describe("#items", () => {
    let barcodeInputs,
      actionButtons,
      amountInputs,
      itemList = {};

    async function refreshInputGetters() {
      barcodeInputs = await app.client.$$(".cashier .barcode-content input");
      actionButtons = await app.client.$$(".cashier .action-content button");
      amountInputs = await app.client.$$(".cashier .amount-content input");
    }

    async function addRandomItem(times) {
      for (let index = 0; index < times; index++) {
        await refreshInputGetters();
        const itemIndex = Math.floor(Math.random() * AVAILABLE_ITEMS.length),
          item = AVAILABLE_ITEMS[itemIndex],
          latestBarcodeInput = barcodeInputs[barcodeInputs.length - 1],
          itemAmountInList = itemList[item.barcode] ?? 0;

        // add item with precise barcode
        await latestBarcodeInput.setValue(item.barcode);
        // enter
        await latestBarcodeInput.keys("\uE007");
        await sleep(200);

        itemList[itemIndex] = itemAmountInList + 1;
      }
    }

    beforeEach("refreshing", async () => {
      app.client.refresh();
      await refreshInputGetters();
      itemList = {};
    });

    describe("add item directly", () => {
      it("add items (directly correct)", async () => {
        // check first item content status
        expect(barcodeInputs.length).to.be.equal(1);
        expect(await actionButtons[0].getAttribute("disabled")).to.be.string("true");

        await addRandomItem(1);

        await refreshInputGetters();
        expect(barcodeInputs.length).to.be.equal(2);
        expect(await amountInputs[0].getValue()).to.be.string("1");
        expect(await actionButtons[0].getAttribute("disabled")).to.be.null;
      });

      it("add multiple items (directly correct)", async () => {
        // add 6 items, because AVAILABLE_ITEM has only 5 items, 1 of it must be duplicated
        await addRandomItem(6);

        await refreshInputGetters();

        let totalAmount = 0;
        for (const amount of amountInputs) {
          const amountValue = await amount.getValue();
          totalAmount += parseInt(amountValue);
        }

        expect(totalAmount).to.be.equal(6 + 1);
        expect(await barcodeInputs.length).to.be.equal(Object.keys(itemList).length + 1);
      });
    });

    describe("add through search item", () => {
      it("add item", async () => {
        //   enter 22 to first barcode, and searchitem will appear
        await barcodeInputs[0].setValue("22");
        await barcodeInputs[0].keys("\uE007");
        await sleep(75);

        const searchItemElement = await app.client.$(".cashier .submenu .search-item");

        expect(await searchItemElement.isDisplayed()).to.be.true;
        // enter
        await searchItemElement.keys("\uE007");

        await refreshInputGetters();
        expect(barcodeInputs.length).to.be.equal(2);
        expect(await actionButtons[0].getAttribute("disabled")).to.be.null;
      });

      it("add different items", async () => {
        // add first item
        await barcodeInputs[0].setValue("22");
        await barcodeInputs[0].keys("\uE007");
        await sleep(75);

        let searchItemElement = await app.client.$(".cashier .submenu .search-item");

        expect(await searchItemElement.isDisplayed()).to.be.true;
        await searchItemElement.keys("\uE007");

        await refreshInputGetters();
        expect(barcodeInputs.length).to.be.equal(2);
        expect(await actionButtons[0].getAttribute("disabled")).to.be.null;

        // add second item
        await barcodeInputs[1].setValue("22");
        await barcodeInputs[1].keys("\uE007");
        await sleep(75);

        searchItemElement = await app.client.$(".cashier .submenu .search-item");

        expect(await searchItemElement.isDisplayed()).to.be.true;

        await searchItemElement.keys("\ue015"); // down arrow
        await searchItemElement.keys("\ue007"); // enter

        await refreshInputGetters();
        expect(barcodeInputs.length).to.be.equal(3);
        expect(await actionButtons[1].getAttribute("disabled")).to.be.null;
      });

      it("add duplicated items", async () => {
        await barcodeInputs[0].setValue("22");
        await barcodeInputs[0].keys("\uE007");
        await sleep(75);

        let searchItemElement = await app.client.$(".cashier .submenu .search-item");

        expect(await searchItemElement.isDisplayed()).to.be.true;
        await searchItemElement.keys("\uE007");

        await refreshInputGetters();
        expect(barcodeInputs.length).to.be.equal(2);
        expect(await actionButtons[0].getAttribute("disabled")).to.be.null;

        // add second item (the same item as above)
        await barcodeInputs[1].setValue("22");
        await barcodeInputs[1].keys("\uE007");
        await sleep(75);

        searchItemElement = await app.client.$(".cashier .submenu .search-item");

        expect(await searchItemElement.isDisplayed()).to.be.true;

        await searchItemElement.keys("\ue007"); // enter

        await refreshInputGetters();
        expect(barcodeInputs.length).to.be.equal(2);
        expect(await amountInputs[0].getValue()).to.be.string("2");
      });
    });
  });
}

module.exports = item;
