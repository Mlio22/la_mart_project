/**
 * @typedef {import("../../submenuWrapper.js").SubmenuWrapper} SubmenuWrapper - SubmenuWrapper Instance
 * @typedef {import("../../transactions-helper/transaction").Transaction} Transaction - SubmenuWrapper Instance
 */

import { Submenu } from "./SubmenuPrototype.js";

/**
 * @extends {Submenu}
 */
export class OpenTransaction extends Submenu {
  /**
   * creates open tranaction submenu
   * @param {SubmenuWrapper} submenuWrapper - referenced SubmenuWrapper instance
   * @param {Object} [submenuProperties={}] - options
   */

  constructor(submenuWrapper, submenuProperties) {
    super(submenuWrapper, submenuProperties);
    this._initializeSubmenu();

    this._submenuElement.tabIndex = "0";

    /**
     * contains resultTransaction instance
     * @type {ResultTransactions}
     */
    this.result = new ResultTransactions(this);

    /**
     * contains TypeSlider instance
     * @type {TypeSlider}
     */
    this.slider = new TypeSlider(this);

    this.#listen();
  }

  #listen() {
    this._submenuElement.addEventListener("keydown", ({ key }) => {
      if (key === "Tab") {
        this._submenuElement.focus();
        this.slider.toggleSlider();
      } else if (key.includes("Arrow")) {
        this.result.arrowAction(key);
      }
    });
  }
}

/**
 * Type Slider for slide between transaction statusses: saved or completed
 */
class TypeSlider {
  /**
   * contains referenced opentransaction instance
   * @type {OpenTransaction}
   * @private
   */
  #submenu;

  /**
   * contains current type index
   * @type {Number}
   * @private
   */
  #currentTypeIndex = 0;

  /**
   * contains type slider's wrapper element
   * @type {HTMLElement}
   * @private
   */
  #typeSliderElement;

  /**
   * contains slider element
   * @type {HTMLElement}
   * @private
   */
  #sliderElement;

  /**
   * contains type childs in slider element
   * @type {Array<HTMLElement>}
   * @private
   */

  #typeChilds;
  /**
   * contains childs outset widths
   * @type {Array<Number>}
   * @private
   */
  #childOffsetWidth = [];

  /**
   * adding type slider in open transaction
   * @param {OpenTransaction} submenu - referemce OpenTransaction instance
   */
  constructor(submenu) {
    this.#submenu = submenu;

    // get submenu elements
    this.#typeSliderElement = submenu.element.querySelector(".type-slider");
    this.#sliderElement = submenu.element.querySelector(".slider");

    // gather children width
    this.#gatherChildrenWidth();

    // set slider and listen
    this.#setSlider();
    this.#listenSlider();
  }

  /**
   * toggle slider
   */
  toggleSlider() {
    // toggle slider
    const previousIndex = this.#currentTypeIndex;

    this.#currentTypeIndex = previousIndex === 0 ? 1 : 0;
    this.#setSlider();
  }

  /**
   * listen to slider element
   */
  #listenSlider() {
    // slider click
    this.#typeChilds.forEach((typeElement) => {
      typeElement.addEventListener("click", (e) => {
        const typeIndex = this.#typeChilds.findIndex((childs) => childs === e.target);

        if (this.#currentTypeIndex !== typeIndex) {
          this.#currentTypeIndex = typeIndex;
          this.#setSlider();
        }
      });
    });
  }

  /**
   * set slider according to type width
   */
  #setSlider() {
    let sliderWidth = this.#childOffsetWidth[this.#currentTypeIndex],
      sliderLeft = this.#childOffsetWidth
        .slice(0, this.#currentTypeIndex)
        .reduce((sum, currentValue, currentIndex) => sum + (currentValue + 7 * currentIndex), 0);

    // change slider pos and width
    this.#sliderElement.style.width = `${sliderWidth}px`;
    this.#sliderElement.style.left = `${sliderLeft}px`;

    // change .active owner
    this.#typeSliderElement.querySelector(".active").classList.remove("active");
    this.#typeChilds[this.#currentTypeIndex].classList.add("active");

    // change results
    this.#submenu.result.getTransactionList(this.#currentTypeIndex);
  }

  /**
   * get types width
   */
  #gatherChildrenWidth() {
    this.#typeChilds = Array.prototype.slice.call(this.#typeSliderElement.children);
    this.#childOffsetWidth = this.#typeChilds.map((child) => child.offsetWidth);
  }
}

