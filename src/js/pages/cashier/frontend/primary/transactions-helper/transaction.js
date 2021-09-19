import { ItemList } from "./itemList.js";
import { TransactionLog } from "../../../../../etc/Log.js";
import { CashierInvoker } from "../../dbInvoker.js";

function statusCodeToText(statusCode) {
  const statusses = {
    1: "working",
    2: "saved",
    3: "completed",
    4: "cancelled",

    // re-opening
    51: "re-opening (saved)",
    52: "re-opening (completed)",

    //  after completed
    6: "edited after completed",
    7: "cancelled after completed",
  };

  let statusText = statusses[statusCode] ?? "unknown";

  return statusText;
}

export class Transaction {
  // transaction properties
  #transactionLog = [new TransactionLog(1)];

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
    // set transaction status to re-opening (saved)
    this.statusCode = 51;

    // restore items
    this.#transactionInfo.itemList.restoreItemList();

    // set transaction statusCode to 1 (working)
    this.statusCode = 1;

    // add log: re-opening (saved)
    this.#addLog(51);
  }

  #restoreTransaction() {
    // set transaction status to re-opening (completed)
    this.statusCode = 52;

    // restore items
    this.#transactionInfo.itemList.restoreItemList();

    // restore the totalPrice
    this.transactionInfo.itemList.refreshTotalPrice();

    // set transaction statusCode  to 3 (completed)
    this.statusCode = 3;

    // add log: re-opening (completed)
    this.#addLog(52);
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

  #storeTransactionToDB() {
    // create logs
    const logs = this.#transactionLog.map((log) => log.log);

    // add to DB
    CashierInvoker.createTransactionAll({ log: logs }).then(async (id) => {
      this.#transactionInfo.id = id;

      // add items to DB
      await this.itemList.storeItemsToDB();
    });
  }

  cancelTransaction() {
    const isTransactionCompleted = this.completed;

    // change statusCode to 4 (cancelled) or 7 (cancelled after completed)
    this.#transactionInfo.statusCode = isTransactionCompleted ? 7 : 4;

    // log with code 4 (cancelled) or 5 (cancelled after completed)
    this.#addLog(isTransactionCompleted ? 7 : 4);
  }

  reopenTransaction() {
    // load or restore the transaction
    if (this.saved) {
      this.#loadTransaction();
    } else if (this.completed) {
      this.#restoreTransaction();
    }
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

  get loading() {
    return this.#transactionInfo.statusCode === 51;
  }

  get restoring() {
    return this.#transactionInfo.statusCode === 52;
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
