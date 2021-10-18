/**
 * @typedef {import ('../../../etc/ItemData').ItemData} ItemData
 */

import { ItemDataInformation } from "../../../etc/ItemData.js";

const { ipcRenderer } = require("electron");

/**
 * class EndpointAPI is for connecting db (node) and frontend (cjs) using IPC listeners
 */
export class CashierInvoker {
  /**
   * Create or update an transactionAll
   * @async
   * @static
   * @param {Object} storeTransactionAllData
   * @param {number} [storeTransactionAllData.transactionAllId=null] - existing transactionALl id for updating
   * @param {Array<Object>} storeTransactionAllData.log - list of TransactionLog logs
   * @returns {Promise<(number | void)>} - id of new transactionAll or null if for updating existing transactionAll
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
   * @async
   * @static
   * @param {Object} deleteTransactionAllData
   * @param {number} deleteTransactionAllData.transactionAllId - existing transactionALl id
   * @param {Array<Object>} deleteTransactionAllData.log - last latest TransactionLog logs
   * @returns {Promise<void>}
   */

  static async deleteTransactionAll({ transactionAllId, log }) {
    const data = { log };
    return ipcRenderer.invoke("delete-transaction-all", { transactionAllId, data });
  }

  /**
   * Create new transactionItem or update existing transactionItem
   * @async
   * @static
   * @param {Object} storeTransactionItemData
   * @param {?number} [storeTransactionItemData.transactionAllId] - existing transactionAll id for creating new transactionItem
   * @param {?number} [storeTransactionItemData.transactionItemId] - existing transactionItem id for updating
   * @param {Object} storeTransactionItemData.data
   * @param {number} storeTransactionItemData.data.itemId - existing item id from DB
   * @param {amount} storeTransactionItemData.data.amount - amount of item
   * @param {Array<Object>} storeTransactionItemData.data.log - list of ItemLog logs
   * @returns {Promise<(number|void)>} - id of new transactionItem or undefined if for updating
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
   * @async
   * @static
   * @param {Object} deleteTransactionItemData
   * @param {number} deleteTransactionItemData.transactionItemId - existing transactionItem id
   * @param {Array<Object>} deleteTransactionItemData.log - last latest of transactionItem logs
   * @returns {Promise<void>}
   */

  static async deleteTransactionItem({ transactionItemId, log }) {
    const data = { log };
    return ipcRenderer.invoke("delete-transaction-item", { transactionItemId, data });
  }

  static async createReportSession() {}
  static async createReportDaily() {}
  static async createPayment() {}
}

/**
 * endpoint API to DB Item
 */
export class ItemInvoker {
  /**
   * contains previously searched item details, for faster searching
   * @static
   * @private
   * @type {Array<ItemData>}
   */
  static #searchedItemList = [];

  /**
   * obtains item details from DB
   * @async
   * @static
   * @param {Object} searchItemDetailsParam
   * @param {String} searchItemDetailsParam.hint - hint to search in DB
   * @param {Array<String>} searchItemDetailsParam.param - which item's property will be used for filtering
   * @param {Boolean} searchItemDetailsParam.full_match - is it must be exactly match or partially
   * @param {"cashier" | "stock")} searchItemDetailsParam.type - is it must be exactly match or partially
   * @returns {Promise<Array<ItemData>, void>}
   */
  static async searchItemDetails({ hint, params, full_match, type }) {
    // todo: throw error if params has insufficent values
    // todo: search from #searchItemList first before using DB

    const details = { hint, params, full_match, type };
    let searchedItems = await ipcRenderer.invoke("search-item-db", { ...details });

    searchedItems = searchedItems.map((searchedItemData) => {
      return new ItemDataInformation(searchedItemData);
    });

    // add to searchItemDetails list
    this.#searchedItemList[hint] = searchedItems;

    return [...searchedItems];
  }

  static async addItem() {}

  static async alterItemAmount() {}

  static async updateItemDetail() {}
}
