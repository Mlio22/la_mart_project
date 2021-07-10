export function newTransaction(submenuWrapper) {
  // create new Transaction
  submenuWrapper.cashier.childs.transactions.createTransaction();

  // hide the paymentDetails
  submenuWrapper.cashier.childs.paymentDetails.clearPayment();
}
