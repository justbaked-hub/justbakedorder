let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Add to cart with quantity handling */
function addToCart(name, price, img) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      img,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  animateCartButton();
}

/* Update cart badge */
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

/* Small visual feedback when adding to cart */
function animateCartButton() {
  const btn = document.querySelector(".btn-warning");
  if (!btn) return;

  btn.classList.add("btn-pulse");
  setTimeout(() => btn.classList.remove("btn-pulse"), 300);
}

/* Init */
updateCartCount();

window.addEventListener("beforeunload", () => {
  localStorage.removeItem("cart");
});