class ResultTransactions {
  /**
   * contains referenced open transaction submenu
   * @type {Submenu}
   * @private
   */
  #submenu;

  /**
   * contains current filtered transaction according to its status
   * @type {Array<Transaction>}
   * @private
   */
  #currentFilteredTransactions = [];

  /**
   * contains opentransaction's content element
   * @type {HTMLElement}
   * @private
   */
  #openTransactionContentElement;

  /**
   * contains elements with corresponding #currentFilteredTransaction
   * @type {Array<HTMLElement>}
   * @private
   */
  #resultElements = [];

  /**
   * current #resultElements element that been focused
   * @type {Number}
   * @private
   */
  #focusIndex = 0;

  /**
   * adding results section in openTransaction
   * @param {OpenTransaction} submenu - referemce OpenTransaction instance
   */
  constructor(submenu) {
    this.#submenu = submenu;
    this.#openTransactionContentElement = submenu.element.querySelector(".content");

    this.#listenInteraction();
  }

  /**
   * @param {("ArrowUp"|"ArrowDown"|"ArrowLeft"|"ArrowRight")} arrowKey - arrow direction
   */
  arrowAction(arrowKey) {
    switch (arrowKey) {
      case "ArrowUp":
        this.focusIndex = --this.#focusIndex;
        break;

      case "ArrowDown":
        this.focusIndex = ++this.#focusIndex;
        break;

      case "ArrowLeft":
        this.#arrowCollapseOrNot("close");
        break;

      case "ArrowRight":
        this.#arrowCollapseOrNot("open");
        break;
    }
  }

  /**
   * get transaction list according to sliderIndex and show it
   * @param {(0|1)} [sliderIndex=0]
   * @private
   */
  getTransactionList(sliderIndex = 0) {
    // (sliderIndex + 2) equal as transaction's status

    /**
     * sliderIndex:
     * 2 => saved
     * 3 => completed
     */

    const transactionStatus = sliderIndex + 2,
      filteredTransactions =
        this.#submenu.window.childs.transactionList.retrieveTransactionList(transactionStatus);

    this.#currentFilteredTransactions = filteredTransactions;

    this.#showResults();
  }

