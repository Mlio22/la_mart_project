/**
 * @typedef {['name'] | ['barcode']} FilterParams
 * @typedef {("cashier" | "stock")} WindowType
 * @typedef {import ("../../transactions-helper/item").ItemData} ItemData
 * @typedef {import("../../submenuWrapper").SubmenuWrapper} SubmenuWrapper
 * @typedef {import("../../transactions-helper/item").Item} Item
 */

import { CashierInvoker } from "../../../dbInvoker.js";
import { Submenu } from "./SubmenuPrototype.js";
import { set_proper_price, isChildOf } from "../../../../../../etc/others.mjs";

// todo: output pada search item adalah Promise

/**
 * @async
 * todo: perbaiki parameter fungsi ini
 * search item based from hint and params
 * @param {Object} itemSearchParam
 * @param {WindowType} [itemSearchParam.type="cashier"] - window that searchItem in
 * @param {Array<Object>} [itemSearchParam.initialFilteredItems = []] - list of filtered items data before
 *
 * @param {Object} itemSearchParam.detail
 * @param {string} [itemSearchParam.detail.hint=""]
 * @param {} [itemSearchParam.detail.params=['name', 'barcode']] - filtering parameters
 * @param {Boolean} [itemSearchParam.detail.full_match = false] - must exactly match with hint?
 *
 * @returns {Promise<Array<Object>>} list of new filtered items
 */
async function item_searcher({
  type = "cashier",
  initialFilteredItems = [],
  detail: { hint = "", params = ["name", "barcode"], full_match = false },
}) {
  // return none if hint is none
  if (hint === "") return [];

  // search first from DB if initialFilteredItem is none
  if (initialFilteredItems.length === 0) {
    if (type === "cashier") {
      initialFilteredItems = await CashierInvoker.searchItemDB({ hint, params, full_match });
    } else {
      initialFilteredItems = await CashierInvoker.searchItemDB({ hint, params, full_match });
    }
  }

  const matchedItems = [];

  // set the hint to lowercase
  hint = hint.toLowerCase();

  initialFilteredItems.forEach((item) => {
    let isMatch = false;

    // if anyone of the parameter is match then return the item
    params.forEach((param) => {
      let currentMatch;
      if (full_match) {
        currentMatch = item[param].toLowerCase() === hint;
      } else {
        currentMatch = item[param].toLowerCase().includes(hint);
      }

      isMatch = isMatch || currentMatch;
    });

    if (isMatch) matchedItems.push(item);
  });

  return matchedItems;
}

/**
 * @extends {Submenu}
 */
export class SearchItem extends Submenu {
  /**
   * contains filtered items data
   * @type {Array<ItemData>}
   * @private
   */
  #filteredItems = [];

  /**
   * contains selected item itemData
   * @type {ItemData}
   * @private
   */
  #selectedItem = null;

  /**
   * contains referenced Item instance
   * @type {Item}
   * @private
   */
  #itemReference;

  /**
   * contains hint
   * @type {String}
   * @private
   */
  #hint;

  /**
   * contains window type that is opened this SearchItem
   * @type {String}
   * @private
   */
  #type;

  /**
   * contains searchItemHeader instance
   * @type {SearchItemHeader}
   * @private
   */
  #searchItemHeader;

  /**
   * contains searchItemResult instance
   * @type {SearchItemResults}
   * @private
   */
  #searchItemResult;

  /**
   * contains list of result that have searched before (since this searchItem opened)
   * @type {Array<ItemData>}
   * @private
   */
  // todo: set this to static to not oversearch DB even more
  #filteredListBuffer = [];

  /**
   * @param {SubmenuWrapper} submenuWrapper
   * @param {Object} submenuProperties - options
   * @param {Object} [params={}]
   *
   * @param {Item} [params.itemReference]
   * @param {string} [params.hint=""]
   * @param {WindowType} [params.type="cashier"]
   */
  constructor(submenuWrapper, submenuProperties, params = {}) {
    super(submenuWrapper, submenuProperties);

    // extraction from params
    this.#itemReference = params.itemReference ?? null;
    this.#hint = params.hint ?? "";
    this.#type = params.type ?? "cashier";

    this.#init();
  }

