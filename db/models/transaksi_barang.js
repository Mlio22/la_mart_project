'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi_barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transaksi_barang.init({
    id_barang: DataTypes.INTEGER,
    id_transaksi_keseluruhan: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    total_harga: DataTypes.INTEGER,
    keuntungan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi_barang',
  });
  return transaksi_barang;
};