import { set_proper_price } from "../../../../../../etc/others.mjs";
import { Submenu } from "./SubmenuPrototype.js";

export class CheckBalance extends Submenu {
  #completedTransactions;
  #cashierMoney;
  #cashierMoneyElement;
  #proceedButton;

  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);

    this.#completedTransactions =
      submenuWrapper.window.childs.transactionList.retrieveTransactionList(3);

    const getBalance = (sum, transaction) => sum + transaction.transactionInfo.cashInfo.totalPrice;
    this.#cashierMoney = this.#completedTransactions.reduce(getBalance, 0);

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