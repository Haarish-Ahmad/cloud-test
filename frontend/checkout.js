// Load the cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Security check: If someone tries to open checkout.html with an empty cart, boot them back to the store
if (cart.length === 0) {
    window.location.href = "index.html";
}

// Calculate and display the final order summary
function loadSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById("summary-items").textContent = totalItems;
    document.getElementById("summary-total").textContent = totalAmount.toFixed(2);
}

// Run the summary calculation immediately
loadSummary();

// Handle the order submission
const form = document.getElementById("checkoutForm");

form.addEventListener("submit", function(e) {
    e.preventDefault(); // Stop the page from reloading

    // 1. Show the success message
    const messageEl = document.getElementById("message");
    messageEl.textContent = "Order Placed Successfully! Redirecting to store...";
    messageEl.style.color = "green";

    // 2. Hide the submit button so they can't click it twice
    document.querySelector("button[type='submit']").style.display = "none";

    // 3. Clear the cart from localStorage so they start fresh next time
    localStorage.removeItem("cart");

    // 4. Send them back to the storefront after 3 seconds
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
});
