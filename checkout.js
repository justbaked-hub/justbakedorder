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

/* 📤 Final submit handling */
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // REQUIRED for file upload

  console.log("Form submitting with file upload");

  const phoneLocal = document.getElementById("phoneLocal");
  const phoneHidden = document.getElementById("phone");

  /* 📱 Phone validation (10 digits only) */
  if (!/^\d{10}$/.test(phoneLocal.value)) {
    alert("Phone number must be exactly 10 digits.");
    phoneLocal.focus();
    return;
  }

  phoneHidden.value = "+63" + phoneLocal.value;

  /* 📦 Submit using FormData (keeps all fields + file) */
  const formData = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: formData
    });

    const html = await res.text();

    /* 🧹 Clear cart ONLY after successful submit */
    localStorage.removeItem("cart");

    /* 🔁 Let Apps Script handle redirect */
    document.open();
    document.write(html);
    document.close();

  } catch (err) {
    console.error(err);
    alert("Failed to submit order. Please try again.");
  }
});

