/**
 * class EndpointAPI is for connecting db (node) and frontend (cjs) using IPC listeners
 *
 */
const { ipcRenderer } = require("electron");

export class CashierInvoker {
  static async searchItemDB(param) {
    return ipcRenderer.invoke("search-item-db", param);
  }

  /**
   * Create or update an transactionAll
   * @param {Object} storeTransactionAllData
   * @param {number} [storeTransactionAllData.transactionAllId=null] - existing transactionALl id for updating
   * @param {Array<Object>} storeTransactionAllData.log - list of TransactionLog logs
   * @returns {(number | void)} - id of new transactionAll or null if for updating existing transactionAll
   */
  static async storeTransactionAll({ transactionAllId = null, log }) {
    // create new transactionAll if transactionAllId is null
    const data = { log };
    if (transactionAllId === null) {
      return ipcRenderer.invoke("new-transaction-all", { data });
    } else {
      return ipcRenderer.invoke("edit-transaction-all", { transactionAllId, data });
    }
  }

  /**
   * delete a transactionAll with existing id
   * @param {Object} deleteTransactionAllData
   * @param {number} deleteTransactionAllData.transactionAllId - existing transactionALl id
   * @param {Array<Object>} deleteTransactionAllData.log - last latest TransactionLog logs
   * @returns {void}
   */

  static async deleteTransactionAll({ transactionAllId, log }) {
    const data = { log };
    return ipcRenderer.invoke("delete-transaction-all", { transactionAllId, data });
  }

  /**
   * Create new transactionItem or update existing transactionItem
   * @param {Object} storeTransactionItemData
   * @param {number} [storeTransactionItemData.transactionAllId=null] - existing transactionAll id for creating new transactionItem
   * @param {number} [storeTransactionItemData.transactionItemId=null] - existing transactionItem id for updating
   * @param {Object} storeTransactionItemData.data
   * @param {number} storeTransactionItemData.data.itemId - existing item id from DB
   * @param {amount} storeTransactionItemData.data.amount - amount of item
   * @param {Array<Object>} storeTransactionItemData.data.log - list of ItemLog logs
   * @returns {(number|void)} - id of new transactionItem or undefined if for updating
   */

  static async storeTransactionItem({ transactionAllId = null, transactionItemId = null, data }) {
    // create new transaction item
    if (transactionAllId) {
      return ipcRenderer.invoke("new-transaction-item", { transactionAllId, data });
    }

    // update exist transaction item
    else if (transactionItemId) {
      return ipcRenderer.invoke("edit-transaction-item", { transactionItemId, data });
    }

    // todo: error
    else {
    }
  }

  /**
   * delete a transactionItem with existing id
   * @param {Object} deleteTransactionItemData
   * @param {number} deleteTransactionItemData.transactionItemId - existing transactionItem id
   * @param {Array<Object>} deleteTransactionItemData.log - last latest of transactionItem logs
   * @returns {void}
   */

  static async deleteTransactionItem({ transactionItemId, log }) {
    const data = { log };
    return ipcRenderer.invoke("delete-transaction-item", { transactionItemId, data });
  }

  static async createReportSession() {}
  static async createReportDaily() {}
  static async createPayment() {}
}
