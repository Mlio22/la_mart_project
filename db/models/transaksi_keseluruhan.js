'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi_keseluruhan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transaksi_keseluruhan.init({
    id_status_transaksi: DataTypes.INTEGER,
    total_harus_dibayar: DataTypes.INTEGER,
    dibayar_oleh_konsumen: DataTypes.INTEGER,
    kembalian: DataTypes.INTEGER,
    total_keuntungan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi_keseluruhan',
  });
  return transaksi_keseluruhan;
};