import { set_proper_price } from "../../transactions/item.js";

const paymentHTML = `
<div class="payment-header">Pembayaran</div>
<div class="payment-content">
    <div class="customer">
        <div class="customer-header">Uang:</div>
        Rp.<input class="customer-content">
    </div>
    <div class="price">
        <div class="price-header">Total Belanja:</div>
        Rp.<input class="price-content" readonly>
    </div>
    <div class="divider"></div>
    <div class="change">
        <div class="change-header">Kembalian:</div>
        Rp.<input class="change-content" readonly>
    </div>
</div>
<div class="payment-actions">
    <button class="proceed">
        <i class="fas fa-check"></i>F3
    </button>
    <button class="cancel">
        <i class="fas fa-times"></i>F4
    </button>
</div>`;

export class Payment {
  constructor(submenu, parentElement) {
    this.__submenu = submenu;
    this.__parentElement = parentElement;

    this.__total = this.__submenu.getTotalPrice();

    this.__customerMoney = this.__total;

    this.__setSubmenu();
    this.__setListener();
  }

  __setSubmenu() {
    this.__paymentElement = document.createElement("div");
    this.__paymentElement.className = "payment";
    this.__paymentElement.innerHTML = paymentHTML;

    this.__parentElement.appendChild(this.__paymentElement);

    // price elements
    this.__customerMoneyElement = this.__paymentElement.querySelector(".customer-content");
    this.__totalElement = this.__paymentElement.querySelector(".price-content");
    this.__changeElement = this.__paymentElement.querySelector(".change-content");

    // button elements
    this.__proceedButton = this.__paymentElement.querySelector("button.proceed");
    this.__cancelButton = this.__paymentElement.querySelector("button.cancel");

    // initial value assignment
    this.__customerMoneyElement.value = set_proper_price(this.__customerMoney);
    this.__totalElement.value = set_proper_price(this.__total);
    this.__refreshChange();

    this.__submenu.showSubmenu();
    // auto select to the customer money value
    this.__customerMoneyElement.select();
  }

  __setListener() {
    // listen to payment div
    this.__paymentElement.addEventListener("keyup", ({ key }) => {
      console.log(key);
      if (key === "Enter" || key === "F3") {
        // on enter to proceed payment and end the payment
        // this only works if the __sufficient is true
        this.__proceedPayment();
      } else if (key === "F4" || key === "Escape") {
        // close submenu
        this.__cancelPayment();
      }
    });

    // listen to customer-content
    // every time it changed, change the change too
    this.__customerMoneyElement.addEventListener("input", (e) => {
      const input = e.target.value,
        inputNumber = Number(input.replace(/\./g, ""));

      //   checks input is number
      if (isFinite(inputNumber)) {
        this.__customerMoney = inputNumber;
      }

      // resets customer money to proper string
      this.__customerMoneyElement.value = set_proper_price(this.__customerMoney);
      this.__refreshChange();
    });

    // listen to both buttons
    this.__proceedButton.addEventListener("click", () => {
      this.__proceedPayment();
    });

    this.__cancelButton.addEventListener("click", () => {
      this.__cancelPayment();
    });
  }

  __refreshChange() {
    // refresh the change value everytime the customer money changed
    this.__change = this.__customerMoney - this.__total;

    this.__isSufficient = this.__change >= 0;
    this.__refreshButton();

    // set negative or not
    const change = `${this.__isSufficient ? "" : "-"} ${set_proper_price(Math.abs(this.__change))}`;

    this.__changeElement.value = change;
  }

  __refreshButton() {
    // set the proceed button disabled or not due to sufficient or not
    this.__proceedButton.disabled = !this.__isSufficient;
  }

  __proceedPayment() {
    if (this.__isSufficient) {
      console.log("payment success");
      //todo: access to API/DB and end payment
      this.__submenu.hideSubmenu();
    }
  }

  __cancelPayment() {
    console.log("payment cancelled");
    this.__submenu.hideSubmenu();
  }
}
