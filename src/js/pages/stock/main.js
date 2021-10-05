import { StockList } from "./stockChilds/stockList.js";
import { SubmenuWrapper } from "../cashier/primary/submenuWrapper.js";
import { Notification } from "./stockChilds/notification.js";
import { SaveStock } from "./stockChilds/saveStock.js";

export class StockPage {
  constructor(stockElement) {
    this.stockElement = stockElement;
    this.stockChild = {};

    // chidls: submenu, notification, stock and save stock
    this.stockChild.submenu = new SubmenuWrapper(this);
    // this.#stockChild.notification = new Notification(this);
    this.stockChild.stockList = new StockList(this);
    this.stockChild.saveStock = new SaveStock(this);
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
