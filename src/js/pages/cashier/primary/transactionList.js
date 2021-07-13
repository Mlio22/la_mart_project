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

      return status === transactionStatus && this.#currentTransaction !== transaction;
    });
  }

  loadTransaction(transactionId) {
    if (this.#currentTransaction.itemList.items.length > 1 && this.#currentTransaction.transactionInfo.status !== 3) {
      // save current transaction before loading other transaction
      // unless it's already completed
      this.saveCurrentTransaction();
    }

    this.#currentTransaction = this.#searchTransaction(transactionId);

    if (this.#currentTransaction.transactionInfo.status === 2) {
      // load saved transaction

      // change current transaction's status to 1 (working)
      this.#currentTransaction.status = 1;

      // clear the purchases element and restore the items
      this.#resetPurchasesElement();
      this.#currentTransaction.itemList.restoreItemList(false);

      // add new empty element
      this.#currentTransaction.itemList.createNewItem();
    }

    if (this.#currentTransaction.transactionInfo.status === 3) {
      // load already completed transactions (status = 3)
      // only show transaction data

      this.#resetPurchasesElement();
      this.#currentTransaction.itemList.restoreItemList(true);

      // restore the totalPrice
      this.#currentTransaction.itemList.refreshTotalPrice();

      // and paymentDetails
      const {
        id,
        cashInfo: { customer, totalPrice },
      } = this.#currentTransaction.transactionInfo;

      this.cashier.childs.paymentDetails.setAndShow({ id, customer, totalPrice });

      // enable new transaction shortcut
      this.cashier.childs.shortcuts.setShortcutAvailability({
        F5: true,
        F11: true,
      });
    }
  }

  saveCurrentTransaction() {
    // change current transaction's status to 2 (saved)
    this.#currentTransaction.status = 2;

    // remove last empty item
    this.#currentTransaction.transactionInfo.itemList.removeLastEmptyItem();

    // create new transaction
    this.createTransaction();
    this.#checkTransactionsList();
  }

  completeCurrentTransaction(paymentNominals) {
    this.#currentTransaction.transactionInfo.itemList.removeLastEmptyItem();

    // lock items
    this.#currentTransaction.itemList.lockAllItems();

    this.cashier.childs.paymentDetails.setAndShow({
      id: this.#currentTransaction.transactionInfo.id,
      ...paymentNominals,
    });

    this.#currentTransaction.cashInfo = { ...paymentNominals };

    // change current transaction's status to 3 (completed)
    this.#currentTransaction.status = 3;
    this.#checkTransactionsList();
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

  #checkTransactionsList() {
    // this method sets openTransaction shortcut Availability
    // based on is there saved/completed transaction or not

    const savedOrCompletedTransactionIndex = this.#transactionList.findIndex(({ transactionInfo: { status } }) => {
      return status === 2 || status === 3;
    });

    if (savedOrCompletedTransactionIndex >= 0) {
      this.cashier.childs.shortcuts.setShortcutAvailability({
        F7: true,
      });
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
      customer: 0,
      totalPrice: 0,
    },
    itemList: null,
  };

  constructor(transactionList) {
    this.transactionList = transactionList;

    this.#transactionInfo.itemList = new ItemList(this);
  }

  get transactionInfo() {
    return { ...this.#transactionInfo };
  }

  get itemList() {
    /* warning: this can affect directly to the itemlist object. 
      use transactionInfo getter if you want to get only the value of itemList
      use this only if you need the reference and wanted to change it directly
    */
    return this.#transactionInfo.itemList;
  }

  set status(status) {
    this.#transactionInfo.status = status;
  }

  set cashInfo(cashInfo) {
    this.#transactionInfo.cashInfo = { ...this.#transactionInfo.cashInfo, ...cashInfo };
  }
}
