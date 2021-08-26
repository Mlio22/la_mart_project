'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class perubahan_status_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  perubahan_status_transaksi.init({
    id_transaksi: DataTypes.INTEGER,
    id_status_transaksi_before: DataTypes.INTEGER,
    id_status_transaksi_after: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'perubahan_status_transaksi',
  });
  return perubahan_status_transaksi;
};