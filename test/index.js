const Application = require("spectron").Application;
const electronPath = require("electron");
const path = require("path");
const expect = require("chai").expect;
const itemSuite = require("./item");
const shortcutSuite = require("./shortcut");
const StockSuite = require("./stock");
const { sleep } = require("./helper");

// example for loading mjs file (non type: module)
// const { set_proper_price } = await import("../src/js/pages/etc/others.mjs");

describe("Application launch", function () {
  // test timeout
  this.timeout(100000);

  const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, "..")],
  });

  // start-up
  before("starting app", () => app.start());

  // stop app at the end
  after("stopping app", () => app.stop());

  it("opens home page", async () => {});

  // describe("#cashier", () => {
  //   before("opens cashier", async () => {
  //     const cashierButton = await app.client.$(".menusWrapper__menu.open-cashier");
  //     await cashierButton.click();

  //     // focus to second window (cashier)
  //     await app.client.windowByIndex(1);
  //   });

  // beforeEach("refreshing", async () => {
  //   app.client.refresh();
  // });

  //   it("the total windows should be 2", async () => {
  //     const totalWindow = await app.client.getWindowCount();
  //     expect(totalWindow).to.be.equal(2);
  //   });

  //   after("closes cashier page", async () => {
  //     // closes cashier via shortcut
  //     const shortcuts = await app.client.$$(".cashier .shortcuts .shortcut");
  //     await shortcuts[9].click();

  //     await app.client.windowByIndex(0);
  //   });

  //   // itemSuite(app);
  //   // shortcutSuite(app);
  // });

  describe("#stock", () => {
    before("opens stock page", async () => {
      const stockButton = await app.client.$(".menusWrapper__menu.open-stock");
      await stockButton.click();

      // focus to second window (cashier)
      await app.client.windowByIndex(1);
    });

    beforeEach("refreshing", async () => {
      app.client.refresh();
    });

    StockSuite(app);

    after("closes cashier page", async () => {
      // closes cashier via shortcut
      await app.client.closeWindow();
      await app.client.windowByIndex(0);
    });
  });
});
