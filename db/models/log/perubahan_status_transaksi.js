"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class perubahan_status_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  perubahan_status_transaksi.init(
    {
      id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_status_transaksi_before: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_status_transaksi_after: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "perubahan_status_transaksi",
      tableName: "perubahan_status_transaksi",
    }
  );
  return perubahan_status_transaksi;
};
