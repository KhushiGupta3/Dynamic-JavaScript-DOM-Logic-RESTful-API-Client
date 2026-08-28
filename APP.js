import { fetchProducts } from "./api.js";


let products = [];
let selectedCategory = "all";

const productsContainer =
    document.getElementById("products-container");

const searchInput =
    document.getElementById("search-input");

const sortSelect =
    document.getElementById("sort-select");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error-message");

const noResults =
    document.getElementById("no-results");

const cartCount =
    document.getElementById("cart-count");

const clearCart =
    document.getElementById("clear-cart");

const categoryButtons =
    document.querySelectorAll(".category-btn");


// -----------------------------
// Local Storage
// -----------------------------

function getCart() {
    return JSON.parse(
        localStorage.getItem("cartItems") || "[]"
    );
}


function saveCart(cart) {
    localStorage.setItem(
        "cartItems",
        JSON.stringify(cart)
    );
}


function updateCartCount() {
    const cart = getCart();

    cartCount.textContent = cart.length;
}


// -----------------------------
// Render Products
// -----------------------------

function renderProducts(items) {

    productsContainer.innerHTML = "";

    if (items.length === 0) {

        noResults.hidden = false;

        return;
    }

    noResults.hidden = true;


    items.forEach(product => {

        const article =
            document.createElement("article");

        article.className = "product-card";


        article.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.title}"
                class="product-image"
            >

            <div class="product-content">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>
                    ${product.title}
                </h3>

                <p class="product-price">
                    $${product.price.toFixed(2)}
                </p>

                <p class="product-rating">
                    Rating: ${product.rating.rate}
                </p>

                <button
                    type="button"
                    class="button primary add-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;


        productsContainer.appendChild(article);

    });


    document
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => addToCart(button.dataset.id)
            );

        });
}


// -----------------------------
// Add to Cart
// -----------------------------

function addToCart(productId) {

    const cart = getCart();

    if (!cart.includes(productId)) {

        cart.push(productId);

        saveCart(cart);

        updateCartCount();

    }

}


// -----------------------------
// Filtering + Sorting
// -----------------------------

function updateProducts() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    let filteredProducts =
        [...products];


    // Category filter

    if (selectedCategory !== "all") {

        filteredProducts =
            filteredProducts.filter(product =>
                product.category === selectedCategory
            );

    }


    // Search filter

    if (searchTerm) {

        filteredProducts =
            filteredProducts.filter(product =>
                product.title
                    .toLowerCase()
                    .includes(searchTerm)
            );

    }


    // Sorting

    const sortValue =
        sortSelect.value;


    if (sortValue === "price-low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sortValue === "price-high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sortValue === "name") {

        filteredProducts.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );

    }


    renderProducts(filteredProducts);
}


// -----------------------------
// Category Buttons
// -----------------------------

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            button.classList.add("active");


            selectedCategory =
                button.dataset.category;


            updateProducts();

        }
    );

});


// -----------------------------
// Search
// -----------------------------

searchInput.addEventListener(
    "input",
    updateProducts
);


// -----------------------------
// Sort
// -----------------------------

sortSelect.addEventListener(
    "change",
    updateProducts
);


// -----------------------------
// Clear Cart
// -----------------------------

clearCart.addEventListener(
    "click",
    () => {

        localStorage.removeItem("cartItems");

        updateCartCount();

    }
);


// -----------------------------
// Load API Data
// -----------------------------

async function loadProducts() {

    loading.hidden = false;

    errorMessage.hidden = true;


    try {

        products =
            await fetchProducts();


        renderProducts(products);

    }

    catch (error) {

        errorMessage.textContent =
            "Sorry, products could not be loaded. Please try again.";

        errorMessage.hidden = false;

    }

    finally {

        loading.hidden = true;

    }
}


// -----------------------------
// Start Application
// -----------------------------

updateCartCount();

loadProducts();
