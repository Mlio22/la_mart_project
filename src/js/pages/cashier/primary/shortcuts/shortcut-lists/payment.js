import { set_proper_price } from "../../transactions/item.js";
import { Submenu } from "./Submenu.js";

export class Payment extends Submenu {
  constructor(submenu, submenuWrapper, submenuProperties) {
    super(submenu, submenuWrapper, submenuProperties);

    this.__total = submenu.getTotalPrice();
    this.__customerMoney = this.__total;

    this._initializeSubmenu();

    // auto select to the customer money value
    this.__customerMoneyElement.select();
  }

  // protected methods
  _setSubmenu() {
    this.__gatherElementInputs();
    this.__assignInitialValue();
  }

  _setListener() {
    // listen to payment div
    this._submenuElement.addEventListener("keydown", ({ key }) => {
      if (key === "Enter" || key === "F3") {
        // on enter to proceed payment and end the payment
        // this only works if the __sufficient is true
        this.__proceedPayment();
      } else if (key === "F4" || key === "Escape") {
        // close submenu
        this.__cancelPayment();
      }
    });

    // listen to customer-content
    // every time it changed, change the change too
    this.__customerMoneyElement.addEventListener("input", (e) => {
      const input = e.target.value,
        inputNumber = Number(input.replace(/\./g, ""));

      //   checks input is number
      if (isFinite(inputNumber)) {
        this.__customerMoney = inputNumber;
      }

      // resets customer money to proper string
      this.__customerMoneyElement.value = set_proper_price(this.__customerMoney);
      this.__refreshChange();
    });

    // listen to both buttons
    this.__proceedButton.addEventListener("click", () => {
      this.__proceedPayment();
    });

    this.__cancelButton.addEventListener("click", () => {
      this.__cancelPayment();
    });
  }

  // private methods
  __gatherElementInputs() {
    console.log(this._submenuElement);
    this.__customerMoneyElement = this._submenuElement.querySelector(".customer-content");
    this.__totalElement = this._submenuElement.querySelector(".price-content");
    this.__changeElement = this._submenuElement.querySelector(".change-content");

    // button elements
    this.__proceedButton = this._submenuElement.querySelector("button.proceed");
    this.__cancelButton = this._submenuElement.querySelector("button.cancel");
  }

  __assignInitialValue() {
    // initial value assignment
    this.__customerMoneyElement.value = set_proper_price(this.__customerMoney);
    this.__totalElement.value = set_proper_price(this.__total);
    this.__refreshChange();
  }

  __refreshChange() {
    // refresh the change value everytime the customer money changed
    this.__change = this.__customerMoney - this.__total;

    this.__isSufficient = this.__change >= 0;
    this.__refreshButton();

    // set negative or not
    const change = `${this.__isSufficient ? "" : "-"} ${set_proper_price(Math.abs(this.__change))}`;

    this.__changeElement.value = change;
  }

  __refreshButton() {
    // set the proceed button disabled or not due to sufficient or not
    this.__proceedButton.disabled = !this.__isSufficient;
  }

  __proceedPayment() {
    if (this.__isSufficient) {
      this._submenu.completeCurrentTransaction();
      //todo: access to API/DB and end payment
      this._submenu.hideSubmenu();
    }
  }

  __cancelPayment() {
    this._submenu.hideSubmenu();
  }
}
