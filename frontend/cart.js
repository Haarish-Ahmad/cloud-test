// Load the cart from localStorage, or start with an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to display the cart items on the page
function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = ""; // Clear existing content

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty!</p>";
        document.getElementById("checkout-btn").disabled = true;
        updateTotal();
        return;
    }

    document.getElementById("checkout-btn").disabled = false;

    // Loop through the cart array and build a row for each item
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";

        itemDiv.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                Price: $${item.price}
            </div>
            <div class="cart-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeItem(${item.id})" style="color: red; margin-left: 15px;">Remove</button>
            </div>
            <div>
                Subtotal: $${(item.price * item.quantity).toFixed(2)}
            </div>
        `;

        cartContainer.appendChild(itemDiv);
    });

    updateTotal();
}

// Function to increase or decrease item quantity
function changeQuantity(productId, change) {
    const item = cart.find(p => p.id === productId);
    
    if (item) {
        item.quantity += change;
        
        // If quantity drops to 0 (or below), remove it entirely
        if (item.quantity <= 0) {
            removeItem(productId);
            return; // removeItem will handle saving and re-rendering
        }
    }

    saveAndRender();
}

// Function to completely remove an item from the cart
function removeItem(productId) {
    // Filter out the item with the matching ID
    cart = cart.filter(p => p.id !== productId);
    saveAndRender();
}

// Function to calculate the total price
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById("cart-total").textContent = total.toFixed(2);
}

// Helper function to save to localStorage and refresh the page UI
function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Function to handle the checkout button click
function goToCheckout() {
    if (cart.length > 0) {
        window.location.href = "checkout.html";
    }
}

// Call this immediately when the page loads to show the data
renderCart();
