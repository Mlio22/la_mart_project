const { refreshShortcutButtonGetter } = require("../helper.js");
const expect = require("chai").expect;

function searchItem(app) {
  describe("#F2", () => {
    let shortcutButton;

    beforeEach("opening search item shortcut", async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);
      // click the searchItem shortcut
      await shortcutButtons[1].click();
    });

    it("searchItem element should available at first start", async () => {
      // searchItem should show
      const submenu = await app.client.$(".cashier .submenu .search-item"),
        isSubmenuExisting = await submenu.isExisting();

      expect(isSubmenuExisting).to.be.true;
    });

    describe("several test in F2", () => {
      describe("#input test", () => {
        let searchItemInput;
        beforeEach("refreshing search item input getter", async () => {
          searchItemInput = await app.client.$(".search-item .search-item-header input");
        });

        const expectResults = async (result_count) => {
          // expect the resulted item
          const searchItemResultBarcodes = await app.client.$$(
            ".search-item .search-item-results .search-item-result-content .item-barcode"
          );

          expect(searchItemResultBarcodes.length).to.be.equal(result_count);
        };

        it("should show zero result if input is '' ", async () => {
          await expectResults(0);
        });

        it("should show match results if input is added", async () => {
          await searchItemInput.setValue("1"); // add 1 in searchitem input
          await expectResults(4);

          await searchItemInput.setValue("12");
          await expectResults(1);
        });

        it("should show zero result again if input is set to '' ", async () => {
          await searchItemInput.setValue("1"); // add 1 in searchitem input
          await expectResults(4);

          await searchItemInput.keys("\ue003"); // backspace again for clearing input
          await expectResults(0);
        });
      });

      describe("#arrow input test", () => {
        let searchItemDiv;

        beforeEach("refreshing search item div getter", async () => {
          searchItemDiv = await app.client.$(".cashier .submenu .search-item");
        });

        const expectFocusedResult = async (a_focus_idx) => {
          // check the selected index of result is focused
          const resultItems = await app.client.$$(".search-item .search-item-results .search-item-result-content"),
            isResultFocused = await resultItems[a_focus_idx].isFocused();

          expect(isResultFocused).to.be.true;
        };

        it("should focus to item using arrow button", async () => {
          // add 1 in input to make results visible
          const searchItemInput = await app.client.$(".search-item .search-item-header input");

          await searchItemInput.setValue("1");

          // arrow down once (desired index: 1)
          await searchItemDiv.keys("\ue015"); // arrow down
          await expectFocusedResult(1);

          // arrow up once (desired index: 0)
          await searchItemDiv.keys("\ue013"); // arrow up
          await expectFocusedResult(0);

          // arrow up once (desired index: 0)
          await searchItemDiv.keys("\ue013"); // arrow up
          await expectFocusedResult(0);

          // arrow down to beyond end the result (desired index: 3)
          await searchItemDiv.keys("\ue015"); // arrow down
          await searchItemDiv.keys("\ue015"); // arrow down
          await searchItemDiv.keys("\ue015"); // arrow down
          await searchItemDiv.keys("\ue015"); // arrow down

          await expectFocusedResult(3);
        });
      });

      describe("#enter/click", () => {
        let focusedResultElement;
        beforeEach('added "1" to the input', async () => {
          const searchItemInput = await app.client.$(".search-item .search-item-header input");

          await searchItemInput.setValue("1");

          const resultItems = await app.client.$$(".search-item .search-item-results .search-item-result-content");
          focusedResultElement = resultItems[0];
        });

        it("should close the searchItem if a result item is entered", async () => {
          await focusedResultElement.keys("\ue007"); //enter
        });

        it("should close the searchItem if a result item is clicked", async () => {
          await focusedResultElement.click();
        });

        afterEach("checking submenuCover class", async () => {
          const submenuCover = await app.client.$(".cashier .submenuCover"),
            submenuCoverClass = await submenuCover.getAttribute("class");

          expect(submenuCoverClass).to.be.equal("submenuCover hidden");
        });
      });
    });
  });
}

module.exports = searchItem;
