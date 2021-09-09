const Sequelize = require("sequelize");
const sequelize = require("../helpers/sequelize");
const DetailBarang = require("./basic/DetailBarang");
const DetailBarangAttribute = require("./basic/helper/DetailBarangAttribute");
const EditDetailBarang = require("./basic/log/PerubahanDetailBarang");
const LaporanHarian = require("./cashier/LaporanHarian");
const LaporanSesi = require("./cashier/LaporanSesi");
const TransaksiBarang = require("./cashier/TransaksiBarang");
const TransaksiKeseluruhan = require("./cashier/TransaksiKeseluruhan");
const StatusTransaksi = require("./cashier/helper/StatusTransaksi");
const PerubahanStatusTransaksi = require("./cashier/log/PerubahanStatusTransaksi");
const StokBarang = require("./stock/StokBarang");
const AlasanPengeluaran = require("./stock/helper/AlasanPengeluaran");
const AlasanPerubahanStok = require("./stock/helper/AlasanPerubahanStok");
const PemasukanBarang = require("./stock/log/PemasukanBarang");
const PengeluaranBarang = require("./stock/log/PengeluaranBarang");
const DetaiPerubahanStokBaranglBarang = require("./stock/log/PerubahanStokBarang");

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  DetailBarang,
  DetailBarangAttribute,
  EditDetailBarang,
  LaporanHarian,
  LaporanSesi,
  TransaksiBarang,
  TransaksiKeseluruhan,
  StatusTransaksi,
  PerubahanStatusTransaksi,
  StokBarang,
  AlasanPengeluaran,
  AlasanPerubahanStok,
  PemasukanBarang,
  PengeluaranBarang,
  DetaiPerubahanStokBaranglBarang,
};
