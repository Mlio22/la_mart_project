"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class alasan_perubahan_jumlah_stok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  alasan_perubahan_jumlah_stok.init(
    {
      deskripsi_alasan_perubahan_stok: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "alasan_perubahan_jumlah_stok",
      tableName: "alasan_perubahan_jumlah_stok",
    }
  );
  return alasan_perubahan_jumlah_stok;
};
