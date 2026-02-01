console.log("Checkout script loaded");

/* ===============================
   LOAD CART
================================ */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderSummary = document.getElementById("orderSummary");
const summaryTotal = document.getElementById("summaryTotal");
const form = document.getElementById("checkoutForm");
const phoneLocal = document.getElementById("phoneLocal");
const phoneHidden = document.getElementById("phone");

/* ===============================
   BLOCK EMPTY CART
================================ */
if (!cart.length) {
  alert("Your cart is empty.");
  window.location.href = "index.html";
}

/* ===============================
   RENDER ORDER SUMMARY
================================ */
let total = 0;
orderSummary.innerHTML = "";

cart.forEach(item => {
  const qty = item.quantity || 1;
  const itemTotal = item.price * qty;
  total += itemTotal;

  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between";
  li.innerHTML = `
    <span>${item.name} x${qty}</span>
    <span>₱${itemTotal}</span>
  `;
  orderSummary.appendChild(li);
});

summaryTotal.textContent = total;

/* ===============================
   GENERATE REFERENCE ID
================================ */
function generateReferenceId() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, "0");

  return (
    "JB-" +
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "-" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    "-" +
    Math.floor(100 + Math.random() * 900)
  );
}

/* ===============================
   SUBMIT FORM
================================ */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* 📱 Phone validation (10 digits only) */
  if (!/^\d{10}$/.test(phoneLocal.value)) {
    alert("Phone number must be exactly 10 digits.");
    phoneLocal.focus();
    return;
  }

  /* Combine +63 with phone */
  phoneHidden.value = "+63" + phoneLocal.value;

  const referenceId = generateReferenceId();

  const formData = new FormData(form);

  /* Cart in TEXT form */
  formData.set(
    "cartItems",
    cart
      .map(item => `${item.name} - ₱${item.price} x${item.quantity || 1}`)
      .join(", ")
  );

  formData.set("totalAmount", total);
  formData.set("referenceId", referenceId);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Submission failed");

    /* ✅ CLEAR CART ONLY AFTER SUCCESS */
    localStorage.removeItem("cart");
    cart = [];

    /* Redirect to confirmation */
    window.location.href = `confirmation.html?ref=${referenceId}`;

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Failed to submit order. Please try again.");
  }
});
