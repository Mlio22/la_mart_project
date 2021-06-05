import { Payment } from "./shortcut-lists/payment.js";
import { Cancel } from "./shortcut-lists/cancel.js";
import { OpenTransaction } from "./shortcut-lists/openTransaction.js";
import { SearchItem } from "./shortcut-lists/searchItem.js";

// element HTMLs

const cancelHTML = `<div class="header">Batalkan Transaksi?</div>
<div class="options">
    <div class="option-yes">
        <i class="fas fa-check"></i>Ya
    </div>
    <div class="option-no">
        <i class="fas fa-times"></i>Tidak
    </div>
</div>`;

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

export const submenuButtons = {
  F2: {
    name: "search-item",
    object: SearchItem,
  },
  F4: {
    name: "payment",
    object: Payment,
    html: paymentHTML,
  },
  F5: {
    name: "print-bill",
  },
  F6: {
    name: "save-transaction",
  },
  F7: {
    name: "open-transaction",
    object: OpenTransaction,
  },
  F9: {
    name: "cancel-transaction",
    object: Cancel,
    html: cancelHTML,
  },
  F10: {
    name: "close-cashier",
  },
  F11: {
    name: "new-page",
  },
  F12: {
    name: "check-balance",
  },
};
