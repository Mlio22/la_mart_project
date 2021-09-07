"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert("transaksi_keseluruhan", [
        {
          total_harus_dibayar: 2000,
          dibayar_oleh_konsumen: 2000,
          kembalian: 0,
          total_keuntungan: 100,
        },
      ]),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete("transaksi_keseluruhan", 1, {}),
      queryInterface.bulkDelete("laporan_harian", 1, {}),
    ]);
  },
};
