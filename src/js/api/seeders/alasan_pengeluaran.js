"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("alasan_pengeluaran", [
      { deskripsi_alasan_pengeluaran: "Pengeluaran Stok" },
      { deskripsi_alasan_pengeluaran: "Transaksi Kasir" },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("alasan_pengeluaran", {});
  },
};
