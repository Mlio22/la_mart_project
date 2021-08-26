"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class alasan_pengeluaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  alasan_pengeluaran.init(
    {
      deskripsi_alasan_pengeluaran: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "alasan_pengeluaran",
    }
  );
  return alasan_pengeluaran;
};
