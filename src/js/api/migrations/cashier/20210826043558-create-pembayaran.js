"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("pembayaran", {
      id_transaksi_keseluruhan: {
        type: Sequelize.INTEGER,
        references: { model: "transaksi_keseluruhan", key: "id" },
        unique: true,
      },
      total_harus_dibayar: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dibayar_oleh_konsumen: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kembalian: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_keuntungan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("pembayaran");
  },
};