  /**
   * create element for search-item
   * @override
   */
  _createSubmenu() {
    this._submenuElement = document.createElement("div");
    this._submenuElement.className = "search-item";

    // append header and result list element
    this._submenuElement.append(this.#searchItemHeader.element, this.#searchItemResult.element);

    this._submenuWrapper.appendChild(this._submenuElement);

    this.#searchItemHeader.focusToHint();
  }

  /** @override */
  _setSubmenu() {}

  /** @override */
  _setListener() {
    // listen when keyboard input
    this._submenuElement.addEventListener("keydown", (e) => {
      const key = e.key;

      // arrow up / down to change item selection
      if (key === "ArrowUp" || key === "ArrowDown") {
        this.#searchItemResult.focusToResultItem(key === "ArrowDown" ? "next" : "previous");
      }

      // enter to select item to list
      else if (key === "Enter") {
        this.#searchItemResult.selectFilteredItem();
      }

      // other to edit text in input
      else {
        this.#searchItemHeader.focusToHint();
      }
    });
  }

  /**
   * initializes child instances
   * @async
   * @private
   */
  async #init() {
    // set child UI and classes
    this.#searchItemHeader = new SearchItemHeader(this, this.#hint);
    this.#searchItemResult = new SearchItemResults(this, this.#type);

    // set the html
    this._initializeSubmenu();

    // search the item if hint is not empty string
    if (this.#hint !== "") {
      await this.#searchItemMatchBoth();
    }
  }

  /**
   * search item with match both barcode or name (not exact)
   * @private
   */
  async #searchItemMatchBoth() {
    let matchedItemsWithBoth;

    // check from buffer
    if (this.#filteredListBuffer[this.#hint]) {
      matchedItemsWithBoth = this.#filteredListBuffer[this.#hint];
    } else {
      // else: search it
      matchedItemsWithBoth = await item_searcher({
        type: this.#type,
        initialFilteredItems: this.#filteredItems,
        detail: {
          hint: this.#hint,
          full_match: false,
        },
      });

      // add filtereditems into buffer
      this.#filteredListBuffer[this.#hint] = matchedItemsWithBoth;
    }

    // set the results
    this.#filteredItems = matchedItemsWithBoth;
    this.#searchItemResult.setMatches(matchedItemsWithBoth);
  }

  /**
   * add selected item data to referenced item
   * @private
   */
  #addToSelectedItemToItemList() {
    this.#selectedItem.valid = true;
    if (this.#itemReference !== null) {
      // if itemReference params exists,
      // change that reference's item using item's method
      this.#itemReference.data = {
        data: this.#selectedItem,
        code: 20,
      };
    } else {
      // if itemReference doesn't exist (e.g. search-item accessed from shortcut)
      // create new item data on itemList
      this._submenu.window.childs.transactionList.currentTransaction.itemList.createNewItem(
        this.#selectedItem,
        {
          isFromShortcut: true,
        }
      );
    }
  }

  /**
   * stock window use.
   * add selected itemData to reference item from stock window
   * @private
   */
  #addToStockItemList() {
    if (this.#itemReference !== null) {
      if (this.#selectedItem !== null) {
        this.#itemReference.knownItem(this.#selectedItem);
      } else {
        this.#itemReference.unknownItem();
      }
    }
  }

  /**
   * fix focus e.g. keep focusing to hint if SearchItem is still open
   * @param {HTMLElement} target - new focused element
   */
  fixFocus(target) {
    // check if focused element is child of SearchItem element
    // force focus to hint if not child of searchitem

    if (!isChildOf(this.element, target)) {
      this.focusToHint();
    }
  }

  /**
   * focus to hint element
   */
  focusToHint() {
    this.#searchItemHeader.focusToHint();
  }

  /**
   * sets hint
   * @param {String} hint
   */
  set hint(hint) {
    // get the previous hint and compare with the new hint
    // if the new hint is the same previous hint plus one character
    // prevent oversearch the API and let to research with the last filteredItem
    this.#hint = hint;

    this.#searchItemMatchBoth();
  }

  /**
   * set the selected item and automatically add to current ItemList
   * @param {ItemData} selectedItem -
   */
  set selectedItem(selectedItem) {
    this.#selectedItem = selectedItem;

    if (this._submenu.window.name === "cashier") {
      this.#addToSelectedItemToItemList();
    } else {
      if (this._submenu.window.name === "stock") {
        this.#addToStockItemList();
      }
    }

    // when item is selected, close the search-item
    this._submenu.hideSubmenu();
  }

  /**
   * match hint with barcode in DB exactly
   * @async
   * @param {string} hint
   * @param {WindowType} windowType
   * @returns {Promise<boolean>}
   */
  static async exactMatch(hint, windowType) {
    // return itemData if hint matches exactly with a barcode on DB
    // return false if not match exact

    const matchExactBarcode = await item_searcher({
      type: windowType,
      detail: { hint: hint, params: ["barcode"], full_match: true },
    });

    const isMatchExact = matchExactBarcode.length === 1;

    if (isMatchExact) {
      const matchExact = matchExactBarcode[0];
      return matchExact;
    }

    return false;
  }

  /**
   * match partially hint with barcode or name in DB
   * @param {string} hint
   * @param {WindowType} windowType
   * @returns {boolean}
   */
  static async anyMatch(hint, type) {
    // return true if hint matches any barcode or name on DB (doesnt match exact with any barcode)
    // return false if hint doesn't match any barcode or name

    const matchAny = await item_searcher({
        type: type,
        detail: { hint: hint, full_match: false },
      }),
      isMatchAny = matchAny.length > 0;

    return isMatchAny;
  }
}

