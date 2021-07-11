import { ItemList } from "./transactions-helper/itemList.js";
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
  #currentTransactionId = null;

  constructor(cashier) {
    this.cashier = cashier;
    this.purchasesElement = cashier.element.querySelector(".purchases");

    // initial transaction
    this.createTransaction();
  }

  retrieveTransactionList(status = 2) {
    // Status list:
    // 1 : working
    // 2 : saved
    // 3 : completed
    // 4 : cancelled
    //* only used 2, 3

    return this.#transactionList.filter((transaction) => {
      const transactionStatus = transaction.transactionInfo.status;

      return status === transactionStatus;
    });
  }

  loadTransaction(transactionId) {
    // save current transaction before loading other transaction
    if (this.#currentTransaction.itemList.items.length > 1) {
      this.saveCurrentTransaction();
    }

    this.#currentTransaction = this.#searchTransaction(transactionId);

    // change current transaction's status to 1 (working)
    this.#currentTransaction.status = 1;

    // clear the purchases element and restore the items
    this.#resetPurchasesElement();
    this.#currentTransaction.itemList.restoreItemList();

    // add new empty element
    this.#currentTransaction.itemList.createNewItem();
  }

  saveCurrentTransaction() {
    // change current transaction's status to 2 (saved)
    this.#currentTransaction.status = 2;

    // remove last empty item
    this.#currentTransaction.transactionInfo.itemList.removeLastEmptyItem();

    // create new transaction
    this.createTransaction();
  }

  completeCurrentTransaction(paymentNominals) {
    this.#currentTransaction.transactionInfo.itemList.removeLastEmptyItem();

    this.cashier.childs.paymentDetails.setAndShow({ ...paymentNominals, id: this.#currentTransactionId });

    // change current transaction's status to 3 (completed)
    this.#currentTransaction.status = 3;
    //! this.__storeDataToDB();
  }

  cancelCurrentTransaction() {
    this.createTransaction();
    // clear previous transaction data
  }

  createTransaction() {
    // create new transaction
    this.#resetPurchasesElement();
    this.#currentTransaction = new Transaction(this);

    this.#transactionList.push(this.#currentTransaction);

    // set the available shortcuts
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F2: true,
      F11: false,
    });
  }

  #resetPurchasesElement() {
    this.purchasesElement.innerHTML = EMPTY_TRANSACTION_HTML;
  }

  #searchTransaction(transactionId) {
    const transactionIndex = this.#transactionList.findIndex(
      (transaction) => transaction.transactionInfo.id === transactionId
    );
    if (transactionIndex !== -1) {
      return this.#transactionList[transactionIndex];
    }
  }

  get currentTransactionObject() {
    return this.#currentTransaction.transactionInfo.object;
  }

  get currentTransaction() {
    return this.#currentTransaction;
  }
}

let idCounter = 1;

class Transaction {
  // transaction properties

  #transactionInfo = {
    id: idCounter++, // create get id function
    status: 1,
    cashInfo: {
      totalPrice: 0,
      paidbyCustomer: null,
      change: null,
    },
    itemList: [],
  };

  constructor(transactionList) {
    this.transactionList = transactionList;

    this.#transactionInfo.itemList = new ItemList(this);
  }

  get transactionInfo() {
    return { ...this.#transactionInfo };
  }

  get itemList() {
    return this.#transactionInfo.itemList;
  }

  set status(status) {
    this.#transactionInfo.status = status;
  }

  set cashInfo(cashInfo) {
    this.#transactionInfo.cashInfo = { ...cashInfo };
  }
}
