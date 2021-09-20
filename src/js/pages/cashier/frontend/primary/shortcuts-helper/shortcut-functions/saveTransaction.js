export function saveTransaction(submenu) {
  submenu.window.childs.transactionList.saveCurrentTransaction({ createNewTransaction: true });
}
