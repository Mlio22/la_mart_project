import { Transaction } from "./transactions-helper/transaction.js";

const EMPTY_TRANSACTION_HTML = `
    <tr class="purchases-headers">
      <th class="purchases-header action-header">&nbsp;</th>
      <th class="purchases-header barcode-header">Barcode</th>
      <th class="purchases-header name-header">Nama Barang</th>
      <th class="purchases-header type-header">Satuan</th>
      <th class="purchases-header price-header">Harga</th>
      <th class="purchases-header amount-header">Jumlah</th>
      <th class="purchases-header total-price-header">Harga Total</th>
    </tr>`;

export class TransactionList {
  #transactionList = [];

  #currentTransaction = null;

  constructor(cashier) {
    this.cashier = cashier;
    this.purchasesElement = cashier.element.querySelector(".purchases");

    // initial transaction
    this.createTransaction();
  }

  createTransaction(starterItem) {
    // reset purchases element
    this.#resetPurchasesElement();

    // hide the previous paymentDetails if available
    this.cashier.childs.paymentDetails.clearPayment();

    // create new transaction
    this.#currentTransaction = new Transaction(this, starterItem);
    this.#transactionList.push(this.#currentTransaction);

    // check transactionList
    this.#checkTransactionsList();

    // set the available shortcuts
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F2: true,
      F11: false,
    });
  }

  loadTransaction(transactionId) {
    if (this.#currentTransaction.saveable) {
      // save current transaction before loading other transaction
      // unless it's already completed
      this.saveCurrentTransaction({ createNewTransaction: false });
    }

    // clear the purchases element and reopen the transaction
    this.#resetPurchasesElement();

    // search, get and set the currentTransaction
    this.#currentTransaction = this.#searchTransaction(transactionId);

    if (this.#currentTransaction.completed) {
      this.cashier.childs.paymentDetails.showFromCurrentTransaction();

      // change other shortcut availability status
      this.cashier.childs.shortcuts.setShortcutAvailability({
        F2: false,
        F5: true,
        F11: true,
      });
    }

    this.#currentTransaction.reopenTransaction();

    // check transactionList
    this.#checkTransactionsList();

    // able to delete transaction (both completed or incompleted transactions)
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F9: true,
    });
  }

  saveCurrentTransaction({ createNewTransaction = true }) {
    // save transaction
    this.#currentTransaction.saveTransaction();

    if (createNewTransaction) {
      // create new transaction
      this.createTransaction();

      // check transactionList
      this.#checkTransactionsList();
    }
  }

  completeCurrentTransaction() {
    // complete current transaction
    this.#currentTransaction.completeTransaction();

    // show the payment details
    this.cashier.childs.paymentDetails.showFromCurrentTransaction();

    // set shortcut availability
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F4: false,
      F5: true,
      F6: false,
      F10: true,
      F11: true,
    });

    // check transaction list
    this.#checkTransactionsList();

    // focus to cashier, especially when transaction completed
    this.cashier.focus();
  }

  cancelCurrentTransaction() {
    this.#currentTransaction.cancelTransaction();

    // check transactionList
    this.#checkTransactionsList();

    this.createTransaction();
  }

  retrieveTransactionList(status = 2, excludeCurrentTransaction = false) {
    // Status list:
    // 1 : working
    // 2 : saved
    // 3 : completed
    // 4 : cancelled
    // 5 : cancelled after completed
    //* only used 2, 3

    return this.#transactionList.filter((transaction) => {
      const transactionStatus = transaction.statusCode;

      const result = status === transactionStatus;

      if (excludeCurrentTransaction) {
        result = result && this.#currentTransaction !== transaction;
      }

      return result;
    });
  }

  #resetPurchasesElement() {
    // refresh the purchases element HTML
    this.purchasesElement.innerHTML = EMPTY_TRANSACTION_HTML;
  }

  #searchTransaction(transactionId) {
    const transactionIndex = this.#transactionList.findIndex(
      (transaction) => transaction.id === transactionId
    );

    if (transactionIndex !== -1) {
      return this.#transactionList[transactionIndex];
    }

    return console.error("transaction not found");
  }

  #checkTransactionsList() {
    // this method sets openTransaction shortcut Availability
    // based on is there saved/completed transaction or not

    const savedOrCompletedTransactionIndex = this.#transactionList.findIndex((transaction) => {
      const notThisTransaction = transaction !== this.#currentTransaction,
        status = transaction.statusCode;
      return notThisTransaction && (status === 2 || status === 3);
    });

    // set openTransaction shortcut availability based by any saved or completed transaction available
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F7: savedOrCompletedTransactionIndex >= 0 ? true : false,
    });
  }

  get currentTransaction() {
    return this.#currentTransaction;
  }

  inputFromCashier() {
    // having cashier input when the cashier is focused

    // if a transaction is completed, start a new one
    if (this.#currentTransaction.completed) {
      this.createTransaction();
    }

    // focus to latest barcode
    this.#currentTransaction.itemList.focusToLatestBarcode();
  }
}
