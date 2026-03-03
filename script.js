/* ============================
   ONGLET NAVIGATION
============================ */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // onglet actif
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // contenu actif
        tabContents.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add("active");
    });
});

/* ============================
   OUVERTURE DIRECTE PRODUITS
============================ */
function openProduits() {
    const btnProduits = document.querySelector('[data-tab="produits"]');
    if (btnProduits) btnProduits.click();
}

/* ============================
   SLIDER
============================ */
let currentSlide = 0;
const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function updateSlider() {
    if (!slidesContainer || slides.length === 0) return;
    currentSlide = (currentSlide + slides.length) % slides.length;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        currentSlide++;
        updateSlider();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        currentSlide--;
        updateSlider();
    });
}

// auto défilement
if (slides.length > 0) {
    setInterval(() => {
        currentSlide++;
        updateSlider();
    }, 4000);
}

/* ============================
   PANIER
============================ */
let cart = [];
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cart-count");
const closeCartBtn = document.getElementById("close-cart");
const cartIcon = document.querySelector(".cart-icon");

function openCart() {
    if (cartPanel) cartPanel.classList.add("open");
    if (overlay) overlay.classList.add("show");
}

function closeCart() {
    if (cartPanel) cartPanel.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
}

if (cartIcon) cartIcon.addEventListener("click", openCart);
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (overlay) overlay.addEventListener("click", closeCart);

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");
    if (!cartItems || !totalElement || !cartCount) return;

    cartItems.innerHTML = "";

    let total = 0;
    let qty = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        qty += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - ${item.price} KMF × ${item.quantity}
            <div>
                <button onclick="changeQty('${item.name}', 1)">+</button>
                <button onclick="changeQty('${item.name}', -1)">-</button>
            </div>
        `;
        cartItems.appendChild(li);
    });

    totalElement.textContent = total;
    cartCount.textContent = qty;
}

function changeQty(name, delta) {
    const item = cart.find(p => p.name === name);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.name !== name);
    }
    updateCart();
}

/* ============================
   MENU HAMBURGER / MOBILE
============================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const closeMobile = document.querySelector(".close-mobile");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        mobileMenu.classList.add("open");
    });
}

if (closeMobile && mobileMenu && hamburger) {
    closeMobile.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
    });
}

mobileLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${btn.dataset.tab}"]`);
        if (tabBtn) tabBtn.click();
        if (hamburger) hamburger.classList.remove("open");
        if (mobileMenu) mobileMenu.classList.remove("open");
    });
});

/* ============================
   RECHERCHE PRODUITS (optionnel)
============================ */
const searchInput = document.getElementById("search-input");
const resultCount = document.getElementById("result-count");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        const products = document.querySelectorAll(".product");
        let count = 0;

        products.forEach(p => {
            const name = p.querySelector("h4")?.textContent.toLowerCase() || "";
            if (name.includes(term)) {
                p.style.display = "block";
                count++;
            } else {
                p.style.display = "none";
            }
        });

        if (resultCount) resultCount.textContent = `${count} résultat(s)`;
    });
}

/* ============================
   TRI PRODUITS (optionnel)
============================ */
const sortSelect = document.getElementById("sort-select");

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        const products = Array.from(document.querySelectorAll(".product"));
        const container = document.getElementById("product-list");
        if (!container) return;

        const value = sortSelect.value;

        products.sort((a, b) => {
            const nameA = a.querySelector("h4")?.textContent || "";
            const nameB = b.querySelector("h4")?.textContent || "";
            const priceA = parseInt(a.dataset.price || "0");
            const priceB = parseInt(b.dataset.price || "0");

            if (value === "price-asc") return priceA - priceB;
            if (value === "price-desc") return priceB - priceA;
            if (value === "az") return nameA.localeCompare(nameB);
            if (value === "za") return nameB.localeCompare(nameA);
            return 0;
        });

        container.innerHTML = "";
        products.forEach(p => container.appendChild(p));
    });
}
