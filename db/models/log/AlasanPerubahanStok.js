"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AlasanPerubahanStok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AlasanPerubahanStok.init(
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
  return AlasanPerubahanStok;
};
