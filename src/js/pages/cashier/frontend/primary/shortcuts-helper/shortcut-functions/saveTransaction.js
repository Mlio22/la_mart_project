/**
 * @typedef {import ("../../submenuWrapper").SubmenuWrapper} SubmenuWrapper
 */

/**
 * @param {SubmenuWrapper} submenu
 */
export function saveTransaction(submenu) {
  submenu.window.childs.transactionList.saveCurrentTransaction();
}
