import { ItemList } from "./itemList.js";
import { TransactionLog } from "../../../../../etc/Log.js";
import { deepEqual } from "../../../../../etc/others.mjs";
import { CashierInvoker } from "../../dbInvoker.js";

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
  #transactionLog = [new TransactionLog(11)];
  #savedLogs = null; // saved logs in DB

  #transactionInfo = {
    id: null,
    statusCode: 1,
    statusText: "working",
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

  #addLog(code) {
    this.#transactionLog.push(new TransactionLog(code));
  }

  #loadTransaction() {
    // restore items
    this.#transactionInfo.itemList.restoreItemList();

    // set transaction statusCode to 1 (working)
    this.statusCode = 1;

    // add log: re-opening (saved)
    this.#addLog(12);
  }

  #restoreTransaction() {
    // restore items
    this.#transactionInfo.itemList.restoreItemList();

    // restore the totalPrice
    this.#transactionInfo.itemList.refreshTotalPrice();

    // set transaction statusCode  to 3 (completed)
    this.statusCode = 3;

    // add log: re-opening (completed)
    this.#addLog(13);
  }

  saveTransaction() {
    // remove last empty item
    this.transactionInfo.itemList.removeLastEmptyItem();

    // change current transaction's statusCode to 2 (saved)
    this.statusCode = 2;

    // add TransactionLog: saved (2)
    this.#addLog(2);
  }

  completeTransaction() {
    this.transactionInfo.itemList.removeLastEmptyItem();

    // change current transaction's statusCode to 3 (completed)
    this.#transactionInfo.statusCode = 3;

    // set current item to completed
    this.itemList.setToTransactionCompletedState();

    // add TransactionLog: completed (3)
    this.#addLog(3);

    this.#storeTransactionToDB();
  }

  cancelTransaction() {
    const isTransactionCompleted = this.completed;

    // change statusCode to 4 (cancelled) or 7 (cancelled after completed)
    this.#transactionInfo.statusCode = 4;

    // log with code 4 (cancelled) or 5 (cancelled after completed)
    this.#addLog(isTransactionCompleted ? 42 : 41);

    this.#cancelTransactionToDB();
  }

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

  reopenTransaction() {
    // load or restore the transaction
    if (this.saved) {
      this.#loadTransaction();
    } else if (this.completed) {
      this.#restoreTransaction();
    }
  }

  async #storeTransactionToDB() {
    // create logs
    const latestLogs = this.#transactionLog.map((log) => log.log);

    // add to DB if id not exists
    if (this.#transactionInfo.id === null) {
      const id = await CashierInvoker.storeTransactionAll({ log: latestLogs });
      this.#transactionInfo.id = id;
    }

    // update DB if a new log exists
    else if (!deepEqual(this.#savedLogs, latestLogs)) {
      await CashierInvoker.storeTransactionAll({
        transactionAllId: this.#transactionInfo.id,
        data: latestLogs,
      });
    }

    // add items to DB
    await this.itemList.storeItemsToDB();

    // update local logs
    this.#savedLogs = latestLogs;
  }

  #cancelTransactionToDB() {
    // delete existing transactionAll
    const transactionAllLogs = this.#transactionLog.map((log) => log.log);

    // delete to DB
    CashierInvoker.deleteTransactionAll({
      transactionAllId: this.#transactionInfo.id,
      data: {
        log: transactionAllLogs,
      },
    });
  }

  get transactionInfo() {
    return { ...this.#transactionInfo };
  }

  get id() {
    return this.#transactionInfo.id;
  }

  get statusCode() {
    return this.#transactionInfo.statusCode;
  }

  get statusText() {
    return this.#transactionInfo.statusText;
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
    const { itemList, statusCode } = this.#transactionInfo;
    return itemList.items.length > 1 && statusCode !== 3;
  }

  get working() {
    return this.#transactionInfo.statusCode === 1;
  }

  get saved() {
    return this.#transactionInfo.statusCode === 2;
  }

  get completed() {
    return this.#transactionInfo.statusCode === 3;
  }

  get cancelledBeforeCompleted() {
    return this.#transactionInfo.statusCode === 4;
  }

  get cancelledAfterCompleted() {
    return this.#transactionInfo.statusCode === 7;
  }

  get cancelled() {
    // return true if transaction is cancelled (either it's already completed or not)
    const statusCode = this.#transactionInfo.statusCode;
    return statusCode === 4 || statusCode === 7;
  }

  set statusCode(statusCode) {
    this.#transactionInfo.statusCode = statusCode;
    this.#transactionInfo.statusText = statusCodeToText(statusCode);
  }

  set cashInfo(cashInfo) {
    this.#transactionInfo.cashInfo = { ...this.#transactionInfo.cashInfo, ...cashInfo };
  }
}
