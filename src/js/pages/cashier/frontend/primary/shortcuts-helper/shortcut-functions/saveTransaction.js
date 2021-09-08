export function saveTransaction(submenu) {
  submenu.cashier.childs.transactionList.saveCurrentTransaction({ createNewTransaction: true });
}
