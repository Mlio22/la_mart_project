import { BarcodeElement, TextElement, ActionElement, AmountElement } from "./itemElement.js";
import { set_proper_price } from "../../../../../etc/others.mjs";
import { ItemLog } from "../../../../../etc/Log.js";
import { SearchItem } from "../shortcuts-helper/shortcut-objects/searchItem.js";
import { CashierInvoker } from "../../dbInvoker.js";
import { deepEqual } from "../../../../../etc/others.mjs";

/**
 * @typedef {import('../transactions-helper/itemList').ItemList} ItemList
 *
 * @typedef ItemData
 * @type {Object}
 * @property {?number} id - item id from DB
 * @property {string} barcode - item barcode from DB
 * @property {string} name - item name from DB
 * @property {string} quantity - item quantity
 * @property {number} price - item price
 * @property {boolean} valid - is item valid or not?
 * @property {?number} amount - current item amount
 * @property {?number} maxAmount - max amount
 *
 * @typedef ElementContent
 * @type {Object}
 * @property {ActionElement} actionElement
 * @property {BarcodeElement} barcodeElement
 * @property {TextElement} nameElement
 * @property {TextElement} quantityElement
 * @property {TextElement} priceElement
 * @property {AmountElement} amountElement
 * @property {TextElement} totalPriceElement
 */

/**
 * @type {ItemData}
 * @constant
 * @default
 */
const EMPTY_ITEM = {
  id: null,
  barcode: "",
  name: "",
  quantity: "",
  price: 0,
  valid: false,
};

export class Item {
  /**
   * contains id generated from DB
   * @type {number}
   */
  #dbid = null;

  /**
   * contains logs
   * @type {Array<ItemLog>}
   * */
  #itemLog = [];

  /**
   * saved item data in DB as buffer
   * and updates Item updated in DB
   * @type {ItemData}
   */
  #savedItemData = null;

  /**
   * element that contains UIs
   * @type {HTMLElement}
   */
  #listElement = null;

  /**
   * contains data detail of this item
   * @type {ItemData}
   */
  #data;

  /**
   * element itemUI
   * @type {ItemUI}
   */
  #ui;

  /**
   * creating item
   * @param {ItemList} itemList - referenced itemlist
   * @param {HTMLElement} listElement - itemlist element
   * @param {Object} [data]
   */
  constructor(itemList, listElement, data = { ...EMPTY_ITEM }) {
    /**
     * @type {ItemList}
     */
    this.itemList = itemList;

    /**
     * @type {HTMLElement}
     */
    this.#listElement = listElement;

    // gather transaction statusses and data
    this.#gatherData(data);
    this.#gatherTransactionInfo();

    // add ui class property
    this.#createUi();

    this.#init();
  }

