"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("alasan_perubahan_stok", [
      { deskripsi_alasan_perubahan_stok: "Admin" },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("alasan_perubahan_stok", 1, {});
  },
};
