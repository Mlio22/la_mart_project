import { set_proper_price } from "./transactions/item.js";

export class TotalPrice {
  constructor(totalPriceElement) {
    this.__currentTotalPrice = 0;
    this.__totalPriceContent = totalPriceElement.querySelector(
      ".total-price-content"
    );

    this.__setTotalPrice();
  }

  __setTotalPrice() {
    this.__totalPriceContent.innerText = `Rp. ${set_proper_price(
      this.__currentTotalPrice
    )}`;
  }

  set totalPrice(totalPrice) {
    this.__currentTotalPrice = totalPrice;
    this.__setTotalPrice();
  }
}
