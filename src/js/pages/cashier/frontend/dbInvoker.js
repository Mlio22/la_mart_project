/**
 * class EndpointAPI is for connecting db (node) and frontend (cjs) using IPC listeners
 *
 */
const { ipcRenderer } = require("electron");

class CashierLogInvoker {}

export class CashierInvoker {
  static log = CashierLogInvoker;

  static async searchItemDB(param) {
    return ipcRenderer.invoke("search-item-db", param);
  }

  static async createTransactionAll(param) {
    return ipcRenderer.invoke("new-transaction-all", param);
  }

  static async storeTransactionItem({
    transactionAllId = null,
    transactionItemId = null,
    itemId,
    amount,
    log,
  }) {
    const param = {
      itemId,
      amount,
      log,
    };

    // create new transaction item
    if (transactionAllId) {
      return ipcRenderer.invoke("new-transaction-item", { ...param, transactionAllId });
    }

    // update exist transaction item
    if (transactionItemId) {
      return ipcRenderer.invoke("edit-transaction-item", { ...param, transactionItemId });
    }
  }

  static async createReportSession() {}
  static async createReportDaily() {}
  static async createPayment() {}
}
