"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("status_transaksi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deskripsi_status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });

    await queryInterface.createTable("transaksi_keseluruhan", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_status_transaksi: {
        type: Sequelize.INTEGER,
        references: { model: "status_transaksi", key: "id" },
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      completedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("perubahan_status_transaksi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_transaksi_keseluruhan: {
        type: Sequelize.INTEGER,
        references: { model: "transaksi_keseluruhan", key: "id" },
        allowNull: false,
      },
      id_status_transaksi_before: {
        type: Sequelize.INTEGER,
        references: { model: "status_transaksi", key: "id" },
        allowNull: false,
      },
      id_status_transaksi_after: {
        type: Sequelize.INTEGER,
        references: { model: "status_transaksi", key: "id" },
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
    await queryInterface.dropTable("perubahan_status_transaksi");
    await queryInterface.dropTable("transaksi_keseluruhan");
    await queryInterface.dropTable("status_transaksi");
  },
};
