import { Transaction } from "./transactions-helper/transaction.js";

/**
 * @typedef {import ('../main').CashierUI} CashierUI
 * @typedef {import ('./transactions-helper/item').ItemData} ItemData
 */

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
  /**
   * contains all transaction in current session
   * @type {Array<Transaction>}
   */
  #transactionList = [];

  /**
   * current used transaction, in working or completed status
   * @type {Transaction}
   */
  #currentTransaction = null;

  /**
   * current local id in current session
   * @type {Number}
   */
  #currentLocalId = 0;

  /**
   * creates transactionList instance
   * @constructor
   * @param {CashierUI} cashier
   */
  constructor(cashier) {
    this.cashier = cashier;
  }

  init() {
    /**
     * contains .purchases element
     * @type {HTMLElement}
     */
    this.purchasesElement = this.cashier.element.querySelector(".purchases");

    // initial transaction
    this.createTransaction();
  }

  /**
   * generates local id for new transactions
   * @returns {Number} new local transaction id
   */
  generateLocalId() {
    this.#currentLocalId += 1;
    return this.#currentLocalId;
  }

  /**
   * creates new transaction
   * @param {ItemData} [starterItemData] - if new transaction triggered by SearchItem
   */
  createTransaction(starterItemData) {
    // close current transaction if there's working transaction
    // by save it if not completed
    // or close it if completed
    if (this.#currentTransaction) this.#currentTransaction.closeTransaction();

    // reset purchases element
    this.#resetPurchasesElement();

    // hide the previous paymentDetails if showed
    this.cashier.childs.paymentDetails.clearPayment();

    // create new transaction
    this.#currentTransaction = new Transaction(this, starterItemData);
    this.#transactionList.push(this.#currentTransaction);

    // check transactionList
    this.#refreshShortcut();

    // set the available shortcuts
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F2: true,
      F11: false,
    });
  }

  /**
   * loads a saved transaction
   * @param {number} localTransactionId - transaction's id
   */
  loadTransaction(localTransactionId) {
    if (this.#currentTransaction.saveable) {
      // save current transaction before loading other transaction
      // unless it's already completed
      this.saveCurrentTransaction(false);
    }

    // clear the purchases element and reopen the transaction
    this.#resetPurchasesElement();

    // search, get and set the currentTransaction
    this.#currentTransaction = this.#searchTransaction(localTransactionId);

    if (this.#currentTransaction.completed) {
      this.cashier.childs.paymentDetails.showFromCurrentTransaction();

      // change other shortcut availability status
      // todo: buat perintah khusus untuk setShortcutAvailabilty yang sering digunakan
      // seperti shortcuts.transactionCompleted, dll
      this.cashier.childs.shortcuts.setShortcutAvailability({
        F2: false,
        F5: true,
        F11: true,
      });
    }

    // reopen (load or restore) transaction
    this.#currentTransaction.reopenTransaction();

    // check transactionList to afferct the shortcut buttons
    this.#refreshShortcut();

    // able to delete transaction (both completed or incompleted transactions)
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F9: true,
    });
  }

  /**
   * saves current transaction
   * @param {?Boolean} [createNewTransaction=true] - is it required to create new transaction
   */
  saveCurrentTransaction(createNewTransaction = true) {
    // save transaction
    this.#currentTransaction.saveTransaction();

    if (createNewTransaction) {
      // create new transaction
      this.createTransaction();

      // check transactionList
      this.#refreshShortcut();
    }
  }

  /**
   * completes current transaction
   * @async
   */
  async completeCurrentTransaction() {
    // complete current transaction
    await this.#currentTransaction.completeTransaction();

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
    this.#refreshShortcut();

    // force focus to cashier when it forced to submenu before
    // allowing to create new transaction when user type any charcater / insert any barcode
    this.cashier.focus();
  }

  /**
   * cancels current transaction
   */
  cancelCurrentTransaction() {
    this.#currentTransaction.cancelTransaction();

    // check transactionList
    this.#refreshShortcut();

    // create new transaction
    this.createTransaction();
  }

  /**
   * collect all transaction from list based on its statusses
   * @param {?Number} [status=2] - requested status of transaction
   * @param {?Boolean} [excludeCurrentTransaction=false]  - exclude current transaction?
   * @returns
   */
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

      const isMatch = status === transactionStatus;

      if (excludeCurrentTransaction) {
        isMatch = isMatch && this.#currentTransaction !== transaction;
      }

      return isMatch;
    });
  }

  /**
   * resets purchases element
   * @private
   */
  #resetPurchasesElement() {
    // refresh the purchases element HTML
    this.purchasesElement.innerHTML = EMPTY_TRANSACTION_HTML;
  }

  /**
   * searches transaction with matching local transaction id
   * @param {Number} localTransactionId - transaction's local id
   * @private
   * @returns {Transaction}
   */
  #searchTransaction(localTransactionId) {
    const transactionIndex = this.#transactionList.findIndex(
      (transaction) => transaction.localId === localTransactionId
    );

    if (transactionIndex !== -1) {
      return this.#transactionList[transactionIndex];
    }
  }

  /**
   * checks transactionList which will effect shortcut availabilty
   */
  #refreshShortcut() {
    // this method sets openTransaction shortcut Availability
    // based on is there saved/completed transaction or not

    const savedOrCompletedTransactionIndex = this.#transactionList.findIndex((transaction) => {
      const status = transaction.statusCode;
      return transaction !== this.#currentTransaction && (status === 2 || status === 3);
    });

    // set openTransaction shortcut availability based by any saved or completed transaction available
    this.cashier.childs.shortcuts.setShortcutAvailability({
      F7: savedOrCompletedTransactionIndex >= 0 ? true : false,
    });
  }

  /**
   * returns current working / completed transaction which is used
   * @returns {Transaction}
   */
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
