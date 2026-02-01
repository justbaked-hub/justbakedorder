console.log("Checkout script loaded");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderSummary = document.getElementById("orderSummary");
const summaryTotal = document.getElementById("summaryTotal");
const form = document.getElementById("checkoutForm");

/* Block checkout if cart is empty */
if (cart.length === 0) {
  alert("Your cart is empty.");
  window.location.href = "index.html";
}

/* Render order summary */
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

/* Submit checkout form */
form.addEventListener("submit", async (e) => {
  console.log("SUBMIT TRIGGERED");
  e.preventDefault();

  const url = "https://script.google.com/macros/s/AKfycbzmzf1iIjNvXrvUMH_u0V6XEI9ejCbij4OriRrdQyGApIbZKODe4wY68W0xRU-RjguAPQ/exec";

  const formData = new FormData(form);
  formData.append("cartItems", JSON.stringify(cart));
  formData.append("totalAmount", total);

  try {
    console.log("SENDING REQUEST TO:", url);
    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      // Apps Script returned plain text
      data = { result: "success" };
    }

    if (data.result === "success") {
      alert("Order submitted successfully!");
      localStorage.removeItem("cart");
      form.reset();
      window.location.href = "index.html";
    } else {
      alert("Failed to submit order: " + (data.message || "Unknown error"));
    }

  } catch (err) {
    console.error(err);
    alert("Failed to submit order. Please check your internet connection.");
  }
});
