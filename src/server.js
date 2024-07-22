const http = require("http");
const {
  getProducts,
  getSoldProducts,
  indexPage,
  insertProduct,
  insertSale,
  pageNotFound,
  productsPage,
  statusPage,
  updateProduct,
  handlePublicDir,
} = require("./routes");

const mapper = {
  "/": indexPage, // GET
  "/status": statusPage, // GET
  "/insert-sale": insertSale, // POST
  "/sold-products": getSoldProducts, // GET
  "/insert-product": insertProduct, // POST
  "/update-product": updateProduct, // PUT
  "/products": productsPage, // GET
  "/get-products": getProducts, // GET
};

http
  .createServer(async (req, res) => {
    // handle public dir
    if (req.url.startsWith("/public")) {
      await handlePublicDir(req, res);
    } else {
      let pageHandler = mapper[req.url];
      if (!pageHandler) return pageNotFound(req, res);
      await pageHandler(req, res);
    }
  })
  .listen(8000, () => {
    console.log("Server started http://localhost:8000");
  });
