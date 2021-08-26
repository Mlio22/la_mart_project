"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("laporan_harian", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      total_pendapatan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_keuntungan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tanggal: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("laporan_harian");
  },
};
