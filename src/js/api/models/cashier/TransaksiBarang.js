"use strict";
const sequelize = require("../../helpers/sequelize");
const { DataTypes, Model } = require("sequelize");
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
      allowNull: true,
    },
    id_transaksi_keseluruhan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    updatedAt: false,
    modelName: "TransaksiBarang",
    tableName: "transaksi_barang",
  }
);

module.exports = TransaksiBarang;
