export function newTransaction(submenuWrapper) {
  // create new Transaction
  submenuWrapper.cashier.childs.transactionList.createTransaction();

  // hide the paymentDetails
  submenuWrapper.cashier.childs.paymentDetails.clearPayment();
}