class SearchItemHeader {
  /**
   * contains referenced search item instance
   * @type {SearchItem}
   * @private
   */
  #searchItem;

  /**
   * contains current hint
   * @type {String}
   * @private
   */
  #hint;

  /**
   * contains header element
   * @type {HTMLElement}
   * @private
   */
  #headerElement;

  /**
   * contains hint input element
   * @type {HTMLElement}
   * @private
   */
  #hintElement;

  /**
   * creates searchItem header
   * @param {SearchItem} searchItem
   * @param {string} hint
   */
  constructor(searchItem, hint) {
    this.#searchItem = searchItem;
    this.#hint = hint;

    this.#createSearchItemHeaderElement();
    this.focusToHint();
    this.#listenHint();
  }

  /**
   * creates searchitem header element
   * @private
   */
  #createSearchItemHeaderElement() {
    this.#headerElement = document.createElement("div");
    this.#headerElement.className = "search-item-header";
    this.#headerElement.innerHTML = '<p class="keyword-text">Kata Kunci:</p>';

    this.#createSearchItemHintElement();
  }

  /**
   * creates searchItem hint input element
   * @private
   */
  #createSearchItemHintElement() {
    this.#hintElement = document.createElement("input");
    this.#hintElement.className = "keywordInput";
    this.#hintElement.type = "text";
    this.#hintElement.value = this.#hint;

    this.#headerElement.appendChild(this.#hintElement);
  }

  /**
   * listen to hint input
   * @private
   */
  #listenHint() {
    this.#hintElement.addEventListener("input", (e) => {
      this.#searchItem.hint = e.target.value;
    });
  }

  /**
   * @returns {HTMLElement}
   */
  get element() {
    return this.#headerElement;
  }

  /**
   * focus to hint element
   */
  focusToHint() {
    this.#hintElement.focus();
  }
}

/**
 * @typedef resultContent
 * @type {Object}
 * @property {String} html - contains html string that will be result's element innerHTML
 * @property {Function} setFunction - function for fetching matched items data and create result item element from it
 *
 * @typedef result
 * @type {?resultContent}
 */
const SEARCH_ITEM_RESULTS = {
  cashier: {
    html: `
        <div class="search-item-result-header">
          <p class="item-barcode">Kode Barang</p>
          <p class="item-name">Nama Barang</p>
          <p class="item-type">Satuan</p>
          <p class="item-price">Harga</p>
        </div>`,
    setFunction: function (item) {
      const { barcode, name, quantity, price } = item;

      const resultElement = document.createElement("div");
      resultElement.tabIndex = "-1";
      resultElement.className = "search-item-result-content";

      resultElement.innerHTML = `
      <p class="item-barcode">${barcode}</p>
      <p class="item-name">${name}</p>
      <p class="item-type">${quantity}</p>
      <p class="item-price">${set_proper_price(price)}</p>
    `;

      return resultElement;
    },
  },
  stock: {
    html: `
        <div class="search-item-result-header">
          <p class="item-barcode">Kode Barang</p>
          <p class="item-name">Nama Barang</p>
          <p class="item-type">Satuan</p>
          <p class="item-price">Harga Masuk</p>
          <p class="item-price">Harga Jual</p>
          <p class="item-type">Stock</p>
        </div>`,
    setFunction: function (item) {
      const { barcode, name, quantity, buyPrice, sellPrice, stock } = item;

      const resultElement = document.createElement("div");
      resultElement.tabIndex = "-1";
      resultElement.className = "search-item-result-content";

      resultElement.innerHTML = `
      <p class="item-barcode">${barcode}</p>
      <p class="item-name">${name}</p>
      <p class="item-type">${quantity}</p>
      <p class="item-price">${buyPrice}</p>
      <p class="item-price">${sellPrice}</p>
      <p class="item-type">${stock}</p>
    `;

      return resultElement;
    },
  },
};

