'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class perubahan_jumlah_stok_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  perubahan_jumlah_stok_barang.init({
    id_stok_barang: DataTypes.INTEGER,
    id_alasan_perubahan_stok_barang: DataTypes.INTEGER,
    jumlah_awal: DataTypes.INTEGER,
    jumlah_akhir: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'perubahan_jumlah_stok_barang',
  });
  return perubahan_jumlah_stok_barang;
};