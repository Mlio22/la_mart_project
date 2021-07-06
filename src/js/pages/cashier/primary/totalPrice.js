import { set_proper_price } from "./transactions/item.js";

export class TotalPrice {
  #currentTotalPrice = 0;
  #totalPriceContent = null;

  constructor(cashier) {
    this.#totalPriceContent = cashier.element.querySelector(".total-price .total-price-content");

    this.#setTotalPrice();
  }

  #setTotalPrice() {
    this.#totalPriceContent.innerText = `Rp. ${set_proper_price(this.#currentTotalPrice)}`;
  }

  set totalPrice(totalPrice) {
    this.#currentTotalPrice = totalPrice;
    this.#setTotalPrice();
  }
}
