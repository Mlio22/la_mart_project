// objects
import { Payment } from "./shortcut-objects/payment.js";
import { Cancel } from "./shortcut-objects/cancel.js";
import { OpenTransaction } from "./shortcut-objects/openTransaction.js";
import { SearchItem } from "./shortcut-objects/searchItem.js";
import { CheckBalance } from "./shortcut-objects/checkBalance.js";

// functions
import { newTransaction } from "./shortcut-functions/newTransaction.js";
import { closeCashier } from "./shortcut-functions/closeCashier.js";
import { saveTransaction } from "./shortcut-functions/saveTransaction.js";

// element HTMLs
const cancelHTML = `<div class="header">Batalkan Transaksi?</div>
<div class="options">
    <div class="option-yes" tabindex="0">
        <i class="fas fa-check"></i>Ya
    </div>
    <div class="option-no" tabindex="0">
        <i class="fas fa-times"></i>Tidak
    </div>
</div>`;

const paymentHTML = `
<div class="payment-header">Pembayaran</div>
<div class="payment-content">
  <div class="customer">
    <div class="customer-header header">Uang:</div>
    Rp.<div class="customer-content-wrapper content-wrapper">
      <input class="customer-content input">
      <input class=" customer-content auto" readonly>
    </div>
  </div>
  <div class=" price">
    <div class="price-header header">Total Belanja:</div>
    Rp.<div class="price-content-wrapper content-wrapper">
      <input class="price-content" readonly>
    </div>
  </div>
  <div class="divider"></div>
  <div class="change">
    <div class="change-header header">Kembalian:</div>
    Rp.<div class="change-content-wrapper content-wrapper">
      <input class="change-content" readonly>
    </div>
  </div>
</div>
<div class="payment-actions">
  <button class="cancel">
    <i class="fas fa-times"></i>Batalkan
  </button>
  <button class="proceed">
    <i class="fas fa-check"></i>Selesai
  </button>
</div>`;

const openTransactionHTML = `
<div class="header">Daftar Transaksi</div>
<div class="type-slider">
    <div tabindex="0" class="type active">Tersimpan</div>
    <div tabindex="0" class="type">Selesai</div>
    <div class="slider">&nbsp;</div>
</div>
<div class="content">
    <div class="content-header">
        <div class="id">ID</div>
        <div class="item-bar">Jumlah Item</div>
        <div class="time">Waktu</div>
    </div>`;

const checkBalanceHTML = `
<div class="checkBalance-header">Saldo Kasir</div>
<div class="checkBalance-content">
    <div class="balance">
        <div class="balance-header">Jumlah Uang:</div>
        Rp.<input class="balance-content" readonly>
    </div>
</div>
<div class="checkBalance-actions">
    <button class="proceed">
        <i class="fas fa-check"></i>Selesai
    </button>
</div>`;

export const submenuButtons = {
  F1: {
    name: "help",
    initialAvailabiilty: true,
  },
  F2: {
    name: "search-item",
    object: SearchItem,
    initialAvailabiilty: true,
  },
  F4: {
    name: "payment",
    object: Payment,
    html: paymentHTML,
    initialAvailabiilty: false,
  },
  F5: {
    name: "print-bill",
    initialAvailabiilty: false,
  },
  F6: {
    name: "save-transaction",
    shortcutFunction: saveTransaction,
    initialAvailabiilty: false,
  },
  F7: {
    name: "open-transaction",
    object: OpenTransaction,
    html: openTransactionHTML,
    initialAvailabiilty: false,
  },
  F9: {
    name: "cancel-transaction",
    object: Cancel,
    html: cancelHTML,
    initialAvailabiilty: false,
  },
  F10: {
    name: "close-cashier",
    shortcutFunction: closeCashier,
    initialAvailabiilty: true,
  },
  F11: {
    name: "new-transaction",
    shortcutFunction: newTransaction,
    initialAvailabiilty: false,
  },
  F12: {
    name: "check-balance",
    object: CheckBalance,
    html: checkBalanceHTML,
    initialAvailabiilty: true,
  },
};
