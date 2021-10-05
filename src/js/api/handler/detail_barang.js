const { Op } = require("sequelize");
const db = require("../models/models");

/**
 *
 * @async
 * @param {Object} searchItemParam
 * @param {string} [searchItemParam.hint=""]
 * @param {Array<String>} [searchItemParam.searchBy=["barcode_barang", "nama_barang"]] - filter
 * @param {Boolean} [searchItemParam.exactSearch=false] - must match with hint exactly?
 * @returns {Promise<Array<Object>>} list of matching results
 */
async function searchItemDB({
  hint = "",
  searchBy = ["barcode_barang", "nama_barang"],
  exactSearch = false,
}) {
  if (hint === "") return;

  const queries = [];
  searchBy.forEach((param) => {
    // set query based from exact or not
    if (exactSearch) {
      queries.push({
        [param]: {
          [Op.eq]: hint,
        },
      });
    } else {
      queries.push({
        [param]: {
          [Op.substring]: hint,
        },
      });
    }
  });

  const query = {
    [Op.or]: queries,
  };

  let result = await db.DetailBarang.findAll({
    attributes: [
      "id",
      ["barcode_barang", "barcode"],
      ["nama_barang", "name"],
      ["harga_jual", "price"],
      ["satuan_barang", "quantity"],
    ],
    where: query,
  });

  // return only datavalues data
  result = result.map((item) => item.dataValues);

  return result;
}

module.exports = { searchItemDB };
