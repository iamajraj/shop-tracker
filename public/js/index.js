const productsTableBody = document.querySelector(".products-table tbody");
const selectionProducts = document.querySelector(".products-selection");
const searchInput = document.querySelector(".search-input");

// selection products
let products = [];

async function fetchAndSetProductsSelection() {
  const response = await fetch("/get-products");
  const data = await response.json();
  products = data.data;

  products.forEach((product) => {
    let { id, name, stock, actualPrice, salePrice, createdAt } = product;
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    selectionProducts.appendChild(option);
  });
}

fetchAndSetProductsSelection();

// sold products
let soldProducts = [];
let filteredSoldProducts = [];

async function fetchAndSetSoldProducts() {
  const response = await fetch("/sold-products");
  const data = await response.json();

  soldProducts = data.data.sort((a, b) => b.id - a.id);
  filteredSoldProducts = soldProducts;

  loadSoldProducts();
}
fetchAndSetSoldProducts();

function loadSoldProducts() {
  productsTableBody.innerHTML = "";
  filteredSoldProducts.forEach((item) => {
    const product = getTableProduct({ ...item });
    productsTableBody.insertAdjacentHTML("beforeend", product);
  });
  productsTableBody.insertAdjacentHTML("beforeend", getTotalSoldProductInfo());
}

function getTotalSoldProductInfo() {
  let totalProfit = soldProducts.reduce((acc, curr) => {
    let product = products.find((prod) => prod.id === curr.productId);
    let actualPrice = Number(product.actualPrice) * curr.quantity;
    let salePrice = Number(product.salePrice) * curr.quantity;
    let profit = salePrice - actualPrice;
    return acc + profit;
  }, 0);

  const totalSale = soldProducts.reduce((acc, curr) => {
    return acc + Number(curr.price) * curr.quantity;
  }, 0);

  return `<tr>
        <td>Total</td>
        <td></td>
        <td></td>
        <td></td>
        <td>${totalSale} tk</td>
        <td>${totalProfit} tk</td>
        <td></td>
      </tr>`;
}

function getTableProduct({ productId, id, name, quantity, price, createdAt }) {
  const product = products.find((prod) => prod.id === productId);
  const actualTotalPrice = product.actualPrice * quantity;
  const saleTotalPrice = product.salePrice * quantity;
  return `<tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price} tk</td>
        <td>${quantity * price} tk</td>
        <td>${saleTotalPrice - actualTotalPrice} tk</td>
        <td>${new Date(createdAt).toLocaleDateString()}</td>
      </tr>`;
}

searchInput.addEventListener("input", (ev) => {
  let value = ev.target.value.trim();
  if (value != "") {
    filteredSoldProducts = soldProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        String(product.quantity).includes(value) ||
        String(product.id).includes(value) ||
        String(product.price).includes(value)
      );
    });
  } else {
    filteredSoldProducts = soldProducts;
  }
  loadSoldProducts();
});
