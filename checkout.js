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

cart.forEach(item => {
  const qty = item.quantity || 1;
  const itemTotal = item.price * qty;
  total += itemTotal;

  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.innerHTML = `
    <span>${item.name} x${qty}</span>
    <span>₱${itemTotal}</span>
  `;
  orderSummary.appendChild(li);
});

summaryTotal.textContent = total;

/* 🔢 Generate Reference ID */
function generateReferenceId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0,10).replace(/-/g,"");
  const timePart = now.toTimeString().slice(0,8).replace(/:/g,"");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `JB-${datePart}-${timePart}-${randomPart}`;
}

/* 📤 Submit checkout form */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("SUBMIT TRIGGERED");

  /* 📱 Phone validation (10 digits only) */
  const phoneLocal = document.getElementById("phoneLocal");
  if (!/^\d{10}$/.test(phoneLocal.value)) {
    alert("Phone number must be exactly 10 digits.");
    phoneLocal.focus();
    return;
  }

  const referenceId = generateReferenceId();

  const formData = new FormData(form);
  formData.append("cartItems", cart.map(i => `${i.name} - ₱${i.price}`).join(", "));
  formData.append("totalAmount", total);
  formData.append("referenceId", referenceId);

  try {
    console.log("SENDING REQUEST TO WEB APP");
    const res = await fetch(form.action, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    /* 🧠 Apps Script often returns plain text */
    let success = true;
    try {
      const json = JSON.parse(text);
      success = json.result === "success";
    } catch {
      success = true;
    }

    if (success) {
      form.reset();
      window.location.href = `confirmation.html?ref=${referenceId}`;
    } else {
      alert("Failed to submit order. Please try again.");
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
    alert("Failed to submit order. Please check your internet connection.");
  }
});
