/**
 * @typedef {import ("../main").CashierUI} CashierUI
 */

import { set_proper_price } from "../../../../etc/others.mjs";

export class PaymentDetails {
  /**
   * contains is payment details element visible
   * @private
   * @type {Boolean}
   */
  #visible = false;

  /**
   * contains transaction's id
   * @private
   * @type {number}
   */
  #transactionID = null;

  /**
   * contains customer's money value
   * @private
   * @type {number}
   */
  #customerMoney = 0;

  /**
   * contains total price must be paid by costumner
   * @private
   * @type {number}
   */
  #totalPrice = 0;

  /**
   * contains money changes
   * @private
   * @type {number}
   */
  #change = 0;

  /**
   * contains payment details element
   * @private
   * @type {HTMLElement}
   */
  #paymentDetailsElement;

  /**
   * contains id span element
   * @private
   * @type {HTMLElement}
   */
  #idSpanElement;

  /**
   * contains costumer money text element
   * @private
   * @type {HTMLElement}
   */
  #customerMoneyContentElement;

  /**
   * contains total price text element
   * @private
   * @type {HTMLElement}
   */
  #totalPriceContentElement;

  /**
   * contains change money text element
   * @private
   * @type {HTMLElement}
   */
  #changeContentElement;

  /**
   * creates payment details section UI
   * @param {CashierUI} cashier - referenced CashierUi
   */
  constructor(cashier) {
    this.cashier = cashier;
  }

  init() {
    this.#paymentDetailsElement = this.cashier.element.querySelector(".right-bar .payment");
    this.#gatherElements();
  }

  /**
   * set payment details element from current transaction data
   * @private
   */
  #setDataFromCurrentTransaction() {
    const transactionInfo = this.cashier.childs.transactionList.currentTransaction.transactionInfo;
    const {
      DBId,
      cashInfo: { customer, totalPrice },
    } = transactionInfo;

    this.#transactionID = DBId;

    this.#customerMoney = customer;
    this.#totalPrice = totalPrice;
    this.#change = customer - totalPrice;
  }

  /**
   * sets data from transaction data and show
   */
  showFromCurrentTransaction() {
    this.#setDataFromCurrentTransaction();

    this.#setElementText();
    this.#setElementVisibilty(true);
  }

  /**
   * clears payment by un-visible it
   */
  clearPayment() {
    this.#setElementVisibilty(false);
  }

  /**
   * gather payment details elements
   * @private
   */
  #gatherElements() {
    this.#idSpanElement = this.#paymentDetailsElement.querySelector("span.id-content");

    this.#customerMoneyContentElement = this.#paymentDetailsElement.querySelector(
      ".customer-money-bar-content"
    );
    this.#totalPriceContentElement = this.#paymentDetailsElement.querySelector(
      ".price-money-bar-content"
    );
    this.#changeContentElement = this.#paymentDetailsElement.querySelector(
      ".change-money-bar-content"
    );
  }

  /**
   * sets all elements text
   * @private
   */
  #setElementText() {
    this.#idSpanElement.innerText = this.#transactionID;

    this.#customerMoneyContentElement.innerText = set_proper_price(this.#customerMoney);
    this.#totalPriceContentElement.innerText = set_proper_price(this.#totalPrice);
    this.#changeContentElement.innerText = set_proper_price(this.#change);
  }

  /**
   * set payment details visibilty
   * @param {Boolean} visiblilty
   * @private
   */
  #setElementVisibilty(visiblilty) {
    this.#visible = visiblilty;
    this.#paymentDetailsElement.className = `payment ${this.#visible ? "visible" : ""}`;
  }
}
