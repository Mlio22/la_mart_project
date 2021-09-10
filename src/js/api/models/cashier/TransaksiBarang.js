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
    id_status_barang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: "TransaksiBarang",
    tableName: "transaksi_barang",
  }
);

module.exports = TransaksiBarang;
