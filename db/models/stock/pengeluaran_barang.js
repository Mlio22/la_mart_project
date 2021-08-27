"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pengeluaran_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pengeluaran_barang.init(
    {
      id_stok_barang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_alasan_pengeluaran: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "pengeluaran_barang",
      tableName: "pengeluaran_barang",
    }
  );
  return pengeluaran_barang;
};
