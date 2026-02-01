// Reset cart on new browser session
if (!sessionStorage.getItem("justbakedSession")) {
  localStorage.removeItem("cart");
  sessionStorage.setItem("justbakedSession", "true");
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Add to cart with quantity handling */
function addToCart(name, price, img) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
    showCartToast("Quantity updated 🧁");
  } else {
    cart.push({ name, price, img, quantity: 1 });
    showCartToast("Added to cart 🛒");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  animateCartButton();
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


/* Init */
updateCartCount();
