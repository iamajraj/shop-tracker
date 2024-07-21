const JSONDatabase = require("./database");

const soldProducts = new JSONDatabase("sold-products.json");
const products = new JSONDatabase("products.json");

module.exports = {
  soldProducts,
  products,
};
