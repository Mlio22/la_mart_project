import { Item } from "./item.js";

const EMPTYSTOCKHTML = `
<div class="stock-headers">
  <div class="actions header"></div>
  <div class="codes header">Kode Barang</div>
  <div class="names header">Nama Barang</div>
  <div class="quantities header">satuan</div>
  <div class="buy-prices header">Harga Beli</div>
  <div class="sell-prices header">Harga Jual</div>
  <div class="first-stock header">Stok awal</div>
  <div class="stock-in header">Stok Masuk</div>
  <div class="stock-out header">Stok Keluar</div>
</div>`;

export class StockList {
  #stockList = [];

  constructor(stock) {
    this.stock = stock;
    this.itemsElement = this.stock.stockElement.querySelector(".stock-items");

    // set the StockUI HTML
    this.addItem();
  }

  addItem() {
    this.#stockList.push(new Item(this));
  }

  removeItem(item) {
    const index = this.#stockList.indexOf(item);

    // remove the element
    this.#stockList.splice(index, 1);

    this.checkItemList();
  }

  checkItemList() {
    const len = this.#stockList.length,
      isLastItemEmpty = this.#stockList[len - 1].empty;

    // check the last item is empty or not
    // last item must be always empty
    // if all item is not empty create new one

    if (isLastItemEmpty) {
      this.focusToLatestItem();
    } else {
      this.addItem();
    }
  }

  checkItemListFor(action, item = null) {
    if (action === "add") {
      const emptyItemIndex = this.#stockList.findIndex((item) => item.empty);

      if (emptyItemIndex) {
        this.#stockList[emptyItemIndex].focus();
      } else {
        this.addItem();
      }
    }

    if (action === "delete") {
    }
  }

  getDuplicatedItem(currentItem) {
    for (const index in this.#stockList) {
      const item = this.#stockList[index];

      if (item === currentItem) continue;
      if (item.barcode === currentItem.barcode) return item;
    }

    return false;
  }

  focusToLatestItem() {
    // todo: focus to certain item. e.g. next item, prev item, *number* item
    const len = this.#stockList.length;

    this.#stockList[len - 1].focus();
  }
}
