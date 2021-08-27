"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatusTransaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StatusTransaksi.init(
    {
      deskripsi_status: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "StatusTransaksi",
      tableName: "status_transaksi",
    }
  );
  return StatusTransaksi;
};
