import { StockList } from "./stockChilds/stockList.js";
import { SubmenuWrapper } from "../cashier/primary/submenuWrapper.js";
import { Notification } from "./stockChilds/notification.js";

class StockPage {
  constructor(stockElement) {
    this.stockElement = stockElement;
    this.stockChild = {};

    // chidls: submenu, notification, and stock
    this.stockChild.submenu = new SubmenuWrapper(this);
    // this.#stockChild.notification = new Notification(this);
    this.stockChild.stockList = new StockList(this);
  }

  get element() {
    return this.stockElement;
  }

  get name() {
    return "stock";
  }
}

const stockElement = document.querySelector("body .stock");
new StockPage(stockElement);
