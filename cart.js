let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

function renderCart() {
  const cartList = document.getElementById("cartList");
  const totalSpan = document.getElementById("total");
  const cartActions = document.getElementById("cartActions");

  cartList.innerHTML = "";
  let total = 0;

  // EMPTY CART
  if (cart.length === 0) {
    totalSpan.textContent = "0";
    cartActions.innerHTML = `
      <a href="index.html" class="btn btn-warning btn-lg">
        Continue Shopping
      </a>
    `;
    return;
  }

  // CART ITEMS
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.img}"
             alt="${item.name}"
             style="width:80px;height:80px;object-fit:cover;border-radius:10px"
             class="me-3">

        <div>
          <strong>${item.name}</strong>
          <div class="mt-2 d-flex align-items-center">
            <button class="btn btn-outline-secondary btn-sm"
              onclick="changeQty(${index}, -1)"
              ${item.quantity === 1 ? "disabled" : ""}>
              −
            </button>

            <span class="mx-3">${item.quantity}</span>

            <button class="btn btn-outline-secondary btn-sm"
              onclick="changeQty(${index}, 1)">
              +
            </button>

            <!-- REMOVE BUTTON -->
            <button class="btn btn-outline-danger btn-sm ms-3"
              onclick="removeItem(${index})">
              Remove
            </button>
          </div>
        </div>
      </div>

      <span>₱${itemTotal}</span>
    `;

    cartList.appendChild(li);
  });

  totalSpan.textContent = total;

  // CART ACTIONS
  cartActions.innerHTML = `
    <a href="index.html" class="btn btn-outline-secondary me-2">
      Continue Shopping
    </a>
    <a href="checkout.html" class="btn btn-warning">
      Checkout
    </a>
  `;
}

function changeQty(index, delta) {
  cart[index].quantity += delta;

  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  sessionStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
