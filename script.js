/* ============================
   ONGLET : CHANGEMENT DE SECTION
============================ */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Désactiver tous les onglets
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Afficher le bon contenu
        const tab = btn.getAttribute("data-tab");
        tabContents.forEach(content => {
            content.classList.remove("active");
            if (content.id === tab) {
                content.classList.add("active");
            }
        });
    });
});

/* ============================
   PRODUITS : LISTE
============================ */
const products = [
    { name: "Marteau", price: 2500, image: "marteau.jpg" },
    { name: "Tournevis", price: 1500, image: "tournevis.jpg" },
    { name: "Clé plate", price: 1800, image: "cle.jpg" },
    { name: "Pince", price: 2200, image: "pince.jpg" },
    { name: "Ampoule LED", price: 500, image: "ampoule.jpg" },
    { name: "Rallonge électrique", price: 3500, image: "rallonge.jpg" },
    { name: "Raccord plomberie", price: 300, image: "raccord.jpg" },
    { name: "Tuyau PVC", price: 1200, image: "tuyau.jpg" },
    { name: "Gants de travail", price: 800, image: "gants.jpg" },
    { name: "Ruban adhésif", price: 400, image: "ruban.jpg" }
];

const productList = document.getElementById("product-list");

/* ============================
   AFFICHAGE DES PRODUITS
============================ */
function displayProducts(list = products) {
    productList.innerHTML = "";

    list.forEach((p, index) => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image}" class="product-img">
            <h4>${p.name}</h4>
            <p>${p.price} KMF</p>
            <button onclick="addToCart(${index})">Ajouter</button>
        `;
        productList.appendChild(div);
    });
}

displayProducts();

/* ============================
   RECHERCHE
============================ */
const searchInput = document.getElementById("search-input");
const resultCount = document.getElementById("result-count");

searchInput?.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase();

    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(text)
    );

    filtered = applySort(filtered);

    displayProducts(filtered);
    updateResultCount(filtered);
});

/* ============================
   TRI
============================ */
const sortSelect = document.getElementById("sort-select");

sortSelect?.addEventListener("change", () => {
    const text = searchInput.value.toLowerCase();

    let list = products.filter(p =>
        p.name.toLowerCase().includes(text)
    );

    list = applySort(list);

    displayProducts(list);
    updateResultCount(list);
});

function applySort(list) {
    const value = sortSelect.value;
    let sorted = [...list];

    if (value === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (value === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (value === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (value === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));

    return sorted;
}

function updateResultCount(list) {
    if (!resultCount) return;

    if (list.length === 0) resultCount.textContent = "Aucun produit trouvé";
    else if (list.length === 1) resultCount.textContent = "1 produit trouvé";
    else resultCount.textContent = list.length + " produits trouvés";
}

/* ============================
   PANIER
============================ */
let cart = [];

const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalDisplay = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp-btn");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("close-cart");

/* Ouvrir / fermer panier */
document.querySelector(".cart-icon")?.addEventListener("click", () => {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
});

closeCart?.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
});

overlay?.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
});

/* Ajouter au panier */
function addToCart(i) {
    const product = products[i];
    const existing = cart.find(item => item.name === product.name);

    if (existing) existing.quantity++;
    else cart.push({ name: product.name, price: product.price, quantity: 1 });

    updateCart();
    showAddAlert();
}

/* Mise à jour panier */
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - ${item.price} KMF × ${item.quantity}
            <button onclick="increaseQuantity(${index})">+</button>
            <button onclick="decreaseQuantity(${index})">-</button>
        `;
        cartItems.appendChild(li);
    });

    totalDisplay.textContent = total;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    const message = encodeURIComponent(
        "Bonjour, je souhaite commander :\n\n" +
        cart.map(i => `- ${i.name} × ${i.quantity} (${i.price * i.quantity} KMF)`).join("\n") +
        `\n\nTotal : ${total} KMF`
    );

    whatsappBtn.href = `https://wa.me/2694484047?text=${message}`;
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

/* ============================
   NOTIFICATION AJOUT PANIER
============================ */
const addAlert = document.getElementById("add-alert");

function showAddAlert() {
    addAlert.classList.add("show");
    setTimeout(() => addAlert.classList.remove("show"), 2000);
}
