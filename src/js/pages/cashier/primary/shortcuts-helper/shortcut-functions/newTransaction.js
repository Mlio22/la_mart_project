export function newTransaction(submenuWrapper) {
  // create new Transaction
  submenuWrapper.cashier.childs.tramsactionList.createTransaction();

  // hide the paymentDetails
  submenuWrapper.cashier.childs.paymentDetails.clearPayment();
}
