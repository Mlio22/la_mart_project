import { Transaction } from "./transaction.js";

let TRANSACTION_ID = 0;

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

// Status list:
// 1 : working
// 2 : saved
// 3 : completed
// 4 : cancelled

export class Transactions {
  constructor(cashier, purchasesElement) {
    this.__cashier = cashier;
    this.__purchasesElement = purchasesElement;

    this.__transactionList = [];
    this.__currentTransaction = null;

    // initial transaction
    this.__createTransaction();
  }

  __resetPurchasesElement() {
    this.__purchasesElement.innerHTML = EMPTY_TRANSACTION_HTML;
  }

  __getTransactionId() {
    // example
    TRANSACTION_ID += 1;
    return TRANSACTION_ID;

    //   connect to API/DB
  }

  __storeDataToDB() {
    // store data to db
  }

  __createTransaction(cancelledPreviousId) {
    // create new transaction
    this.__resetPurchasesElement();

    // if previous transaction is cancelled, then its id can be reused
    const transactionId = cancelledPreviousId ?? this.__getTransactionId();

    const transactionObject = new Transaction(this.__cashier, this.__purchasesElement),
      transactionStatus = 1;

    this.__currentTransaction = {
      id: transactionId,
      object: transactionObject,
      status: transactionStatus,
    };

    console.log(`${cancelledPreviousId ? "re-starting" : "starting"} transaction with id: ${transactionId}`);

    this.__transactionList.push(this.__currentTransaction);
  }

  __searchTransaction(transactionId) {
    for (const transaction in this.__transactionList) {
      if (transaction.id === transactionId) {
        return transaction;
      }
    }
  }

  saveCurrentTransaction() {
    // change current transaction's status to 2 (saved)
    this.__currentTransaction.status = 2;

    console.log(`saving transaction with id: ${this.__currentTransaction.id}`);

    // create new transaction
    this.__createTransaction();
  }

  loadTransaction(transactionId) {
    this.__currentTransaction = this.__searchTransaction(transactionId);

    // change current transaction's status to 1 (working)
    this.__currentTransaction.status = 1;
    console.log(`loading transaction with id: ${this.__currentTransaction.id}`);

    // clear the purchases element and restore the items
    this.__resetPurchasesElement();
    this.__currentTransaction.object.restoreItems();
  }

  completeCurrentTransaction() {
    console.log(`transaction with id: ${this.__currentTransaction.id} done!`);

    // change current transaction's status to 3 (completed)
    this.__currentTransaction.status = 3;
    this.__storeDataToDB();

    // create new transaction
    this.__createTransaction();
  }

  // extra ordinary methods
  createNewItem(itemData) {
    // used in submenu(search-item) to transaction
    this.__currentTransaction.object.createNewItem(itemData);
  }

  cancelCurrentTransaction() {
    this.__createTransaction(this.__currentTransaction.id);
  }

  get currentTransactionObject() {
    return this.__currentTransaction.object;
  }
}
