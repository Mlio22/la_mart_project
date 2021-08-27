"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerubahanStokBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PerubahanStokBarang.init(
    {
      id_stok_barang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_alasan_perubahan_stok_barang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah_awal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah_akhir: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "perubahan_jumlah_stok_barang",
      tableName: "perubahan_jumlah_stok_barang",
    }
  );
  return PerubahanStokBarang;
};
