import { StockList } from "./stockChilds/stockList.js";
import { Notification } from "./stockChilds/notification.js";

class StockPage {
  constructor(stockElement) {
    this.stockElement = stockElement;
    this.stockChild = {};

    // chidls: submenu, notification, and stock
    // this.#stockChild.subemnu = new Submenu(this);
    // this.#stockChild.notification = new Notification(this);
    this.stockChild.stockList = new StockList(this);
  }
}

const stockElement = document.querySelector("body .stock");
new StockPage(stockElement);
