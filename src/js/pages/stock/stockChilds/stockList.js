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
    console.log(this.#stockList);
  }

  checkUniqueItem(currentItem, newBarcode) {
    for (const index in this.#stockList) {
      const item = this.#stockList[index];

      if (item === currentItem) continue;
      if (item.barcode === newBarcode) return item;
    }

    return false;
  }

  removeItem(item) {
    const index = this.#stockList.indexOf(item);

    // remove the element
    this.#stockList.splice(index, 1);

    // latest for latest element
    this.focusToLatestItem();
  }

  focusToLatestItem() {
    const len = this.#stockList.length;

    this.#stockList[len - 1].focus();
  }
}
