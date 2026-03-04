/* ============================
   VARIABLES
============================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");

const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cart-count");

const closeMobile = document.querySelector(".close-mobile");
const mobileLinks = document.querySelectorAll(".mobile-link");

let currentSlide = 0;
let sliderInterval = null;

/* ============================
   PRODUITS
============================ */
const products = [
    { id: 1, name: "Marteau 500g", price: 2500, category: "Outils", image: "Images/Brouette.jpg" },
    { id: 2, name: "Tournevis plat", price: 1000, category: "Outils", image: "Images/Brouette.jpg" },
    { id: 3, name: "Tournevis cruciforme", price: 1000, category: "Outils", image: "Images/Brouette.jpg" },
    { id: 4, name: "Clé anglaise", price: 3000, category: "Outils", image: "Images/Brouette.jpg" },
    { id: 5, name: "Scie manuelle", price: 4500, category: "Outils", image: "Images/Brouette.jpg" },

    { id: 6, name: "Ampoule LED 12W", price: 800, category: "Électricité", image: "Images/9641602024.jpg" },
    { id: 7, name: "Rallonge 5m", price: 3500, category: "Électricité", image: "Images/9641602024.jpg" },
    { id: 8, name: "Multiprise 4 ports", price: 2500, category: "Électricité", image: "Images/9641602024.jpg" },
    { id: 9, name: "Interrupteur mural", price: 1200, category: "Électricité", image: "Images/9641602024.jpg" },

    { id: 10, name: "Robinet inox", price: 6000, category: "Plomberie", image: "Images/AST187429-XL.jpg" },
    { id: 11, name: "Tuyau PVC 1m", price: 1000, category: "Plomberie", image: "Images/AST187429-XL.jpg" },
    { id: 12, name: "Flexible douche", price: 3000, category: "Plomberie", image: "Images/AST187429-XL.jpg" },

    { id: 13, name: "Balai", price: 1500, category: "Maison", image: "Images/Brouette.jpg" },
    { id: 14, name: "Seau 10L", price: 1200, category: "Maison", image: "Images/Brouette.jpg" },
    { id: 15, name: "Éponge", price: 300, category: "Maison", image: "Images/Brouette.jpg" },

    { id: 16, name: "Ruban adhésif", price: 500, category: "Accessoires", image: "Images/9641602024.jpg" },
    { id: 17, name: "Colle forte", price: 1000, category: "Accessoires", image: "Images/9641602024.jpg" },
    { id: 18, name: "Gants de travail", price: 1800, category: "Accessoires", image: "Images/9641602024.jpg" }
];

/* ============================
   AFFICHAGE PRODUITS
============================ */
const productList = document.getElementById("product-list");
const resultCount = document.getElementById("result-count");

function displayProducts(list) {
    productList.innerHTML = "";

    list.forEach(p => {
        const card = document.createElement("div");
        card.className = "product";

        card.innerHTML = `
            <img src="${p.image}" class="product-img">
            <h4>${p.name}</h4>
            <p class="price">${p.price} KMF</p>
            <button class="add-btn" onclick="addToCart(${p.id})">Ajouter au panier</button>
        `;

        productList.appendChild(card);
    });

    resultCount.textContent = `${list.length} produit(s) trouvé(s)`;
}

displayProducts(products);

/* ============================
   RECHERCHE
============================ */
document.getElementById("search-input").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    displayProducts(filtered);
});

/* ============================
   TRI
============================ */
document.getElementById("sort-select").addEventListener("change", e => {
    let sorted = [...products];

    switch (e.target.value) {
        case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "az":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "za":
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    displayProducts(sorted);
});

/* ============================
   PANIER
============================ */
let cart = [];

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);

    cartCount.textContent = cart.length;

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

/* OUVERTURE / FERMETURE PANIER */
function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}

document.querySelector(".cart-icon")?.addEventListener("click", openCart);
document.getElementById("close-cart")?.addEventListener("click", closeCart);
overlay?.addEventListener("click", closeCart);

/* ============================
   ONGLET NAVIGATION
============================ */
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        tabContents.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add("active");

        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");

        if (btn.dataset.tab === "accueil") {
            startSlider();
        } else {
            stopSlider();
        }
    });
});

/* ============================
   SLIDER
============================ */
function updateSlider() {
    if (!slidesContainer || slides.length === 0) return;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

document.querySelector(".next")?.addEventListener("click", nextSlide);
document.querySelector(".prev")?.addEventListener("click", prevSlide);

function startSlider() {
    stopSlider();
    sliderInterval = setInterval(nextSlide, 4500);
}

function stopSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
}

if (document.getElementById("accueil").classList.contains("active")) {
    startSlider();
}

/* ============================
   MENU MOBILE
============================ */
hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
});

closeMobile?.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
});

mobileLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${btn.dataset.tab}"]`);
        if (tabBtn) tabBtn.click();
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
    });
});

/* ============================
   ACCÈS DIRECT AUX PRODUITS
============================ */
function openProduits() {
    const btn = document.querySelector('[data-tab="produits"]');
    if (btn) btn.click();
}
