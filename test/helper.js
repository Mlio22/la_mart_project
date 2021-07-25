const expect = require("chai").expect;

// sleep (waiting)
const sleep = async (time) => {
  return new Promise((r) => setTimeout(r, time));
};

async function refreshElementGetters(app) {
  const actionButtons = await app.client.$$(".cashier .action-content button"),
    barcodeInputs = await app.client.$$(".cashier .barcode-content input"),
    names = await app.client.$$(".cashier .name-content"),
    quantities = await app.client.$$(".cashier .type-content"),
    prices = await app.client.$$(".cashier .price-content"),
    amountInputs = await app.client.$$(".cashier .amount-content input"),
    totalPrices = await app.client.$$(".cashier .total-price-content");

  return [actionButtons, barcodeInputs, names, quantities, prices, amountInputs, totalPrices];
}

const addItemDirectly = async (app, barcode) => {
  // add item directly. the barcode must be precise, or it'll open searchItem
  const [_, barcodeInputs, ...etc] = await refreshElementGetters(app);

  // add the barcode to latest item
  await barcodeInputs[barcodeInputs.length - 1].setValue(barcode);
  await barcodeInputs[barcodeInputs.length - 1].keys("\uE007"); // enter
  await sleep(75);
};

const addItemThroughSearchItem = async (app, starterBarcode, searchItemIndex = 0) => {
  // add item through searchItem. must be not precise, otherwise it'll set directly and searchItem won't open
  const [_, barcodeInputs, ...etc] = await refreshElementGetters(app);

  // add the starter barcode to latest item
  await barcodeInputs[barcodeInputs.length - 1].setValue(starterBarcode);
  await barcodeInputs[barcodeInputs.length - 1].keys("\uE007"); // enter

  searchItemElement = await app.client.$(".cashier .submenu .search-item");
  expect(await searchItemElement.isDisplayed()).to.be.true;

  // select item on searchItem
  for (i = 0; i < searchItemIndex; i++) {
    await searchItemElement.keys("\ue015"); // down arrow
  }

  await searchItemElement.keys("\uE007"); // enter
};

const expectItemValues = async (app, itemIndex, a_itemValues) => {
  // check item values
  const itemValues = await refreshElementGetters(app);

  const [actionButtons, barcodeInputs, names, quantities, prices, amountInputs, totalPrices] = itemValues;
  const [a_action, a_barcode, a_name, a_price, a_quantity, a_amount, a_totalPrice] = a_itemValues;

  const actionButtonStatus = await actionButtons[itemIndex].getAttribute("disabled"),
    barcodeInput = await barcodeInputs[itemIndex].getValue(),
    name = await names[itemIndex].getText(),
    price = await prices[itemIndex].getText(),
    quantity = await quantities[itemIndex].getText(),
    amountInput = await amountInputs[itemIndex].getValue(),
    totalPrice = await totalPrices[itemIndex].getText();

  // expecting
  expect(actionButtonStatus).to.be.equal(a_action);
  expect(barcodeInput).to.be.string(a_barcode);
  expect(name).to.be.string(a_name);
  expect(price).to.be.string(a_price);
  expect(quantity).to.be.string(a_quantity);
  expect(amountInput).to.be.string(a_amount);
  expect(totalPrice).to.be.string(a_totalPrice);
};

const expectSummaryPriceValue = async (app, a_summaryPriceValue) => {
  // expect the summary price below the cashier page
  const summaryPriceElement = await app.client.$(".cashier .total-price .total-price-content"),
    summaryPriceValue = await summaryPriceElement.getText();

  expect(summaryPriceValue).to.be.equal(`Rp. ${a_summaryPriceValue}`);
};

const expectItemCount = async (app, a_count) => {
  const items = await app.client.$$(".cashier tr.purchases-contents");

  expect(items.length).to.be.equal(a_count);
};

const deleteItemByIndex = async (app, itemIndex = 0) => {
  const [actionButtons, ..._] = await refreshElementGetters(app);

  const itemActionButton = actionButtons[itemIndex];
  await itemActionButton.click();
};

module.exports = {
  sleep,
  refreshElementGetters,
  addItemDirectly,
  addItemThroughSearchItem,
  expectItemCount,
  expectItemValues,
  expectSummaryPriceValue,
  deleteItemByIndex,
};
