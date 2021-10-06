/**
 * @typedef {import("../../submenuWrapper").SubmenuWrapper} SubmenuWrapper
 */

import { set_proper_price } from "../../../../../../etc/others.mjs";
import { Submenu } from "./SubmenuPrototype.js";

/**
 * @extends {Submenu}
 */
export class CheckBalance extends Submenu {
  #cashierMoney;
  #cashierMoneyElement;
  #proceedButton;

  /**
   * creates check balance submenu
   * @param {SubmenuWrapper} submenuWrapper - referenced SubmenuWrapper instance
   * @param {?Object} [submenuProperties={}] - options
   */

  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);

    this._initializeSubmenu();
  }

  // protected methods
  /**
   * @protected
   * @override
   */
  _setSubmenu() {
    this.#getCashierMoney();
    this.#gatherElementInputs();
    this.#assignInitialValue();
  }

  /**
   * obtain total price values from completed transactions datas
   * and set it to #cashierMoney
   * @private
   */
  #getCashierMoney() {
    const completedTransactions =
      submenuWrapper.window.childs.transactionList.retrieveTransactionList(3);

    const getBalance = (sum, transaction) => sum + transaction.transactionInfo.cashInfo.totalPrice;
    this.#cashierMoney = completedTransactions.reduce(getBalance, 0);
  }

  /**
   * @protected
   * @override
   */
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
  /**
   * gather elements
   * @private
   */
  #gatherElementInputs() {
    this.#cashierMoneyElement = this._submenuElement.querySelector(".balance-content");

    // button elements
    this.#proceedButton = this._submenuElement.querySelector("button.proceed");
  }

  /**
   * set #cashiermoney value to element's value
   */
  #assignInitialValue() {
    // initial value assignment
    this.#cashierMoneyElement.value = set_proper_price(this.#cashierMoney);
  }
}
