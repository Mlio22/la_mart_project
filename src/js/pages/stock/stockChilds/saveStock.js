export class SaveStock {
  #saveButton;
  constructor(stock) {
    this.stock = stock;
    this.#saveButton = this.stock.element.querySelector(".save-stock");

    this.listenButton();
  }

  listenButton() {
    this.#saveButton.addEventListener("click", () => {
      this.stock.stockChild.stockList.clearstock();
    });
  }
}
