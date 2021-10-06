/**
 * @typedef {import ("../../submenuWrapper").SubmenuWrapper} SubmenuWrapper
 */

/**
 * @param {SubmenuWrapper} submenuWrapper
 */

export function newTransaction(submenuWrapper) {
  // create new Transaction
  submenuWrapper.window.childs.transactionList.createTransaction();
}
