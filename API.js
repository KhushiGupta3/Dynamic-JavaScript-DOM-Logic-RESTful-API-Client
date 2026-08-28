const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Unable to load products.");
    }

    const products = await response.json();

    return products;
}
