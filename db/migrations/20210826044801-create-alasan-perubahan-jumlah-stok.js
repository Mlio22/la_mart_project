"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("alasan_perubahan_jumlah_stok", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deskripsi_alasan_perubahan_stok: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("alasan_perubahan_jumlah_stok");
  },
};
