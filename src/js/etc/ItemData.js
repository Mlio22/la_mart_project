/**
 * @typedef ItemDataDetails
 * @property {Number} id - item's registered id from DB
 * @property {String} name - item's name
 * @property {String} barcode - item's barcode
 * @property {String} quantity - item's quantity type
 * @property {?Number} [priceBuy] - item's buy price, only available for stock ItemDatas
 * @property {Number} priceSell - item's sell price
 */

class ItemDataInformation {
  /**
   * contains item data details like id, name, barcode, prices, etc
   * @private
   * @type {ItemDataDetails}
   */

  #dataDetails = {
    id: null,
    name: null,
    barcode: null,
    quantity: null,
    priceBuy: null,
    priceSell: null,
  };

  constructor(type, { id, name, barcode, quantity, priceBuy = null, priceSell }) {
    this.#dataDetails = { id, name, barcode, quantity, priceSell };

    if (type == "stock") {
      this.#dataDetails.priceBuy = priceBuy;
    }
  }

  get id() {
    return this.#dataDetails.id;
  }

  get name() {
    return this.#dataDetails.name;
  }

  get barcode() {
    return this.#dataDetails.barcode;
  }

  get quantity() {
    return this.#dataDetails.quantity;
  }

  get priceBuy() {
    return this.#dataDetails.priceBuy;
  }

  get priceSell() {
    return this.#dataDetails.priceSell;
  }

  get price() {
    // get normal price (sell price)
    return this.#dataDetails.priceSell;
  }
}

class EmptyItemInformation extends ItemDataInformation {
  constructor() {
    super("cashier", {
      id: null,
      barcode: "",
      name: "",
      quantity: "",
      priceSell: "",
    });
  }
}

export { ItemDataInformation, EmptyItemInformation };
