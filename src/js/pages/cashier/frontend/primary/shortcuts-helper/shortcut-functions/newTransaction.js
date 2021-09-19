export function newTransaction(submenuWrapper) {
  console.log(submenuWrapper);
  // create new Transaction
  submenuWrapper.window.childs.transactionList.createTransaction();
}
