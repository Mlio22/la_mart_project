import { ItemList } from "./transactions-helper/itemList.js";
import { TransactionLog } from "../../etc/Log.js";

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

  retrieveTransactionList(status = 2) {
    // Status list:
    // 1 : working
    // 2 : saved
    // 3 : completed
    // 4 : cancelled
    // 5 : cancelled after completed
    //* only used 2, 3

    return this.#transactionList.filter((transaction) => {
      const transactionStatus = transaction.status;

      return status === transactionStatus && this.#currentTransaction !== transaction;
    });
  }

  #resetPurchasesElement() {
    // refresh the purchases element HTML
    this.purchasesElement.innerHTML = EMPTY_TRANSACTION_HTML;
  }

  #searchTransaction(transactionId) {
    const transactionIndex = this.#transactionList.findIndex((transaction) => transaction.id === transactionId);

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
        status = transaction.status;
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

let idCounter = 1;

class Transaction {
  // transaction properties
  #transactionLog = [new TransactionLog(1)];

  #transactionInfo = {
    id: idCounter++, // create get id function
    status: 1,
    cashInfo: {
      customer: 0,
      totalPrice: 0,
    },
    itemList: null,
  };

  constructor(transactionList, starterItem) {
    this.transactionList = transactionList;

    this.#transactionInfo.itemList = new ItemList(this, starterItem);
  }

  #loadTransaction() {
    // restore items
    this.#transactionInfo.itemList.restoreItemList({ isTransactionCompleted: false });

    // add new empty element
    this.transactionInfo.itemList.createNewItem();

    // set transaction status  to 1 (working)
    this.#transactionInfo.status = 1;
  }

  #restoreTransaction() {
    // restore items
    this.#transactionInfo.itemList.restoreItemList({ isTransactionCompleted: true });

    // restore the totalPrice
    this.transactionInfo.itemList.refreshTotalPrice();

    // set transaction status  to 3 (completed)
    this.#transactionInfo.status = 3;
  }

  #addLog(code) {
    this.#transactionLog.push(new TransactionLog(code));
  }

  saveTransaction() {
    // remove last empty item
    this.transactionInfo.itemList.removeLastEmptyItem();

    // change current transaction's status to 2 (saved)
    this.#transactionInfo.status = 2;

    // add TransactionLog: saved (2)
    this.#addLog(2);
  }

  completeTransaction() {
    this.transactionInfo.itemList.removeLastEmptyItem();

    // set current item to completed
    this.itemList.setToTransactionCompletedState();

    // change current transaction's status to 3 (completed)
    this.#transactionInfo.status = 3;

    // add TransactionLog: completed (3)
    this.#addLog(3);
  }

  cancelTransaction() {
    const isTransactionCompleted = this.#transactionInfo.status === 3;

    // change status to 4 (cancelled) or 5 (cancelled after completed)
    this.#transactionInfo.status = isTransactionCompleted ? 4 : 5;

    // log with code 4 (cancelled) or 5 (cancelled after completed)
    this.#addLog(isTransactionCompleted ? 4 : 5);
  }

  reopenTransaction() {
    // load or restore the transaction
    if (this.saved) {
      this.#loadTransaction();
    } else if (this.completed) {
      this.#restoreTransaction();
    }

    // add TransactionLog : re-opened (6)
    this.#addLog(6);
  }

  get transactionInfo() {
    return { ...this.#transactionInfo };
  }

  get id() {
    return this.#transactionInfo.id;
  }

  get status() {
    return this.#transactionInfo.status;
  }

  get cashInfo() {
    return this.#transactionInfo.cashInfo;
  }

  get itemList() {
    /* warning: this can affect directly to the itemlist object. 
      use transactionInfo getter if you want to get only the value of itemList
      use this only if you need the reference and wanted to change it directly
    */
    return this.#transactionInfo.itemList;
  }

  get transactionLog() {
    return this.#transactionLog;
  }

  get saveable() {
    // return if a transaction can be saved
    const { itemList, status } = this.#transactionInfo;
    return itemList.items.length > 1 && status !== 3;
  }

  get working() {
    return this.#transactionInfo.status === 1;
  }

  get saved() {
    return this.#transactionInfo.status === 2;
  }

  get completed() {
    return this.#transactionInfo.status === 3;
  }

  get cancelled() {
    // return true if transaction is cancelled (either it's already completed or not)
    const status = this.#transactionInfo.status;
    return status === 4 || status === 5;
  }

  get restoring() {
    return this.#transactionInfo.status === 6;
  }

  set status(status) {
    this.#transactionInfo.status = status;
  }

  set cashInfo(cashInfo) {
    this.#transactionInfo.cashInfo = { ...this.#transactionInfo.cashInfo, ...cashInfo };
  }
}
