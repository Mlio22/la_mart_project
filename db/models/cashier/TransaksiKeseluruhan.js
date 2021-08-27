"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransaksiKeseluruhan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TransaksiKeseluruhan.init(
    {
      id_status_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_harus_dibayar: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dibayar_oleh_konsumen: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      kembalian: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_keuntungan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "TransaksiKeseluruhan",
      tableName: "transaksi_keseluruhan",
    }
  );
  return TransaksiKeseluruhan;
};
