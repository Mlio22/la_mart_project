"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("status_transaksi", [
      { deskripsi_status: "Sedang Berjalan" },
      { deskripsi_status: "Disimpan" },
      { deskripsi_status: "Selesai" },
      { deskripsi_status: "Dibatalkan" },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("status_transaksi", 1, {});
  },
};