  /**
   * @private
   */
  #gatherTransactionInfo() {
    /**
     * @property {Object} transactionStatus
     * @property {boolean} transactionStatus.isWorking
     * @property {boolean} transactionStatus.isSaved
     * @property {boolean} transactionStatus.isCompleted
     */
    this.transactionStatus = {
      isWorking: this.itemList.transaction.working,
      isSaved: this.itemList.transaction.saved,
      isCompleted: this.itemList.transaction.completed,
    };
  }

  /**
   * gather data if available
   * @private
   * @param {ItemData} data
   */
  #gatherData(data) {
    // checks if data has sufficent properties
    const validProperties = ["barcode", "name", "quantity", "price"],
      ispropertiesValid = validProperties.every((x) => x in data);

    if (!ispropertiesValid) {
      // todo: error
      this.#data = { ...EMPTY_ITEM };
    }

    this.#data = {
      amount: 1,
      ...data,
    };
  }

  /**
   * create UI for new item or
   * restore UI for completed item
   * @private
   */
  #createUi() {
    this.#ui = new ItemUI(this, this.#listElement, { ...this.#data });
  }

  /**
   * @private
   */
  #init() {
    // setting timeout to fix item's index in itemList
    setTimeout(() => {
      this.itemList.refreshTotalPrice();
      this.#checkData();

      // add ItemLog: item initialized (blank) (10)
      this.#itemLog.push(new ItemLog(10));
    }, 50);
  }

  /**
   * restore completed item
   */
  restoreItem() {
    this.#createUi();
    this.#itemLog.push(new ItemLog(11));
  }

  /**
   * check data validity
   * and create a new item if last item valid
   * @private
   */
  #checkData() {
    if (this.#data.valid) {
      this.#ui.childElements.barcodeElement.lock();
      this.itemList.createNewItem();
    } else {
      this.#ui.childElements.barcodeElement.focus();
    }
  }

  /**
   * checking if the #data is the same as EMPTY_ITEM
   * @returns {boolean} is #data empty
   */
  isItemEmpty() {
    return JSON.stringify({ ...this.#data, ...EMPTY_ITEM }) === JSON.stringify(this.#data);
  }

  /**
   * renew the transaction statusses
   */
  checkTransactionStatus() {
    this.#gatherTransactionInfo();

    // if transaction completed, set max amount of item
    if (this.transactionStatus.isCompleted) {
      this.#setMaxAmount();
    }
  }

  /**
   * @private
   * set max value of item's amount after item transaction completed
   */
  #setMaxAmount() {
    const { amount } = this.#data;
    this.#data.maxAmount = amount;

    // set max amount in ui input
    this.#ui.childElements.amountElement.setMaxAmount();
  }

  /**
   * delete this item from ui and transaction
   */
  async deleteThisItem() {
    // remove item from list and ui
    this.itemList.removeItemFromList(this);
    this.#ui.removeUi();

    // refresh total price
    this.itemList.refreshTotalPrice();

    // logging
    // checking if item is blank or not
    if (this.isItemEmpty()) {
      this.#itemLog.push(new ItemLog(42));
    } else {
      this.#itemLog.push(new ItemLog(this.transactionStatus.isCompleted ? 41 : 40));
    }

    // delete from db if exist in db
    if (this.#dbid) {
      await this.deleteItemDB();
    }

    this.itemList.focusToLatestBarcode();
  }

  /**
   * increase this item's amount
   * @param {?number} amount - number of amount
   */
  increaseAmount(amount = 1) {
    const nextAmount = this.#data.amount + amount;
    this.setSeveralItemData({ amount: nextAmount });
  }

  /**
   * decrease this item's amount
   * @param {?number} amount - number of amount
   */
  decreaseAmount(amount = 1) {
    let nextAmount = this.#data.amount - amount;

    // reset amount if it reaches zero
    if (nextAmount < 1) {
      nextAmount = 1;
    }

    this.setSeveralItemData({ amount: nextAmount });
  }

  /**
   * set single or multiple data
   * @param {ItemData} newData
   */
  setSeveralItemData(newData) {
    const newDataProperty = { ...this.#data, ...newData };
    this.#data = { ...newDataProperty };

    // affect other elements
    this.#ui.itemContent = this.#data;
    this.itemList.refreshTotalPrice();

    // logging
    const logCode = this.transactionStatus.isCompleted ? 31 : 30;
    this.#itemLog.push(new ItemLog(logCode));
  }

  /**
   * resets item input element
   * @private
   */

  #resetItemUI() {
    this.setSeveralItemData({ barcode: "", amount: 1 });
  }

  /**
   * resets item data
   * @private
   */
  #resetItemData() {
    this.#data = { amount: 1, ...EMPTY_ITEM };
  }

  /**
   * @readonly
   * @returns {ItemData}
   */
  get data() {
    return this.#data;
  }

  /**
   * @readonly
   * @returns {ItemUI}
   */
  get ui() {
    return this.#ui;
  }

  /**
   * set data absolutely, from e.g. search-item
   * so the data will be always valid
   * unless it's duplicate, it'll be resetted
   * it only needs item id to log
   * function called from search-item
   *
   * @param {object} setDataParam
   * @param {ItemData} setDataParam.data
   * @param {?number} setDataParam.code
   *
   */
  set data({ data = EMPTY_ITEM, code = null }) {
    // logging
    this.#itemLog.push(new ItemLog(code, data));

    // add previous amount
    const { amount: previousAmount } = this.#data;
    this.#data = Object.assign(data, {
      amount: previousAmount,
    });

    // check duplicate
    this.checkDuplicateFromItem();

    this.#ui.itemContent = this.#data;
    this.#checkData();
  }

  /**
   * check is item duplicated to previous items
   * @returns {boolean}
   */
  checkDuplicateFromItem() {
    /**
     * @type {(Item | Boolean)}
     */
    const duplicatedItem = this.itemList.checkDuplicateOnList(this),
      isDuplicated = duplicatedItem instanceof Item;

    if (isDuplicated) {
      // add duplicated item's amount by this item's amount
      const { amount } = this.#data;
      duplicatedItem.increaseAmount(amount);

      // reset current item's data
      this.#resetItemData();
      this.#resetItemUI();
    } else {
      this.#data.valid = true;
    }

    return isDuplicated;
  }

  /**
   * @async
   * opens search item with current barcode as hint
   */
  async openSearchFromItem() {
    const hint = this.#data.barcode;

    // attemp to exact match before open searchItem submenu
    const exactMatch = await SearchItem.exactMatch(hint, "cashier");
    if (exactMatch) {
      this.data = { data: exactMatch, code: 21 };
    }

    // proceed to open searchItem submenu if doesnt match
    else {
      this.itemList.transaction.transactionList.cashier.childs.submenu.openSubmenu("F2", {
        itemReference: this,
        hint: hint,
        type: "cashier",
      });
    }
  }

  /**
   * @async
   * store to db as new item if #dbid is null
   * update it if has #dbid
   */
  async storeItemtoDB() {
    let itemDetail = {
      itemId: this.#data.id,
      amount: this.#data.amount,
      log: this.#itemLog.map((log) => log.log),
    };

    // if has id, update DB data
    if (this.#dbid) {
      const isDetailChanged = !deepEqual(itemDetail, this.#savedItemData);

      // update existing transactionItem in database if detail has any changes
      if (isDetailChanged) {
        await CashierInvoker.storeTransactionItem({
          transactionItemId: this.#dbid,
          data: { ...itemDetail },
        });
      }
    }

    // if doesnt has an id, store it and get the id
    else {
      // creating new transactionItem in database
      this.#dbid = await CashierInvoker.storeTransactionItem({
        transactionAllId: this.itemList.transaction.DBId,
        data: { ...itemDetail },
      });
    }

    // save new stored data
    this.#savedItemData = { ...itemDetail };
  }

  /**
   * deletes item from DB.
   * used when completed transaction item is being deleted
   * @async
   */
  async deleteItemDB() {
    // only if the data has been saved before
    if (this.#dbid) {
      let itemDetail = {
        transactionItemId: this.#dbid,
        log: this.#itemLog.map((log) => log.log),
      };

      await CashierInvoker.deleteTransactionItem(itemDetail);
    }
  }
}

