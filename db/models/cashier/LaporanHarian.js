"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LaporanHarian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LaporanHarian.init(
    {
      total_pendapatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_keuntungan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "laporan_harian",
      tableName: "laporan_harian",
    }
  );
  return LaporanHarian;
};
