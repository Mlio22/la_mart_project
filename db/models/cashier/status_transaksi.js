"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class status_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  status_transaksi.init(
    {
      deskripsi_status: DataTypes.STRING(20),
    },
    {
      sequelize,
      timestamps: false,
      modelName: "status_transaksi",
      tableName: "status_transaksi",
    }
  );
  return status_transaksi;
};
