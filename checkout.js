console.log("Checkout script loaded");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderSummary = document.getElementById("orderSummary");
const summaryTotal = document.getElementById("summaryTotal");
const form = document.getElementById("checkoutForm");

/* 🚫 Block checkout if cart is empty */
if (cart.length === 0) {
  alert("Your cart is empty.");
  window.location.href = "index.html";
}

/* 🛒 Render order summary */
let total = 0;
let cartText = [];

cart.forEach(item => {
  const qty = item.quantity || 1;
  const itemTotal = item.price * qty;
  total += itemTotal;

  cartText.push(`${item.name} - ₱${item.price} x${qty}`);

  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.innerHTML = `
    <span>${item.name} x${qty}</span>
    <span>₱${itemTotal}</span>
  `;
  orderSummary.appendChild(li);
});

summaryTotal.textContent = total;

/* 🧾 Populate hidden fields */
document.getElementById("cartItems").value = cartText.join(", ");
document.getElementById("totalAmount").value = total;

/* 📤 Final submit handling (NORMAL form submit) */
form.addEventListener("submit", (event) => {
  console.log("Form submitting normally with file upload");
  event.preventDefault();

  const phoneLocal = document.getElementById("phoneLocal");
  const phoneHidden = document.getElementById("phone");

  /* 📱 Phone validation (10 digits only) */
  if (!/^\d{10}$/.test(phoneLocal.value)) {
    alert("Phone number must be exactly 10 digits.");
    phoneLocal.focus();
    event.preventDefault(); // block ONLY on validation error
    return;
  }

  phoneHidden.value = "+63" + phoneLocal.value;
	
  form.submit();
  /* 🧹 Clear cart before Apps Script redirect */
  localStorage.removeItem("cart");

  // ✅ Let browser submit the form naturally
});
