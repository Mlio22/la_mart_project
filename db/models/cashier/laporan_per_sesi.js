"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class laporan_per_sesi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  laporan_per_sesi.init(
    {
      total_pendapatan: {
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
      modelName: "laporan_per_sesi",
      tableName: "laporan_per_sesi",
    }
  );
  return laporan_per_sesi;
};
