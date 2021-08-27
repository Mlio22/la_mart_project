"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransaksiBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TransaksiBarang.init(
    {
      id_barang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_transaksi_keseluruhan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      keuntungan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "TransaksiBarang",
      tableName: "transaksi_barang",
    }
  );
  return TransaksiBarang;
};
