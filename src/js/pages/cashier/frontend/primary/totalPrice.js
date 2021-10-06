import { set_proper_price } from "../../../../etc/others.mjs";

/**
 * @typedef {import ('../main').CashierUI} CashierUI
 */

export class TotalPrice {
  /**
   * contains current total price
   * @private
   */
  #currentTotalPrice = 0;

  /**
   * contains total price element
   * @type {HTMLElement}
   * @private
   */
  #totalPriceContent = null;

  /**
   *
   * @param {CashierUI} cashier - referenced CashierUI
   */
  constructor(cashier) {
    this.cashier = cashier;
  }

  init() {
    this.#totalPriceContent = this.cashier.element.querySelector(
      ".total-price .total-price-content"
    );
    this.#setTotalPrice();
  }

  /**
   * sets local total price
   * @private
   */
  #setTotalPrice() {
    this.#totalPriceContent.innerText = `Rp. ${set_proper_price(this.#currentTotalPrice)}`;
  }

  /**
   * sets total price from other instances
   *@param {number} totalPrice
   */
  set totalPrice(totalPrice) {
    this.#currentTotalPrice = totalPrice;
    this.#setTotalPrice();
  }
}
