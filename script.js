// Reset cart on new browser session
if (!sessionStorage.getItem("justbakedSession")) {
  localStorage.removeItem("cart");
  sessionStorage.setItem("justbakedSession", "true");
}

const PRODUCTS = [
  {
    id: "3cc",
    name: "3 pcs Chocolate Chip Cookies",
    price: 290,
    img: "pictures/ChocolateChipCookie.jpeg"
  },
  {
    id: "5cc",
    name: "5 pcs Chocolate Chip Cookies",
    price: 480,
    img: "pictures/ChocolateChipCookie.jpeg"
  },
  {
    id: "10cc",
    name: "10 pcs Chocolate Chip Cookies",
    price: 985,
    img: "pictures/ChocolateChipCookie.jpeg"
  },
  {
    id: "nib",
    name: "Chocolate Chip Cookie Nibblers",
    price: 199,
    img: "pictures/ChocolateChipCookieNibblers.jpeg"
  }
];

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  PRODUCTS.forEach(p => {
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
      <div class="card h-100 product-card">
        <img src="${p.img}" class="card-img-top product-img" alt="${p.name}">
        <div class="card-body text-center">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text fw-bold">₱${p.price}</p>
          <button
            class="btn btn-warning w-100 add-btn"
            onclick="addToCart('${p.id}')">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    grid.appendChild(col);
  });
}

function showToast() {
  const toast = document.getElementById("cartToast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 800); // visible for a split second
}



let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Add to cart with quantity handling */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast();
}



/* Update cart badge */
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  cartCount.textContent = totalItems;
}


/* Small visual feedback when adding to cart */
function animateCartButton() {
  const btn = document.querySelector(".btn-warning");
  if (!btn) return;

  btn.classList.add("btn-pulse");
  setTimeout(() => btn.classList.remove("btn-pulse"), 300);
}

function showCartToast(message = "Added to cart 🛒") {
  const toast = document.getElementById("cartToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 700);
}

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    document.body.style.display = "none";
    requestAnimationFrame(() => {
      document.body.style.display = "";
    });
  }
});



/* Init */
updateCartCount();
renderProducts();
