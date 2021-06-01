import { Payment } from "./shortcut-lists/payment.js";
import { Cancel } from "./shortcut-lists/cancel.js";
import { OpenTransaction } from "./shortcut-lists/openTransaction.js";
import { SearchItem } from "./shortcut-lists/searchItem.js";

export const submenuButtons = {
  "search-item": {
    element: ".shortcut.search-item",
    object: SearchItem,
  },
  payment: {
    element: ".shortcut.open-payment",
    object: Payment,
  },
  "print-bill": {
    element: ".shortcut.print-bill",
  },
  "save-transaction": {
    element: ".shortcut.save-transaction",
  },
  "open-transaction": {
    element: ".shortcut.open-transaction",
    object: OpenTransaction,
  },
  "cancel-transaction": {
    element: ".shortcut.cancel-transaction",
    object: Cancel,
  },
  "close-cashier": {
    element: ".shortcut.close-cashier",
  },
  "new-page": {
    element: ".shortcut.new-page",
  },
  "check-balance": {
    element: ".shortcut.check-balance",
  },
};
