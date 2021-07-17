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

  retrieveTransactionList(status = 2) {
    // Status list:
    // 1 : working
    // 2 : saved
    // 3 : completed
    // 4 : cancelled
    // 5 : cancelled after completed
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

    // search transaction and logging
    this.#currentTransaction = this.#searchTransaction(transactionId);
    this.#currentTransaction.addLog(6);

    // load saved transaction
    if (this.#currentTransaction.transactionInfo.status === 2) {
      // change current transaction's status to 1 (working)
      this.#currentTransaction.status = 1;

      // clear the purchases element and restore the items
      this.#resetPurchasesElement();
      this.#currentTransaction.itemList.restoreItemList(false);

      // add new empty element
      this.#currentTransaction.itemList.createNewItem();
    }

    // load already completed transactions (status = 3)
    if (this.#currentTransaction.transactionInfo.status === 3) {
      // clear the purchases element and restore the items
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

      // change other shortcut availability status
      this.cashier.childs.shortcuts.setShortcutAvailability({
        F2: false,
        F5: true,
        F11: true,
      });
    }

    // check transactionList
    this.#checkTransactionsList();

    // able to delete transaction (both completed or incompleted transactions)
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F9: true,
    });
  }

  saveCurrentTransaction() {
    // change current transaction's status to 2 (saved)
    this.#currentTransaction.status = 2;

    // remove last empty item
    this.#currentTransaction.transactionInfo.itemList.removeLastEmptyItem();

    this.#currentTransaction.addLog(2);

    // create new transaction
    this.createTransaction();

    // check transactionList
    this.#checkTransactionsList();
  }

  completeCurrentTransaction(paymentNominals) {
    this.#currentTransaction.transactionInfo.itemList.removeLastEmptyItem();

    // set the paymentDetails
    this.cashier.childs.paymentDetails.setAndShow({
      id: this.#currentTransaction.transactionInfo.id,
      ...paymentNominals,
    });

    // set the cash info
    this.#currentTransaction.cashInfo = { ...paymentNominals };

    // change current transaction's status to 3 (completed)
    this.#currentTransaction.status = 3;
    this.#currentTransaction.addLog(3);

    // set current item to completed
    this.#currentTransaction.itemList.transactionCompleted();

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
    //! this.__storeDataToDB();
  }

  cancelCurrentTransaction() {
    const isTransactionCompleted = this.#currentTransaction.transactionInfo.status;

    // change status and logging
    this.#currentTransaction.status = isTransactionCompleted ? 5 : 4;
    this.#currentTransaction.addLog(isTransactionCompleted ? 5 : 4);

    // check transactionList
    this.#checkTransactionsList();

    this.createTransaction();
  }

  createTransaction(starterItem) {
    // reset purchases element
    this.#resetPurchasesElement();

    // hide the previous paymentDetails if available
    this.cashier.childs.paymentDetails.clearPayment();

    // create new transaction
    this.#currentTransaction = new Transaction(this, starterItem);
    this.#currentTransaction.addLog(1);
    this.#transactionList.push(this.#currentTransaction);

    // check transactionList
    this.#checkTransactionsList();

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

    const savedOrCompletedTransactionIndex = this.#transactionList.findIndex((transaction) => {
      const notThisTransaction = transaction !== this.#currentTransaction,
        status = transaction.transactionInfo.status;
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
}

let idCounter = 1;

class Transaction {
  // transaction properties
  #transactionLog = [];

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

  addLog(code) {
    this.#transactionLog.push(new TransactionLog(code));
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

  get transactionLog() {
    return this.#transactionLog;
  }

  set status(status) {
    this.#transactionInfo.status = status;
  }

  set cashInfo(cashInfo) {
    this.#transactionInfo.cashInfo = { ...this.#transactionInfo.cashInfo, ...cashInfo };
  }
}
