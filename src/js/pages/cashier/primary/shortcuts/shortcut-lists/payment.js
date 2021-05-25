const paymentHTML = `
<div class="payment-header">Pembayaran</div>
<div class="payment-content">
    <div class="payment-content__customer">
        <div class="payment-content__customer__header">Uang:</div>
        Rp.<input class="payment-content__customer__content">
    </div>
    <div class="payment-content__price">
        <div class="payment-content__price__header">Total Belanja:</div>
        Rp.<input class="payment-content__price__content" readonly>
    </div>
    <div class="payment-content__divider"></div>
    <div class="payment-content__change">
        <div class="payment-content__change__header">Kembalian:</div>
        Rp.<input class="payment-content__change__content" readonly>
    </div>
</div>
<div class="payment-actions">
    <div class="payment-actions__proceed">
        <i class="fas fa-check"></i>F4
    </div>
    <div class="payment-actions__cancel">
        <i class="fas fa-times"></i>F3
    </div>
</div>`;

export class Payment {
    constructor(parentElement, { total }) {

        this.__parentElement = parentElement;
        this.__parentElement.innerHTML = ``;

        this.__paymentElement = null;

        this.__customerMoney = 0;
        this.__total = total;
        this.__change = 0 - total;

        this.__setSubmenu()
    }

    __setListener() {

    }

    __setSubmenu() {

        this.__paymentElement = document.createElement('div');
        this.__paymentElement.className = 'payment';
        this.__paymentElement.innerHTML = paymentHTML;

        this.__parentElement.appendChild(this.__paymentElement);

        // elements
        this.__customerMoneyElement = document.querySelector('.payment-content__customer__content');
        this.__totalElement = document.querySelector('.payment-content__price__content');
        this.__changeElement = document.querySelector('.payment-content__change__content');

        this.__totalElement.value = this.__total;
        this.__changeElement.value = this.__change;
    }
}