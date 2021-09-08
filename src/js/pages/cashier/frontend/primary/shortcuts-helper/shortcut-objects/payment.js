import { set_proper_price } from "../../../../../../etc/others.mjs";
import { Submenu } from "./SubmenuPrototype.js";

export class Payment extends Submenu {
  #total;
  #customerMoney;
  #customerMoneyElement;
  #proceedButton;
  #cancelButton;
  #totalElement;
  #changeElement;
  #change;
  #isSufficient;

  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);

    this.#total =
      submenuWrapper.window.childs.transactionList.currentTransaction.transactionInfo.cashInfo.totalPrice;
    this.#customerMoney = this.#total;

    this._initializeSubmenu();

    // auto select to the customer money value
    this.#customerMoneyElement.select();
  }

  // protected methods
  _setSubmenu() {
    this.#gatherElementInputs();
    this.#assignInitialValue();
  }

  _setListener() {
    // listen to payment div
    this._submenuElement.addEventListener("keydown", ({ key }) => {
      if (key === "Enter") {
        // on enter to proceed payment and end the payment
        // this only works if the #sufficient is true
        this.#proceedPayment();
      } else if (key === "Tab") {
        // close submenu
        this.#cancelPayment();
      }
    });

    // listen to customer-content
    // every time it changed, change the change too
    this.#customerMoneyElement.addEventListener("input", (e) => {
      const input = e.target.value,
        inputNumber = Number(input.replace(/\./g, ""));

      //   checks input is number
      if (isFinite(inputNumber)) {
        this.#customerMoney = inputNumber;
      }

      // resets customer money to proper string
      this.#customerMoneyElement.value = set_proper_price(this.#customerMoney);
      this.#refreshChange();
    });

    // listen to both buttons
    this.#proceedButton.addEventListener("click", () => {
      this.#proceedPayment();
    });

    this.#cancelButton.addEventListener("click", () => {
      this.#cancelPayment();
    });
  }

  // private methods
  #gatherElementInputs() {
    this.#customerMoneyElement = this._submenuElement.querySelector(".customer-content");
    this.#totalElement = this._submenuElement.querySelector(".price-content");
    this.#changeElement = this._submenuElement.querySelector(".change-content");

    // button elements
    this.#proceedButton = this._submenuElement.querySelector("button.proceed");
    this.#cancelButton = this._submenuElement.querySelector("button.cancel");
  }

  #assignInitialValue() {
    // initial value assignment
    this.#customerMoneyElement.value = set_proper_price(this.#customerMoney);
    this.#totalElement.value = set_proper_price(this.#total);
    this.#refreshChange();
  }

  #refreshChange() {
    // refresh the change value everytime the customer money changed
    this.#change = this.#customerMoney - this.#total;

    this.#isSufficient = this.#change >= 0;
    this.#refreshButton();

    // set negative or not
    const change = `${this.#isSufficient ? "" : "-"} ${set_proper_price(Math.abs(this.#change))}`;

    this.#changeElement.value = change;
  }

  #refreshButton() {
    // set the proceed button disabled or not due to sufficient or not
    this.#proceedButton.disabled = !this.#isSufficient;
  }

  #proceedPayment() {
    this._submenu.hideSubmenu();

    if (this.#isSufficient) {
      // set the current transaction cashInfo
      this._submenu.window.childs.transactionList.currentTransaction.cashInfo = {
        customer: this.#customerMoney,
        totalPrice: this.#total,
      };

      // complete the current transaction
      this._submenu.window.childs.transactionList.completeCurrentTransaction();
    }
  }

  #cancelPayment() {
    this._submenu.hideSubmenu();
    console.log("cancelled");
  }
}
