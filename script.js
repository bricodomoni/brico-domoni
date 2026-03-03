/* ============================
   ONGLET NAVIGATION
============================ */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        tabContents.forEach(c => c.classList.remove("active"));
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

/* ============================
   OUVERTURE DIRECTE PRODUITS
============================ */
function openProduits() {
    document.querySelector('[data-tab="produits"]').click();
}

/* ============================
   SLIDER (REMONTÉ EN HAUT)
============================ */
let currentSlide = 0;

function updateSlider() {
    const slides = document.querySelectorAll(".slide");
    const sliderContainer = document.querySelector(".slides");
    currentSlide = (currentSlide + slides.length) % slides.length;
    sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.querySelector(".next")?.addEventListener("click", () => {
    currentSlide++;
    updateSlider();
});

document.querySelector(".prev")?.addEventListener("click", () => {
    currentSlide--;
    updateSlider();
});

setInterval(() => {
    currentSlide++;
    updateSlider();
}, 4000);

/* ============================
   PANIER
============================ */
let cart = [];
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cart-count");

function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}

document.querySelector(".cart-icon").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");
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
   MENU HAMBURGER
============================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const closeMobile = document.querySelector(".close-mobile");
const mobileLinks = document.querySelectorAll(".mobile-link");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.add("open");
});

closeMobile.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
});

mobileLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(`[data-tab="${btn.dataset.tab}"]`).click();
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
    });
});

/* ============================
   RECHERCHE PRODUITS
============================ */
const searchInput = document.getElementById("search-input");
const productList = document.getElementById("product-list");
const resultCount = document.getElementById("result-count");

searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const products = document.querySelectorAll(".product");

    let count = 0;

    products.forEach(p => {
        const name = p.querySelector("h4").textContent.toLowerCase();
        if (name.includes(term)) {
            p.style.display = "block";
            count++;
        } else {
            p.style.display = "none";
        }
    });

    resultCount.textContent = `${count} résultat(s)`;
});

/* ============================
   TRI PRODUITS
============================ */
const sortSelect = document.getElementById("sort-select");

sortSelect?.addEventListener("change", () => {
    const products = Array.from(document.querySelectorAll(".product"));
    const container = document.getElementById("product-list");
    const value = sortSelect.value;

    products.sort((a, b) => {
        const nameA = a.querySelector("h4").textContent;
        const nameB = b.querySelector("h4").textContent;
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);

        if (value === "price-asc") return priceA - priceB;
        if (value === "price-desc") return priceB - priceA;
        if (value === "az") return nameA.localeCompare(nameB);
        if (value === "za") return nameB.localeCompare(nameA);
        return 0;
    });

    container.innerHTML = "";
    products.forEach(p => container.appendChild(p));
});
