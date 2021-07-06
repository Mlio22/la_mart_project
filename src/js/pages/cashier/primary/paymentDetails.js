import { set_proper_price } from "../../etc/others.js";

export class PaymentDetails {
  // detail properties
  #visible = false;
  #transactionID = null;

  #customerMoney = 0;
  #totalPrice = 0;
  #change = 0;

  #paymentDetailsElement;
  #idSpan;

  #customerMoneyContent;
  #totalPriceContent;
  #changeContent;

  constructor(cashier) {
    this.#paymentDetailsElement = cashier.element.querySelector(".right-bar .payment");

    this.#gatherElements();
  }

  setAndShow({ id, customer, totalPrice }) {
    this.#transactionID = id;

    this.#customerMoney = customer;
    this.#totalPrice = totalPrice;
    this.#change = customer - totalPrice;

    this.#setElementVisibilty(true);
    this.#setElementText();
  }

  clearPayment() {
    this.#setElementVisibilty(false);
  }

  #gatherElements() {
    this.#idSpan = this.#paymentDetailsElement.querySelector("span.id-content");

    this.#customerMoneyContent = this.#paymentDetailsElement.querySelector(".customer-money-bar-content");
    this.#totalPriceContent = this.#paymentDetailsElement.querySelector(".price-money-bar-content");
    this.#changeContent = this.#paymentDetailsElement.querySelector(".change-money-bar-content");
  }

  #setElementText() {
    this.#idSpan.innerText = this.#transactionID;

    this.#customerMoneyContent.innerText = set_proper_price(this.#customerMoney);
    this.#totalPriceContent.innerText = set_proper_price(this.#totalPrice);
    this.#changeContent.innerText = set_proper_price(this.#change);
  }

  #setElementVisibilty(visiblilty) {
    this.#visible = visiblilty;
    this.#paymentDetailsElement.className = `payment ${this.#visible ? "visible" : ""}`;
  }
}
