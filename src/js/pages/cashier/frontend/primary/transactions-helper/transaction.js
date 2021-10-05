/**
 * @typedef {import ("./itemList").ItemList} ItemList
 * @typedef {import ("../transactionList").TransactionList} TransactionList
 *
 * @typedef cashInfo - provides transaction's cash details
 * @type {Object}
 * @property {number} costumer - costumers money
 * @property {number} totalPrice - total price must be paid by costumer
 *
 *
 * @typedef TransactionInfo
 * @type {object}
 * @property {number} DBId - transaction's id in DB
 * @property {number} localId - transaction id in local (current cashier session)
 * @property {number} statusCode - transaction's status code
 * @property {string} statusText - transaction's status text
 * @property {cashInfo} cashInfo - tranasction's cashInfo details
 * @property {ItemList} itemList - transaction's itemList
 */

import { ItemList } from "./itemList.js";
import { TransactionLog } from "../../../../../etc/Log.js";
import { deepEqual } from "../../../../../etc/others.mjs";
import { CashierInvoker } from "../../dbInvoker.js";

/**
 * translates transaction code to transaction status
 * @param {Number} statusCode
 * @returns {String}
 */
function statusCodeToText(statusCode) {
  const statusses = {
    1: "working",
    2: "saved",
    3: "completed",
    4: "cancelled",
  };

  let statusText = statusses[statusCode] ?? "unknown";

  return statusText;
}

export class Transaction {
  // transaction properties
  /**
   * contains list of transactionLogs
   * @private
   * @type {Array<TransactionLog>}
   */
  #transactionLog = [new TransactionLog(11)];

  /**
   * current saved log in DB buffer
   * @private
   * @type {Array<TransactionLog>}
   */
  #savedLogs = []; // saved logs in DB

