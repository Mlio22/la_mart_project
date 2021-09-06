"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("detail_barang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      barcode_barang: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama_barang: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      satuan_barang: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      harga_beli: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      harga_jual: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("detail_barang");
  },
};