class SearchItemResults {
  /**
   * contains referenced SearchItem Instance
   * @type {SearchItem}
   * @private
   */
  #searchItem;

  /**
   * contains this result's element
   * @type {HTMLElement}
   * @private
   */
  #resultsElement;

  /**
   * contains matched (filtered) items
   * @type {Array<ItemData>}
   * @private
   */
  #matchedItemList = [];

  /**
   * contains matched items elemeent
   * @type {Array<HTMLElement>}
   * @private
   */
  #matchedItemElements = [];

  /**
   * focused matched item element index
   * @type {Number}
   * @private
   */
  #focusedItemIndex = null;

  /**
   * contains result html and function
   * @type {result}
   */
  #resultHtmlAndFunction;

  /**
   * creates search item result
   * @param {SearchItem} searchItem
   * @param {WindowType} windowType
   */
  constructor(searchItem, windowType) {
    this.#searchItem = searchItem;
    this.#resultHtmlAndFunction = SEARCH_ITEM_RESULTS[windowType];

    this.#createSearchItemResultsElement();
  }

  /**
   * set result matches list
   * @param {Array<ItemData>} matchedList
   */
  setMatches(matchedList = []) {
    this.#matchedItemList = matchedList;
    this.#setResultsElements();
  }

  /**
   * focus to next / preious result element
   * @param {("next" | "previous")} position
   */
  focusToResultItem(position = "next") {
    // position: next/previous
    if (position === "next" && this.#focusedItemIndex < this.#matchedItemElements.length - 1) {
      this.#focusedItemIndex += 1;
    } else if (position === "previous" && this.#focusedItemIndex > 0) {
      this.#focusedItemIndex -= 1;
    }

    this.#focusToResultItemWithIndex();
  }

  /**
   * select current focused result item
   */
  selectFilteredItem() {
    // index will be the index from click listener @#setResultsElement
    // or be

    // select only if any item in matched
    if (this.#matchedItemElements.length > 0 && this.#focusedItemIndex !== null) {
      this.#searchItem.selectedItem = {
        ...this.#matchedItemList[this.#focusedItemIndex],
      };
    }
  }

  /**
   * creates searchItemResults element
   * @private
   */
  #createSearchItemResultsElement() {
    this.#resultsElement = document.createElement("div");
    this.#resultsElement.className = "search-item-results";

    this.#resetResultsElements();
  }

  /**
   * resets results elements and its elements
   * @private
   */
  #resetResultsElements() {
    // resets result innerHTML
    this.#resultsElement.innerHTML = this.#resultHtmlAndFunction.html;

    // resets matched item elements
    this.#matchedItemElements = [];
  }

  /**
   * sets new result
   * @private
   */
  #setResultsElements() {
    // resets previous result
    this.#resetResultsElements();

    // creates matched item elements
    this.#matchedItemList.forEach((matchedItem) => {
      const resultElement = this.#resultHtmlAndFunction.setFunction(matchedItem);

      // set listener to result item
      // when onclick, it'll be selected item from the list
      resultElement.addEventListener("click", () => {
        this.#focusedItemIndex = this.#matchedItemElements.indexOf(resultElement);
        this.selectFilteredItem();
      });

      this.#resultsElement.appendChild(resultElement);
      this.#matchedItemElements.push(resultElement);
    });

    // focus to first child of result element
    this.#focusedItemIndex = 0;

    // focus to resultitem if any resultitem element available
    // else let focus to hint as it be
    if (this.#matchedItemList.length > 0) {
      this.#focusToResultItemWithIndex();
    }
  }

  /**
   * focus to selected matched item element
   * @private
   */
  #focusToResultItemWithIndex() {
    const focusedElement = this.#matchedItemElements[this.#focusedItemIndex];

    if (focusedElement) focusedElement.focus();
  }

  /**
   * returns results element
   * @type {HTMLElement}
   */
  get element() {
    return this.#resultsElement;
  }
}
