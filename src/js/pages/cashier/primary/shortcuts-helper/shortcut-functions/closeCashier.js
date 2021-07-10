const { ipcRenderer } = require("electron");

export function closeCashier() {
  // send signal to IPC main
  ipcRenderer.send("close-cashier");
}
