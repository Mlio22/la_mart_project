const { Op } = require("sequelize");
const db = require("../models/models");

/**
 * @typedef ItemData
 * @type {Object}
 * @property {?number} id - item id from DB
 * @property {string} barcode - item barcode from DB
 * @property {string} name - item name from DB
 * @property {string} quantity - item quantity
 * @property {number} priceSell - item price (sell)
 * @property {number?} priceBuy - item price (buy)
 */

/**
 *
 * @async
 * @param {Object} searchItemParam
 * @param {string} searchItemParam.hint
 * @param {Array<String>} searchItemParam.params - filter using category
 * @param {Boolean} searchItemParam.full_match - must match with hint exactly?
 * @param {String} searchItemParam.type - cashier or stock?
 * @returns {Promise<Array<ItemData>>} list of matching results
 */
async function searchItemDB({ hint, params: searchBy, full_match: exactSearch, type }) {
  if (hint === "") return [];

  const queries = [];
  searchBy.forEach((param) => {
    if (param === "barcode") param = "barcode_barang";
    if (param === "name") param = "nama_barang";

    // exact search
    if (exactSearch) {
      queries.push({
        [param]: {
          [Op.eq]: hint,
        },
      });
    }

    // partial search
    else {
      queries.push({
        [param]: {
          [Op.substring]: hint,
        },
      });
    }
  });

  const attributes = [
    "id",
    ["barcode_barang", "barcode"],
    ["nama_barang", "name"],
    ["satuan_barang", "quantity"],
    ["harga_jual", "priceSell"],
  ];

  if (type === "stock") {
    attributes.push(["harga_beli", "priceBuy"]);
  }

  const query = {
    [Op.or]: queries,
  };

  let result = await db.DetailBarang.findAll({
    attributes: attributes,
    where: query,
  });

  // return only datavalues data
  result = result.map((item) => {
    return item.dataValues;
  });

  return [...result];
}

module.exports = { searchItemDB };
