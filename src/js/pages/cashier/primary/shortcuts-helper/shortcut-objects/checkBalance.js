import { set_proper_price } from "../../../../etc/others.js";
import { Submenu } from "./SubmenuPrototype.js";

export class CheckBalance extends Submenu {
  #total;
  #cashierMoney;
  #cashierMoneyElement;
  #proceedButton;

  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);

    this.#total = submenuWrapper.cashier.childs.transactionList.currentTransaction.transactionInfo.cashInfo.totalPrice;
    this.#cashierMoney = this.#total;

    this._initializeSubmenu();
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
        // close submenu
        this._submenu.hideSubmenu();
      } else if (key === "Tab") {
        // close submenu
        this._submenu.hideSubmenu();
      }
    });

    // listen to both buttons
    this.#proceedButton.addEventListener("click", () => {
      this._submenu.hideSubmenu();
    });
  }

  // private methods
  #gatherElementInputs() {
    this.#cashierMoneyElement = this._submenuElement.querySelector(".balance-content");

    // button elements
    this.#proceedButton = this._submenuElement.querySelector("button.proceed");
  }

  #assignInitialValue() {
    // initial value assignment
    this.#cashierMoneyElement.value = set_proper_price(this.#cashierMoney);
  }
}