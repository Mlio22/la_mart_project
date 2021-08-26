'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class status_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  status_transaksi.init({
    deskripsi_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'status_transaksi',
  });
  return status_transaksi;
};