  /**
   * contains details of this transaction
   * @private
   * @type {TransactionInfo}
   */
  #transactionInfo = {
    DBId: null,
    localId: null,
    statusCode: 1,
    statusText: "working",
    cashInfo: {
      customer: 0,
      totalPrice: 0,
    },
    itemList: null,
  };

  /**
   * creates transaction, which will creates itemlist, item, etc
   * @param {TransactionList} transactionList
   * @param {Itemdata} [starterItemData] - data starter for new Item, e.g. selected item from SearchItem in a completed transaction
   */
  constructor(transactionList, starterItemData) {
    this.transactionList = transactionList;

    // get tranasction's local id
    this.#transactionInfo.localId = this.transactionList.generateLocalId();

    // creates itemlist
    this.#transactionInfo.itemList = new ItemList(this, starterItemData);
  }

  /**
   * @param {number} code
   * @private
   */
  #addLog(code) {
    this.#transactionLog.push(new TransactionLog(code));
  }

  /**
   * loads saved transsaction
   * @private
   */
  #loadTransaction() {
    // restore items
    this.#transactionInfo.itemList.restoreItemList();

    // set transaction statusCode to 1 (working)
    this.statusCode = 1;

    // add log: re-opening (saved)
    this.#addLog(12);
  }

  /**
   * restores completed transaction
   * @private
   */
  #restoreTransaction() {
    // restore items
    this.#transactionInfo.itemList.restoreItemList();

    // set transaction statusCode  to 3 (completed)
    this.statusCode = 3;

    // add log: re-opening (completed)
    this.#addLog(13);
  }

  /**
   * saves transaction
   */
  saveTransaction() {
    // remove last empty item
    this.transactionInfo.itemList.removeLastEmptyItem();

    // change current transaction's statusCode to 2 (saved)
    this.statusCode = 2;

    // add TransactionLog: saved (2)
    this.#addLog(2);
  }

  /**
   * complete this transaction
   * @async
   */
  async completeTransaction() {
    this.transactionInfo.itemList.removeLastEmptyItem();

    // change current transaction's statusCode to 3 (completed)
    this.#transactionInfo.statusCode = 3;

    // set current item to completed
    this.itemList.setToTransactionCompletedState();
    await this.itemList.storeItemsToDB();

    // add TransactionLog: completed (3)
    this.#addLog(3);

    this.#storeTransactionToDB();
  }

  /**
   * cancels this transaction
   */
  cancelTransaction() {
    const isTransactionCompleted = this.completed;

    // change statusCode to 4 (cancelled) or 7 (cancelled after completed)
    this.#transactionInfo.statusCode = 4;

    // log with code 4 (cancelled) or 5 (cancelled after completed)
    this.#addLog(isTransactionCompleted ? 42 : 41);

    this.#cancelTransactionToDB();
  }

  /**
   * closes this transaction
   */
  closeTransaction() {
    // store to database if completed
    if (this.completed) {
      // check if transaction edited or deleted after completed, before changed to a new transaction
      const itemsCount = this.itemList.itemCount;

      if (itemsCount > 0) {
        // store edited transaction
        this.#storeTransactionToDB();
        this.#addLog(5);
      } else {
        // cancel transaction
        this.cancelTransaction();
      }
    }
  }

  /**
   * reopens tranasction, which will load or restore the transaction, according to its status
   */
  reopenTransaction() {
    // load or restore the transaction
    if (this.saved) {
      this.#loadTransaction();
    } else if (this.completed) {
      this.#restoreTransaction();
    }
  }

  /**
   * store transactionAll data in DB
   * @private
   * @async
   */
  async #storeTransactionToDB() {
    // create logs
    const latestLogs = this.#transactionLog.map((log) => log.log);

    // obtain transaction's DB id
    const DBId = this.#transactionInfo.DBId;

    // add to DB if id not exists
    if (DBId === null) {
      const id = await CashierInvoker.storeTransactionAll({ log: latestLogs });
      this.#transactionInfo.DBId = id;
    }

    // update DB if a new log exists
    else if (!deepEqual(this.#savedLogs, latestLogs)) {
      await CashierInvoker.storeTransactionAll({
        transactionAllId: DBId,
        data: latestLogs,
      });
    }

    // add items to DB
    await this.itemList.storeItemsToDB();

    // update local logs
    this.#savedLogs = latestLogs;
  }

  /**
   * deletes transactionAll in DB
   * @async
   * @private
   */
  async #cancelTransactionToDB() {
    // cancel items first
    await this.itemList.deleteItemsFromDB();

    // delete existing transactionAll
    const transactionAllLogs = this.#transactionLog.map((log) => log.log);

    // delete to DB
    await CashierInvoker.deleteTransactionAll({
      transactionAllId: this.#transactionInfo.DBId,
      data: {
        log: transactionAllLogs,
      },
    });
  }

  /**
   * returns all detail of transaction's info, including id, statuscode, statustext, and cashInfo details
   * @type {TransactionInfo}
   */
  get transactionInfo() {
    return { ...this.#transactionInfo };
  }

  /**
   * returns transaction's DB id
   * @type {number}
   */
  get DBId() {
    return this.#transactionInfo.DBId;
  }

  /**
   * returns transaction's local ID
   * @type {number}
   */
  get localId() {
    return this.#transactionInfo.localId;
  }

  /**
   * returns transaction's status code
   * @type {number}
   */
  get statusCode() {
    return this.#transactionInfo.statusCode;
  }

  /**
   * returns transaction's status text
   * @type {string}
   */
  get statusText() {
    return this.#transactionInfo.statusText;
  }

  /**
   * returns transaction's cashInfo details
   * @type {cashInfo}
   */
  get cashInfo() {
    return this.#transactionInfo.cashInfo;
  }

  /**
   * returns transaction's itemList directly.
   * warning: this can affect directly to the itemlist object.
   * use transactionInfo getter if you want to get only the value of itemList
   * use this only if you need the reference and wanted to change it directly
   * @type {ItemList}
   */
  get itemList() {
    return this.#transactionInfo.itemList;
  }

  /**
   * returns transaction's logs list
   * @type {Array<TransactionLog>}
   */
  get transactionLog() {
    return this.#transactionLog;
  }

  /**
   * returns is transaction saveable
   * @type {Boolean}
   */
  get saveable() {
    // return if a transaction can be saved
    const { itemList, statusCode } = this.#transactionInfo;
    return itemList.items.length > 1 && statusCode === 1;
  }

  /**
   * returns is transaction is working
   * @type {Boolean}
   */
  get working() {
    return this.#transactionInfo.statusCode === 1;
  }

  /**
   * returns is transaction is saved
   * @type {Boolean}
   */
  get saved() {
    return this.#transactionInfo.statusCode === 2;
  }

  /**
   * returns is transaction is completed
   * @type {Boolean}
   */
  get completed() {
    return this.#transactionInfo.statusCode === 3;
  }

  /**
   * returns is transaction is cancelled before completed
   * @type {Boolean}
   */
  get cancelledBeforeCompleted() {
    return this.#transactionInfo.statusCode === 4;
  }

  /**
   * returnsm is transaction is cancelled after completed
   * @type {Boolean}
   */
  get cancelledAfterCompleted() {
    return this.#transactionInfo.statusCode === 7;
  }

  /**
   * returns is transaction is cancelled (either it's already completed or not)
   * @type {Boolean}
   */
  get cancelled() {
    //
    const statusCode = this.#transactionInfo.statusCode;
    return statusCode === 4 || statusCode === 7;
  }

  /**
   * set transaction DB id
   * @param {Number} id - new DB id
   */
  set DBId(id) {
    this.#transactionInfo.DBId = id;
  }

  /**
   * set transaction status code
   * @param {Number} statusCode
   */
  set statusCode(statusCode) {
    this.#transactionInfo.statusCode = statusCode;
    this.#transactionInfo.statusText = statusCodeToText(statusCode);
  }

  /**
   * set cashInfo detail
   * @param {cashInfo} cashInfo
   */
  set cashInfo(cashInfo) {
    this.#transactionInfo.cashInfo = { ...this.#transactionInfo.cashInfo, ...cashInfo };
  }
}
