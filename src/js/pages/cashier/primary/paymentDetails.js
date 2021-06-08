import { set_proper_price } from "../primary/transactions/item.js";

export class PaymentDetails {
  constructor(paymentDetailsElement) {
    this.__paymentDetailsElement = paymentDetailsElement;

    // detail properties
    this.__visible = false;
    this.__transactionID = null;

    this.__customerMoney = 0;
    this.__totalPrice = 0;
    this.__change = 0;

    this.__gatherElements();
  }

  __gatherElements() {
    this.__idSpan = this.__paymentDetailsElement.querySelector("span.id-content");

    this.__customerMoneyContent = this.__paymentDetailsElement.querySelector(".customer-money-bar-content");
    this.__totalPriceContent = this.__paymentDetailsElement.querySelector(".price-money-bar-content");
    this.__changeContent = this.__paymentDetailsElement.querySelector(".change-money-bar-content");
  }

  __setElementText() {
    this.__idSpan.innerText = this.__transactionID;

    this.__customerMoneyContent.innerText = set_proper_price(this.__customerMoney);
    this.__totalPriceContent.innerText = set_proper_price(this.__totalPrice);
    this.__changeContent.innerText = set_proper_price(this.__change);
  }

  __setElementVisibilty(visiblilty) {
    this.__visible = visiblilty;
    this.__paymentDetailsElement.className = `payment ${this.__visible ? "visible" : ""}`;
  }

  setAndShow({ id, customer, totalPrice }) {
    this.__transactionID = id;

    this.__customerMoney = customer;
    this.__totalPrice = totalPrice;
    this.__change = customer - totalPrice;

    this.__setElementVisibilty(true);
    this.__setElementText();
  }

  clearPayment() {
    this.__setElementVisibilty(false);
  }
}
