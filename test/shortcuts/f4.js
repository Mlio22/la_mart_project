const { refreshShortcutButtonGetter, addItemDirectly, checkShortcutAvailability } = require("../helper.js");
const expect = require("chai").expect;

function payment(app) {
  describe("#F4", () => {
    let shortcutButtons, cancelButton, proceedButton;

    beforeEach("add an item directly and open the payment shortcut", async () => {
      shortcutButtons = await refreshShortcutButtonGetter(app);

      await addItemDirectly(app, "121");

      // check the payment availabilty
      await checkShortcutAvailability(app, { mustAvailable: [3] });

      await shortcutButtons[3].click();

      cancelButton = await app.client.$(".submenu .payment-actions button.cancel");
      proceedButton = await app.client.$(".submenu .payment-actions button.proceed");
    });

    it("payment element should be available", async () => {
      const submenu = await app.client.$(".cashier .submenu .payment"),
        isSubmenuExisting = await submenu.isExisting();

      expect(isSubmenuExisting).to.be.true;
    });

    it("proceed payment button must be available when payment submenu clicked", async () => {
      const isProceedButtonDisabled = await proceedButton.getAttribute("disabled");
      expect(isProceedButtonDisabled).to.be.null;
    });

    describe("several tests for F4", () => {
      let moneyInput;

      const setMoneyInput = async (value) => {
        moneyInput = await app.client.$(".submenu .payment-content .customer-content");
        await moneyInput.setValue(value);

        // refreshes the button state
        cancelButton = await app.client.$(".submenu .payment-actions button.cancel");
        proceedButton = await app.client.$(".submenu .payment-actions button.proceed");
      };

      beforeEach(async () => {
        moneyInput = await app.client.$(".submenu .payment-content .customer-content");
      });

      describe("#money input", () => {
        it("proceed button should available if the value is sufficient ", async () => {
          await setMoneyInput("1");
          let isProceedButtonDisabled = await proceedButton.getAttribute("disabled");
          expect(isProceedButtonDisabled).to.be.equal("true");

          await setMoneyInput("200000");
          isProceedButtonDisabled = await proceedButton.getAttribute("disabled");
          expect(isProceedButtonDisabled).to.be.null;
        });
      });

      describe("#proceed/cancel", () => {
        it("should closes the submenu if cancel button is clicked", async () => {
          await cancelButton.click();
        });

        it("should closes the submenu if enter key is clicked and the value is unchanged", async () => {
          const paymentElement = await app.client.$(".cashier .submenu .payment");
          await paymentElement.keys("\ue007"); // enter
        });

        it("should closes the submenu if proceed button is clicked and the value is unchanged", async () => {
          await proceedButton.click();
        });

        it("should closes the submenu if proceed button is clicked and the value is sufficient", async () => {
          await setMoneyInput("200000");
          await proceedButton.click();
        });

        afterEach("in this test submenu must be closed at the end", async () => {
          const submenuCover = await app.client.$(".cashier .submenuCover"),
            submenuCoverClass = await submenuCover.getAttribute("class");

          expect(submenuCoverClass).to.be.equal("submenuCover hidden");
        });
      });
    });
  });
}

module.exports = payment;
