"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AlasanPengeluaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AlasanPengeluaran.init(
    {
      deskripsi_alasan_pengeluaran: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "alasan_pengeluaran",
      tableName: "alasan_pengeluaran",
    }
  );
  return AlasanPengeluaran;
};
