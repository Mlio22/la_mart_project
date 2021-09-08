const { Op } = require("sequelize");
const db = require("../models/models");

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
  console.log(result);

  return result;
}

module.exports = { searchItemDB };
