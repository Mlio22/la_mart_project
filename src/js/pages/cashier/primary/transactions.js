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

export class Transactions {
  #transactionList = [];
  #currentTransaction = null;
  #currentTransactionId = null;

  constructor(cashier) {
    this.cashier = cashier;
    this.purchasesElement = cashier.element.querySelector(".purchases");

    // initial transaction
    this.#createTransaction();
  }

  loadTransaction(transactionId) {
    console.log(`loading transaction with id: ${this.#currentTransaction.id}`);
    this.#currentTransaction = this.#searchTransaction(transactionId);

    // change current transaction's status to 1 (working)
    this.#currentTransaction.status = 1;

    // clear the purchases element and restore the items
    this.#resetPurchasesElement();
    this.#currentTransaction.restoreTransactionItems();
  }

  saveCurrentTransaction() {
    console.log(`saving transaction with id: ${this.#currentTransaction.id}`);
    // change current transaction's status to 2 (saved)
    this.#currentTransaction.status = 2;

    // create new transaction
    this.#createTransaction();
  }

  completeCurrentTransaction(paymentNominals) {
    console.log(`transaction with id: ${this.#currentTransaction.id} done!`);

    this.cashier.childs.paymentDetails.setAndShow({ ...paymentNominals, id: this.#currentTransactionId });

    // change current transaction's status to 3 (completed)
    this.#currentTransaction.status = 3;
    //! this.__storeDataToDB();
  }

  cancelCurrentTransaction() {
    this.#createTransaction();
    // clear previous transaction data
  }

  #createTransaction() {
    // create new transaction
    this.#resetPurchasesElement();
    this.#currentTransaction = new Transaction(this.cashier);

    this.#transactionList.push(this.#currentTransaction);
  }

  #resetPurchasesElement() {
    this.purchasesElement.innerHTML = EMPTY_TRANSACTION_HTML;
  }

  #searchTransaction(transactionId) {
    const transactionIndex = this.#transactionList.findIndex((transaction) => transaction.id === transactionId);
    if (transactionIndex !== -1) {
      return this.#transactionList[transactionIndex];
    }
  }

  get currentTransactionObject() {
    return this.#currentTransaction.object;
  }

  get currentTransaction() {
    return this.#currentTransaction;
  }
}
