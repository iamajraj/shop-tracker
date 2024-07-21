const { soldProducts, products } = require("./connection");
const Request = require("./request");
const Response = require("./response");

async function indexPage(req, res) {
  const rs = new Response(res, req);
  await rs.sendFile("index.html");
}

async function productsPage(req, res) {
  const rs = new Response(res, req);
  await rs.sendFile("products.html");
}

async function getSoldProducts(req, res) {
  const rs = new Response(res, req);
  const data = soldProducts.find();
  rs.sendJSON("Get Sold Products Success", data);
}

async function getProducts(req, res) {
  const rs = new Response(res, req);
  const data = products.find();
  rs.sendJSON("Get products success", data);
}

async function insertProduct(req, res) {
  const rh = new Request(req);
  const rs = new Response(res, req);
  let data = await rh.json();

  let name = decodeURI(data?.name);
  let actualPrice = data?.actualPrice;
  let salePrice = data?.salePrice;
  let stock = data?.stock;

  if (name && !isNaN(actualPrice) && !isNaN(salePrice) && !isNaN(stock)) {
    actualPrice = Number(data?.actualPrice);
    salePrice = Number(data?.salePrice);
    stock = Number(data?.stock);

    await products.insert({
      name,
      actualPrice,
      salePrice,
      stock,
    });
    rs.setStatusCode(307);
    rs.setHeader("Location", "/products");
    rs.end();
  } else {
    rs.setStatusCode = 400;
    rs.sendJSON("Please enter valid data");
  }
}

async function updateProduct(req, res) {
  const rh = new Request(req);
  const rs = new Response(res, req);
  let data = await rh.json();

  let productId = data?.productId ? Number(data?.productId) : null;
  let name = decodeURI(data?.name);
  let actualPrice = data?.actualPrice;
  let salePrice = data?.salePrice;
  let stock = data?.stock;

  if (
    productId &&
    name &&
    !isNaN(actualPrice) &&
    !isNaN(salePrice) &&
    !isNaN(stock)
  ) {
    actualPrice = Number(data?.actualPrice);
    salePrice = Number(data?.salePrice);
    stock = Number(data?.stock);

    await products.update(productId, {
      name,
      actualPrice,
      salePrice,
      stock,
    });
    rs.setStatusCode(307);
    rs.setHeader("Location", "/products");
    rs.end();
  } else {
    rs.setStatusCode = 400;
    rs.sendJSON("Please enter valid data");
  }
}
async function statusPage(req, res) {
  const rs = new Response(res, req);
  rs.sendJSON("Server Status", {
    status: "Ok",
  });
}

async function insertSale(req, res) {
  const rh = new Request(req);
  const rs = new Response(res, req);
  let data = await rh.json();

  let productId = data?.productId ? Number(data?.productId) : null;
  let quantity = data?.quantity ? Number(data?.quantity) : null;

  if (productId && quantity) {
    const foundProduct = products.find(productId);
    if (foundProduct) {
      await soldProducts.insert({
        productId,
        quantity,
        name: foundProduct.name,
        price: foundProduct.salePrice,
      });
      foundProduct.stock -= quantity;
      await products.update(productId, foundProduct);
      rs.setStatusCode(307);
      rs.setHeader("Location", "/");
      rs.end();
    } else {
      rs.setStatusCode(404);
      rs.sendJSON(`Product doesn't exists with the product id ${productId}`);
    }
  } else {
    rs.setStatusCode = 400;
    rs.sendJSON("Please enter valid data");
  }
}

async function pageNotFound(req, res) {
  const rs = new Response(res, req);
  rs.setStatusCode(404);
  rs.sendJSON("Page Not Found");
}

module.exports = {
  indexPage,
  statusPage,
  productsPage,
  pageNotFound,
  getSoldProducts,
  getProducts,
  insertProduct,
  insertSale,
  updateProduct,
};