  /**
   * creates results element and show it
   */
  #showResults() {
    // reset the HTML of content
    this.#openTransactionContentElement.innerHTML = `
    <div class="content-header">
      <div class="id">ID</div>
      <div class="item-bar">Jumlah Item</div>
      <div class="time">Waktu</div>
    </div>
    `;

    // create the result elements
    this.#createResultElements();

    // listen on each result elements
    this.#listenInteraction();

    // bug fix: set a delay before focusing element
    setTimeout(() => {
      // initial focus index
      if (this.#resultElements.length > 0) {
        this.focusIndex = 0;
      }
    }, 50);
  }

  /**
   * create elements of result from #currentFilteredTransactions
   * @private
   */
  #createResultElements() {
    // refresh the results element
    this.#resultElements = [];

    this.#resultElements = this.#currentFilteredTransactions.map(({ transactionInfo }) => {
      const { localId, DBId, itemList, startTime } = transactionInfo;

      const contentItem = document.createElement("div");
      contentItem.className = "content-item";
      contentItem.tabIndex = "0";

      const items = itemList.items;
      contentItem.innerHTML = `
      <div class="id">
        <div class="id">Local: #${localId}</div>
        <div class="id">Saved: #${DBId}</div>
      </div>
      <div class="item-bar">
          <div class="collapse-button-wrapper"><div class="collapse-button"></div></div>
          <div class="item-count">${items.length} Item</div>
          <div class="item-list">${items
            .map((item) => {
              return `<div class="item-list-child">- ${item.data.name} (${item.data.amount})</div>`;
            })
            .join("")}</div>
      </div>
      <div class="time">${startTime.getHours()}:${startTime.getMinutes()}</div>`;
      this.#openTransactionContentElement.appendChild(contentItem);

      return { itemsElement: contentItem, collapsed: false };
    });
  }

  /**
   * set listeners to results elements
   * @private
   */
  #listenInteraction() {
    this.#resultElements.forEach(({ itemsElement: resultElement }) => {
      const itemBar = resultElement.querySelector(".item-bar");

      //* item list toggle collapse (mouse - single click)
      const collapseButtonWrapper = itemBar.querySelector(".collapse-button-wrapper");
      collapseButtonWrapper.addEventListener("click", () => {
        this.#arrowCollapseOrNot("toggle", resultElement);
      });

      //* result selection (mouse - double click)
      let beforeTimeoutDouble = false;
      resultElement.addEventListener("click", (e) => {
        this.focusIndex = this.#resultElements.findIndex(
          ({ itemsElement }) => itemsElement === resultElement
        );

        if (
          e.target !== collapseButtonWrapper &&
          e.target !== collapseButtonWrapper.querySelector(".collapse-button")
        ) {
          if (beforeTimeoutDouble) {
            // select item
            this.#selectTransactionAndClose();
          } else {
            beforeTimeoutDouble = true;

            // set timeout
            setTimeout(() => {
              beforeTimeoutDouble = false;
            }, 200);
          }
        }
      });

      // result selection (keydown - enter)
      resultElement.addEventListener("keydown", ({ key }) => {
        if (key === "Enter") {
          // select item
          this.#selectTransactionAndClose();
        }
      });
    });
  }

  /**
   * select transaction to load/restore and close submenu
   * @private
   */
  #selectTransactionAndClose() {
    // item selected;
    this.#submenu.window.childs.transactionList.loadTransaction(
      this.#currentFilteredTransactions[this.#focusIndex].transactionInfo.localId
    );

    this.#submenu.window.childs.submenu.hideSubmenu();
  }

  /**
   * collapses or un-collapses or toggle a itemElement
   * @param {("closes" | "open" | "toggle")} collapseStatus
   * @param {HTMLElement} itemsElement
   */
  #arrowCollapseOrNot(
    collapseStatus = "close",
    itemsElement = this.#resultElements[this.#focusIndex].itemsElement
  ) {
    /**
     * collapseStatus parameter values:
     * "close": about to close the collapse
     * "open": about to open the collapse
     * "toggle": toggle the collapse
     */

    const itemBar = itemsElement.querySelector(".item-bar"),
      isCollapsed = itemBar.classList.contains("active");

    if (isCollapsed === true && collapseStatus === "close") {
      itemBar.classList.remove("active");
    }

    if (isCollapsed === false && collapseStatus === "open") {
      itemBar.classList.add("active");
    }

    if (collapseStatus === "toggle") {
      itemBar.classList.toggle("active");
    }
  }

  /**
   * set focus index
   * @param {Number} focusIndex -
   */
  set focusIndex(focusIndex) {
    this.#focusIndex = focusIndex;

    // resets #focusIndex if reaches last #resultElements
    if (this.#focusIndex > this.#resultElements.length - 1) {
      this.#focusIndex = 0;
    } else if (this.#focusIndex < 0) {
      this.#focusIndex = this.#resultElements.length - 1;
    }

    // focus to its itemElement
    this.#resultElements[this.#focusIndex].itemsElement.focus();
  }
}
