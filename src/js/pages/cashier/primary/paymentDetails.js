import { set_proper_price } from "../../etc/others.mjs";

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
    this.cashier = cashier;
    this.#paymentDetailsElement = cashier.element.querySelector(".right-bar .payment");

    this.#gatherElements();
  }

  #setDataFromCurrentTransaction() {
    const transactionInfo = this.cashier.childs.transactionList.currentTransaction.transactionInfo;
    const {
      id,
      cashInfo: { customer, totalPrice },
    } = transactionInfo;

    this.#transactionID = id;

    this.#customerMoney = customer;
    this.#totalPrice = totalPrice;
    this.#change = customer - totalPrice;
  }

  // setAndShow({ id, customer, totalPrice }) {
  showFromCurrentTransaction() {
    this.#setDataFromCurrentTransaction();

    this.#setElementText();
    this.#setElementVisibilty(true);
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