class ItemUI {
  /**
   * @type {ElementContent}
   * @private
   */
  #itemContentElement;

  /**
   * containing HTML element that contains childs HTMLs
   * like barcode input element, name input element etc
   * @type {HTMLElement}
   */
  #itemElement;

  /**
   * creates childs UI input elements like barcode, name, amount etc
   * @param {Item} item - referenced item
   * @param {HTMLElement} listElement
   * @param {ItemData} data
   */
  constructor(item, listElement, data = { ...EMPTY_ITEM }) {
    /**
     * @type {Item}
     */
    this.item = item;

    /**
     * @type {HTMLElement}
     */
    this.listElement = listElement;

    this.#createElement(data);
  }

  /**
   * create item wrapper element
   * @param {ItemData} data
   */
  #createElement(data) {
    // create tr element
    this.#itemElement = document.createElement("tr");
    this.#itemElement.className = "purchases-contents";

    // get the required data
    const { name, quantity, price, amount } = data;

    // create child elements
    this.#itemContentElement = {
      actionElement: new ActionElement(this.item),
      barcodeElement: new BarcodeElement(this.item),
      nameElement: new TextElement("name-content", name),
      quantityElement: new TextElement("type-content", quantity),
      priceElement: new TextElement("price-content", set_proper_price(price)),
      amountElement: new AmountElement(this.item),
      totalPriceElement: new TextElement("total-price-content", set_proper_price(price * amount)),
    };

    // append childs to wrapper
    Object.keys(this.#itemContentElement).forEach((key) => {
      this.#itemElement.appendChild(this.#itemContentElement[key].element);
    });

    // append wrapper to list
    this.listElement.appendChild(this.#itemElement);
  }

  /**
   * remove ui from document
   */
  removeUi() {
    this.#itemElement.remove();
  }

  /**
   * @param {ItemData} newItemData
   */

  set itemContent(newItemData) {
    // get item datas and elements
    const { name, barcode, quantity, price, amount, valid } = newItemData;
    const {
      actionElement,
      barcodeElement,
      nameElement,
      quantityElement,
      priceElement,
      amountElement,
      totalPriceElement,
    } = this.#itemContentElement;

    // set action to delete if valid
    if (valid) actionElement.ableToDelete();

    // set element with datas
    barcodeElement.barcode = barcode;
    nameElement.text = name;
    quantityElement.text = quantity;
    priceElement.text = set_proper_price(price);
    amountElement.value = amount;
    totalPriceElement.text = set_proper_price(price * amount);
  }

  /**
   * @type {ElementContent}
   */
  get childElements() {
    return this.#itemContentElement;
  }
}
