// Keep a global list of products so we can easily find them when a user clicks "Add to Cart"
let allProducts = [];

// Load the cart from localStorage, or start with an empty array if it's their first time
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update the cart counter on the page immediately
updateCartCount();

// Fetch products from the backend
function loadStore() {
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
            allProducts = data; // Save the data to our global array
            
            const productList = document.getElementById("product-list");
            productList.innerHTML = ""; 

            data.forEach(product => {
                // Create a card for each product
                const card = document.createElement("div");
                card.className = "product-card";

                card.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <p><small>In Stock: ${product.stock}</small></p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;

                productList.appendChild(card);
            });
        })
        .catch(error => console.log("Error loading store:", error));
}

// Function to handle adding items to the cart
function addToCart(productId) {
    // Find the full product details from our loaded list
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;

    // Check if the item is already in the cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // If it is, just increase the quantity
        existingItem.quantity += 1;
    } else {
        // If it isn't, add it as a new item with a quantity of 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update the number at the top of the page
    updateCartCount();
    
    alert(`${product.name} added to your cart!`);
}

// Simple function to count total items and update the HTML
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = totalItems;
}

// Call this immediately when the page loads
loadStore();
