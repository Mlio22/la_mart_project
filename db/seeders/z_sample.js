"use strict";

module.exports = async (db) => {
  await db.TransaksiKeseluruhan.create({
    total_harus_dibayar: 2000,
    dibayar_oleh_konsumen: 2000,
    kembalian: 0,
    total_keuntungan: 100,
  });
};

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
      queryInterface.bulkInsert("laporan_harian", [
        {
          total_pendapatan: 2000000,
          total_keuntungan: 200000,
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
