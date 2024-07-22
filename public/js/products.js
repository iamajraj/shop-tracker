const productsTableBody = document.querySelector(".products-table tbody");
const searchInput = document.querySelector(".search-input");
const selectionStock = document.querySelector(".selection-stock");

// form inputs
const form = document.querySelector(".products-form");
const nameInp = document.querySelector("input[name='name']");
const stockInp = document.querySelector("input[name='stock']");
const actualPriceInp = document.querySelector("input[name='actualPrice']");
const salePriceInp = document.querySelector("input[name='salePrice']");

const submitBtn = document.querySelector(".submit-btn");
const cancelUpdateBtn = document.querySelector(".cancel-update-btn");

fetchAndSetProducts();
let products = [];
let filteredProducts = [];

async function fetchAndSetProducts() {
  const response = await fetch("/get-products");
  const data = await response.json();

  products = data.data;
  filteredProducts = products;

  loadProducts();
}

function loadProducts() {
  productsTableBody.innerHTML = "";
  filteredProducts.forEach((item) => {
    const product = getTableProduct({ ...item });
    productsTableBody.insertAdjacentHTML("beforeend", product);
  });
}

function getTableProduct({
  id,
  name,
  actualPrice,
  salePrice,
  stock,
  createdAt,
}) {
  return `<tr>
              <td>${id}</td>
              <td>${name}</td>
              <td>${stock}</td>
              <td>${salePrice} tk</td>
              <td>${actualPrice} tk</td>
              <td>${new Date(createdAt).toLocaleDateString()}</td>
              <td>
                <button data-product-id="${id}" class="edit-btn" onclick="editProduct.call(this)">Edit</button>
              </td>
            </tr>`;
}

searchInput.addEventListener("input", (ev) => {
  let value = ev.target.value.trim();
  if (value != "") {
    filteredProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        String(product.stock).includes(value) ||
        String(product.actualPrice).includes(value) ||
        String(product.salePrice).includes(value)
      );
    });
  } else {
    filteredProducts = products;
  }
  loadProducts();
});

selectionStock.addEventListener("change", (ev) => {
  switch (ev.target.value) {
    case "in_stock":
      filteredProducts = products.filter((prod) => prod.stock > 0);
      break;
    case "out_of_stock":
      filteredProducts = products.filter((prod) => prod.stock === 0);
      break;
    default:
      filteredProducts = products;
      break;
  }
  loadProducts();
});

let productIdInp = null;
function editProduct() {
  let id = Number(this.getAttribute("data-product-id"));
  const product = products.find((prod) => prod.id === id);

  nameInp.value = product.name;
  stockInp.value = product.stock;
  actualPriceInp.value = product.actualPrice;
  salePriceInp.value = product.salePrice;

  productIdInp = document.createElement("input");
  productIdInp.name = "productId";
  productIdInp.value = id;
  productIdInp.hidden = true;
  form.appendChild(productIdInp);

  submitBtn.textContent = "Update Product";
  form.action = "/update-product";
  cancelUpdateBtn.style.display = "block";
}

cancelUpdateBtn.addEventListener("click", () => {
  nameInp.value = "";
  stockInp.value = "";
  actualPriceInp.value = "";
  salePriceInp.value = "";

  if (productIdInp) {
    productIdInp.remove();
  }
  submitBtn.textContent = "Insert Product";
  form.action = "/insert-product";
  form.method = "post";
  cancelUpdateBtn.style.display = "none";
});
