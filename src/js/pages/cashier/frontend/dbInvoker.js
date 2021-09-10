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

  static async createTransactionItem(param) {
    return ipcRenderer.invoke("new-transaction-item", param);
  }

  static async createReportSession() {}
  static async createReportDaily() {}
}
