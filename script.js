const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cart-count");
const cartCountPanel = document.getElementById("cart-count-panel");

let cart = [];

/* PRODUITS */
const products = [
    { id: 1, name: "Marteau 500g", price: 2500, image: "Images/Brouette.jpg" },
    { id: 2, name: "Tournevis plat", price: 1000, image: "Images/Brouette.jpg" },
    { id: 3, name: "Tournevis cruciforme", price: 1000, image: "Images/Brouette.jpg" }
];

function displayProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";

    products.forEach(p => {
        list.innerHTML += `
            <div class="product">
                <img src="${p.image}" class="product-img">
                <h4>${p.name}</h4>
                <p>${p.price} KMF</p>
                <button class="add-btn" onclick="addToCart(${p.id})">Ajouter au panier</button>
            </div>
        `;
    });
}

displayProducts();

/* AJOUT AU PANIER */
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);

    cartCount.textContent = cart.length;
    cartCountPanel.textContent = cart.length;

    updateCart();
}

function updateCart() {
    const list = document.getElementById("cart-items");
    const total = document.getElementById("total");

    list.innerHTML = "";
    let sum = 0;

    cart.forEach(item => {
        sum += item.price;
        list.innerHTML += `<li>${item.name} — ${item.price} KMF</li>`;
    });

    total.textContent = sum;
}

/* OUVERTURE / FERMETURE */
document.querySelector(".cart-icon").addEventListener("click", () => {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
});

document.getElementById("close-cart").addEventListener("click", () => {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
});
