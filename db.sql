-- MySQL Script generated by MySQL Workbench
-- Fri Jan 29 01:00:17 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema la_mart
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema la_mart
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `la_mart` DEFAULT CHARACTER SET utf8 ;
USE `la_mart` ;

-- -----------------------------------------------------
-- Table `la_mart`.`detail_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`detail_barang` (
  `id_barang` INT NOT NULL,
  `kode_barang` VARCHAR(45) NOT NULL,
  `nama_barang` VARCHAR(100) NOT NULL,
  `tanggal_ditambahkan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_barang`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`satuan_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`satuan_barang` (
  `id_satuan_barang` INT NOT NULL AUTO_INCREMENT,
  `nama_satuan_barang` VARCHAR(45) NOT NULL,
  `tanggal_ditambahkan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_satuan_barang`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`stok_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`stok_barang` (
  `id_stok` INT NOT NULL AUTO_INCREMENT,
  `id_barang` INT NOT NULL,
  `id_satuan_barang` INT NOT NULL,
  `jumlah` INT NOT NULL,
  `harga` INT NOT NULL,
  `tanggal_ditambahkan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_stok`),
  CONSTRAINT `fk_stok_barang_detail_barang1`
    FOREIGN KEY (`id_barang`)
    REFERENCES `la_mart`.`detail_barang` (`id_barang`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_stok_barang_satuan_barang1`
    FOREIGN KEY (`id_satuan_barang`)
    REFERENCES `la_mart`.`satuan_barang` (`id_satuan_barang`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`status_transaksi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`status_transaksi` (
  `id_status_transaksi` INT NOT NULL AUTO_INCREMENT,
  `deskripsi_status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_status_transaksi`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`transaksi_keseluruhan`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`transaksi_keseluruhan` (
  `id_transaksi_detail` INT NOT NULL AUTO_INCREMENT,
  `id_status_transaksi` INT NOT NULL,
  `total_harus_dibayar` INT NOT NULL,
  `dibayar_oleh_konsumen` INT NOT NULL,
  `kembalian` INT NOT NULL,
  `total_keuntungan` INT NOT NULL,
  `waktu_transaksi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_transaksi_detail`),
  CONSTRAINT `fk_transaksi_keseluruhan_status_transaksi1`
    FOREIGN KEY (`id_status_transaksi`)
    REFERENCES `la_mart`.`status_transaksi` (`id_status_transaksi`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`transaksi_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`transaksi_barang` (
  `id_transaksi_barang` INT NOT NULL AUTO_INCREMENT,
  `id_barang` INT NOT NULL,
  `id_transaksi_keseluruhan` INT NOT NULL,
  `jumlah` INT NOT NULL,
  `total_harga` INT NOT NULL,
  `keuntungan` INT NOT NULL,
  `tanggal_ditambahkan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_transaksi_barang`),
  CONSTRAINT `fk_detail_barang_has_transaksi_detail_barang1`
    FOREIGN KEY (`id_barang`)
    REFERENCES `la_mart`.`detail_barang` (`id_barang`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detail_barang_has_transaksi_transaksi1`
    FOREIGN KEY (`id_transaksi_keseluruhan`)
    REFERENCES `la_mart`.`transaksi_keseluruhan` (`id_transaksi_detail`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`alasan_pengeluaran`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`alasan_pengeluaran` (
  `id_alasan_pengeluaran` INT NOT NULL AUTO_INCREMENT,
  `deskripsi_alasan_pengeluaran` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_alasan_pengeluaran`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`pengeluaran_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`pengeluaran_barang` (
  `id_pengeluaran_barang` INT NOT NULL AUTO_INCREMENT,
  `id_stok_barang` INT NOT NULL,
  `id_alasan_pengeluaran_barang` INT NOT NULL,
  `jumlah` INT NOT NULL,
  `waktu_pengeluaran` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pengeluaran_barang`),
  CONSTRAINT `fk_pengeluaran_barang_alasan_pengeluaran1`
    FOREIGN KEY (`id_alasan_pengeluaran_barang`)
    REFERENCES `la_mart`.`alasan_pengeluaran` (`id_alasan_pengeluaran`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pengeluaran_barang_stok_barang1`
    FOREIGN KEY (`id_stok_barang`)
    REFERENCES `la_mart`.`stok_barang` (`id_stok`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`pemasukan_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`pemasukan_barang` (
  `id_pemasukan_barang` INT NOT NULL AUTO_INCREMENT,
  `id_stok_barang` INT NOT NULL,
  `jumlah` INT NOT NULL,
  `tanggal_pemasukkan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pemasukan_barang`),
  CONSTRAINT `fk_pemasukan_barang_stok_barang1`
    FOREIGN KEY (`id_stok_barang`)
    REFERENCES `la_mart`.`stok_barang` (`id_stok`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`perubahan_detail_barang_attribute`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`perubahan_detail_barang_attribute` (
  `id_attribute` INT NOT NULL AUTO_INCREMENT,
  `deskripsi_attribute` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_attribute`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`perubahan_detail_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`perubahan_detail_barang` (
  `id_perubahan_detail_barang` INT NOT NULL AUTO_INCREMENT,
  `id_barang` INT NOT NULL,
  `id_attribute_perubahan` INT NOT NULL,
  `content_before` VARCHAR(100) NOT NULL,
  `content_after` VARCHAR(100) NOT NULL,
  `tanggal_perubahan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_perubahan_detail_barang`),
  CONSTRAINT `fk_perubahan_detail_barang_detail_barang1`
    FOREIGN KEY (`id_barang`)
    REFERENCES `la_mart`.`detail_barang` (`id_barang`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_perubahan_detail_barang_perubahan_detail_barang_attribute1`
    FOREIGN KEY (`id_attribute_perubahan`)
    REFERENCES `la_mart`.`perubahan_detail_barang_attribute` (`id_attribute`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`laporan_harian`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`laporan_harian` (
  `id_laporan_harian` INT NOT NULL AUTO_INCREMENT,
  `tanggal_waktu` DATE NOT NULL,
  `total_pendapatan` INT NOT NULL,
  `total_keuntungan` INT NOT NULL,
  PRIMARY KEY (`id_laporan_harian`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`alasan_perubahan_jumlah_stok`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`alasan_perubahan_jumlah_stok` (
  `id_alasan_perubahan_jumlah_stok` INT NOT NULL AUTO_INCREMENT,
  `deskripsi_alasan_perubahan_stok` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_alasan_perubahan_jumlah_stok`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`perubahan_jumlah_stok_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`perubahan_jumlah_stok_barang` (
  `id_perubahan_jumlah_stok_barang` INT NOT NULL AUTO_INCREMENT,
  `id_stok_barang` INT NOT NULL,
  `id_alasan_perubahan_stok_barang` INT NOT NULL,
  `jumlah_awal` INT NOT NULL,
  `jumlah_akhir` INT NOT NULL,
  `tanggal_perubahan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_perubahan_jumlah_stok_barang`),
  CONSTRAINT `fk_perubahan_stok_barang_alasan_perubahan_stok1`
    FOREIGN KEY (`id_alasan_perubahan_stok_barang`)
    REFERENCES `la_mart`.`alasan_perubahan_jumlah_stok` (`id_alasan_perubahan_jumlah_stok`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_perubahan_stok_barang_stok_barang1`
    FOREIGN KEY (`id_stok_barang`)
    REFERENCES `la_mart`.`stok_barang` (`id_stok`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`perubahan_status_transaksi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`perubahan_status_transaksi` (
  `id_perubahan_status_transaksi` INT NOT NULL AUTO_INCREMENT,
  `id_transaksi` INT NOT NULL,
  `id_status_transaksi_awal` INT NOT NULL,
  `id_status_transaksi_akhir` INT NOT NULL,
  `tanggal_pengubahan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_perubahan_status_transaksi`),
  CONSTRAINT `fk_perubahan_status_transaksi_transaksi_detail1`
    FOREIGN KEY (`id_transaksi`)
    REFERENCES `la_mart`.`transaksi_keseluruhan` (`id_transaksi_detail`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_perubahan_status_transaksi_status_transaksi1`
    FOREIGN KEY (`id_status_transaksi_awal`)
    REFERENCES `la_mart`.`status_transaksi` (`id_status_transaksi`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_perubahan_status_transaksi_status_transaksi2`
    FOREIGN KEY (`id_status_transaksi_akhir`)
    REFERENCES `la_mart`.`status_transaksi` (`id_status_transaksi`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`perubahan_stok_barang_attribute`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`perubahan_stok_barang_attribute` (
  `id_attribute` INT NOT NULL,
  `deskripsi_attribute` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_attribute`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `la_mart`.`perubahan_stok_barang`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `la_mart`.`perubahan_stok_barang` (
  `id_perubahan_stok_barang` INT NOT NULL,
  `stok_barang_id_stok` INT NOT NULL,
  `id_attribute` INT NOT NULL,
  `deskiripsi_awal` VARCHAR(45) NOT NULL,
  `deskripsi_akhir` VARCHAR(45) NOT NULL,
  `tanggal_perubahan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_perubahan_stok_barang`),
  CONSTRAINT `fk_perubahan_stok_barang_stok_barang2`
    FOREIGN KEY (`stok_barang_id_stok`)
    REFERENCES `la_mart`.`stok_barang` (`id_stok`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_perubahan_stok_barang_perubahan_stok_barang_attribute1`
    FOREIGN KEY (`id_attribute`)
    REFERENCES `la_mart`.`perubahan_stok_barang_attribute` (`id_attribute`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `la_mart`.`satuan_barang`
-- -----------------------------------------------------
START TRANSACTION;
USE `la_mart`;
INSERT INTO `la_mart`.`satuan_barang` (`id_satuan_barang`, `nama_satuan_barang`, `tanggal_ditambahkan`) VALUES (1, 'Kotak', DEFAULT);
INSERT INTO `la_mart`.`satuan_barang` (`id_satuan_barang`, `nama_satuan_barang`, `tanggal_ditambahkan`) VALUES (2, 'Box', DEFAULT);

COMMIT;


-- -----------------------------------------------------
-- Data for table `la_mart`.`status_transaksi`
-- -----------------------------------------------------
START TRANSACTION;
USE `la_mart`;
INSERT INTO `la_mart`.`status_transaksi` (`id_status_transaksi`, `deskripsi_status`) VALUES (1, 'Dalam Transaksi');
INSERT INTO `la_mart`.`status_transaksi` (`id_status_transaksi`, `deskripsi_status`) VALUES (2, 'Tertunda');
INSERT INTO `la_mart`.`status_transaksi` (`id_status_transaksi`, `deskripsi_status`) VALUES (3, 'Dibatalkan');
INSERT INTO `la_mart`.`status_transaksi` (`id_status_transaksi`, `deskripsi_status`) VALUES (4, 'Berhasil');

COMMIT;


-- -----------------------------------------------------
-- Data for table `la_mart`.`alasan_pengeluaran`
-- -----------------------------------------------------
START TRANSACTION;
USE `la_mart`;
INSERT INTO `la_mart`.`alasan_pengeluaran` (`id_alasan_pengeluaran`, `deskripsi_alasan_pengeluaran`) VALUES (1, 'Transaksi');
INSERT INTO `la_mart`.`alasan_pengeluaran` (`id_alasan_pengeluaran`, `deskripsi_alasan_pengeluaran`) VALUES (2, 'Barang Kadaluarsa');
INSERT INTO `la_mart`.`alasan_pengeluaran` (`id_alasan_pengeluaran`, `deskripsi_alasan_pengeluaran`) VALUES (3, 'Lainnya');

COMMIT;


-- -----------------------------------------------------
-- Data for table `la_mart`.`perubahan_detail_barang_attribute`
-- -----------------------------------------------------
START TRANSACTION;
USE `la_mart`;
INSERT INTO `la_mart`.`perubahan_detail_barang_attribute` (`id_attribute`, `deskripsi_attribute`) VALUES (1, 'kode_barang');
INSERT INTO `la_mart`.`perubahan_detail_barang_attribute` (`id_attribute`, `deskripsi_attribute`) VALUES (2, 'nama_barang');

COMMIT;


-- -----------------------------------------------------
-- Data for table `la_mart`.`alasan_perubahan_jumlah_stok`
-- -----------------------------------------------------
START TRANSACTION;
USE `la_mart`;
INSERT INTO `la_mart`.`alasan_perubahan_jumlah_stok` (`id_alasan_perubahan_jumlah_stok`, `deskripsi_alasan_perubahan_stok`) VALUES (1, 'Barang Masuk');
INSERT INTO `la_mart`.`alasan_perubahan_jumlah_stok` (`id_alasan_perubahan_jumlah_stok`, `deskripsi_alasan_perubahan_stok`) VALUES (2, 'Transaksi');
INSERT INTO `la_mart`.`alasan_perubahan_jumlah_stok` (`id_alasan_perubahan_jumlah_stok`, `deskripsi_alasan_perubahan_stok`) VALUES (3, 'Barang Keluar');
INSERT INTO `la_mart`.`alasan_perubahan_jumlah_stok` (`id_alasan_perubahan_jumlah_stok`, `deskripsi_alasan_perubahan_stok`) VALUES (4, 'Lainnya');

COMMIT;


-- -----------------------------------------------------
-- Data for table `la_mart`.`perubahan_stok_barang_attribute`
-- -----------------------------------------------------
START TRANSACTION;
USE `la_mart`;
INSERT INTO `la_mart`.`perubahan_stok_barang_attribute` (`id_attribute`, `deskripsi_attribute`) VALUES (1, 'id_barang');
INSERT INTO `la_mart`.`perubahan_stok_barang_attribute` (`id_attribute`, `deskripsi_attribute`) VALUES (2, 'id_satuan_barang');
INSERT INTO `la_mart`.`perubahan_stok_barang_attribute` (`id_attribute`, `deskripsi_attribute`) VALUES (3, 'harga');

COMMIT;

