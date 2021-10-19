/**
 * @typedef {import ("../../submenuWrapper").SubmenuWrapper} SubmenuWrapper
 */

import { set_proper_price } from "../../../../../../etc/others.mjs";
import { Submenu } from "./SubmenuPrototype.js";

/**
 * @extends {Submenu}
 */
export class Payment extends Submenu {
  /**
   * contains total value must be paid by costumer
   * @type {Number}
   * @private
   */
  #total;

  /**
   * contains total elements
   * @type {HTMLElement}
   * @private
   */
  #totalElement;

  /**
   * contains customer's money
   * @type {Number}
   * @private
   */
  #customerMoney;

  /**
   * contains customer's money element
   * @type {HTMLElement}
   * @private
   */
  #customerMoneyElement;

  /**
   * contains customer's money autocomplete element(readonly)
   * @type {HTMLElement}
   * @private
   */
  #customerMoneyAutoElement;

  /**
   * contains state if autocomplete customer's money is available
   * @type {Boolean}
   * @private
   */
  #isAutoCompleteAvailable = false;

  /**
   * contains change value
   * @type {Number}
   * @private
   */
  #change;

  /**
   * contains change element
   * @type {HTMLElement}
   * @private
   */
  #changeElement;

  /**
   * contains proceed button element
   * @type {HTMLElement}
   * @private
   */
  #proceedButton;

  /**
   * contains cancel button element
   * @type {HTMLElement}
   * @private
   */
  #cancelButton;

  /**
   * contains logic is customer money sufficent or not
   * @type {Boolean}
   */
  #isSufficient;

  /**
   * creates payment submenu
   * @param {SubmenuWrapper} submenuWrapper
   * @param {Object} submenuProperties - options
   */

  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);

    // todo: persingkat pemanggilan properti dibawah ini
    this.#total =
      submenuWrapper.window.childs.transactionList.currentTransaction.transactionInfo.cashInfo.totalPrice;
    this.#customerMoney = this.#total;

    this._initializeSubmenu();

    // auto select to the customer money value
    this.#customerMoneyElement.select();
  }

  // protected methods
  /**@override */
  _setSubmenu() {
    this.#gatherElementInputs();
    this.#assignInitialValue();
  }

  /**@override */
  _setListener() {
    // refreshes customeer input money, and refreshes auto and change too
    const refreshCostumerInput = () => {
      const inputValue = this.#customerMoneyElement.value,
        inputNumber = Number(inputValue.replace(/\./g, ""));

      //   checks input is number
      if (isFinite(inputNumber)) {
        this.#customerMoney = inputNumber;
      }

      // resets customer money to proper string
      this.#customerMoneyElement.value = set_proper_price(this.#customerMoney);
      this.#refreshChange();
      this.#refreshAuto();
    };

    // listen to payment div
    this._submenuElement.addEventListener("keydown", ({ key }) => {
      if (key === "Enter") {
        // set costumer's money value to auto value if user presses enter if autocomplete is available
        if (this.#isAutoCompleteAvailable) {
          this.#customerMoneyElement.value = this.#customerMoneyAutoElement.value;
          this.#isAutoCompleteAvailable = false;

          refreshCostumerInput();
        } else {
          // on enter to proceed payment and end the payment
          // this only works if the #sufficient is true
          this.#proceedPayment();
        }
      } else if (key === "Tab") {
        // close submenu
        this.#cancelPayment();
      }
    });

    // listen to customer-content
    // every time it changed, change the change too
    this.#customerMoneyElement.addEventListener("input", () => {
      refreshCostumerInput();
    });

    // focus to customer input (not auto) when the auto is clicked
    this.#customerMoneyAutoElement.addEventListener("click", () => {
      this.#customerMoneyElement.focus();
    });

    // listen to both buttons
    this.#proceedButton.addEventListener("click", () => {
      this.#proceedPayment();
    });

    this.#cancelButton.addEventListener("click", () => {
      this.#cancelPayment();
    });
  }

  /**
   * gather all input elements
   * @private
   */
  #gatherElementInputs() {
    this.#customerMoneyElement = this._submenuElement.querySelector(".customer-content.input");
    this.#customerMoneyAutoElement = this._submenuElement.querySelector(".customer-content.auto");

    this.#totalElement = this._submenuElement.querySelector(".price-content");
    this.#changeElement = this._submenuElement.querySelector(".change-content");

    // button elements
    this.#proceedButton = this._submenuElement.querySelector("button.proceed");
    this.#cancelButton = this._submenuElement.querySelector("button.cancel");
  }

  /**
   * set elements value
   * @private
   */
  #assignInitialValue() {
    // initial value assignment
    this.#customerMoneyElement.value = set_proper_price(this.#customerMoney);
    this.#totalElement.value = set_proper_price(this.#total);
    this.#refreshChange();
  }

  /**
   * refreshes change element value
   * @private
   */
  #refreshChange() {
    // refresh the change value everytime the customer money changed
    this.#change = this.#customerMoney - this.#total;

    this.#isSufficient = this.#change >= 0;
    this.#refreshButton();

    // set negative or not
    const change = `${this.#isSufficient ? "" : "-"} ${set_proper_price(Math.abs(this.#change))}`;

    this.#changeElement.value = change;
  }

  /**
   * refreshes customer money auto element's autocomplete
   * @private
   */
  #refreshAuto() {
    // just for now, add sufficent zeros to autocomplete
    let autoValue = this.#customerMoney;
    let autoText = this.#customerMoneyElement.value;

    if (this.#customerMoney < this.#total) {
      if (autoValue === 0) {
        autoValue = 0;
      } else {
        while (autoValue < this.#total) {
          autoValue *= 10;
          autoText += "0";
        }
      }

      this.#customerMoneyAutoElement.value = autoText;
      this.#isAutoCompleteAvailable = true;
    } else {
      this.#customerMoneyAutoElement.value = "";
      this.#isAutoCompleteAvailable = false;
    }
  }

  /**
   * refreshes proceed button according to #isSufficent
   * @private
   */
  #refreshButton() {
    // set the proceed button disabled or not due to sufficient or not
    this.#proceedButton.disabled = !this.#isSufficient;
  }

  /**
   * proceeds payment after proceed button clicked
   * @private
   */
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

  /**
   * cancel payment and closes submenu if cancel button clicked
   * @private
   */
  #cancelPayment() {
    this._submenu.hideSubmenu();
  }
}
