"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transaksi_barang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_barang: {
        type: Sequelize.INTEGER,
        references: { model: "detail_barang", key: "id" },
        allowNull: true,
      },
      id_transaksi_keseluruhan: {
        type: Sequelize.INTEGER,
        references: { model: "transaksi_keseluruhan", key: "id" },
        allowNull: false,
      },
      jumlah: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      isDisrupted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      completedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("edit_transaksi_barang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_transaksi_barang: {
        type: Sequelize.INTEGER,
        references: { model: "transaksi_barang", key: "id" },
        allowNull: false,
      },
      content_before: {
        type: Sequelize.JSON,
      },
      content_after: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("edit_transaksi_barang");
    await queryInterface.dropTable("perubahan_status_transaksi_barang");
    await queryInterface.dropTable("transaksi_barang");
    await queryInterface.dropTable("status_transaksi_barang");
  },
};
