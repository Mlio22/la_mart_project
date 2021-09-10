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
  down: async (queryInterface, Sequelize) => {
    // delete records that using status_transaksi
    await queryInterface.bulkDelete("perubahan_status_transaksi", {});
    await queryInterface.bulkDelete("transaksi_keseluruhan", {});

    // delete status_transaksi records
    await queryInterface.bulkDelete("status_transaksi", {});
  },
};
