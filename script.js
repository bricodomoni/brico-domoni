/* ============================
   ONGLET NAVIGATION
============================ */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Onglet actif
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Contenu actif
        tabContents.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add("active");

        // Fermer menu mobile
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
    });
});

/* ============================
   OUVERTURE DIRECTE PRODUITS
============================ */
function openProduits() {
    const btn = document.querySelector('[data-tab="produits"]');
    if (btn) btn.click();
}

/* ============================
   SLIDER
============================ */
let currentSlide = 0;
const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");

function updateSlider() {
    if (!slidesContainer || slides.length === 0) return;
    currentSlide = (currentSlide + slides.length) % slides.length;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.querySelector(".next")?.addEventListener("click", () => {
    currentSlide++;
    updateSlider();
});

document.querySelector(".prev")?.addEventListener("click", () => {
    currentSlide--;
    updateSlider();
});

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
   MENU MOBILE
============================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const closeMobile = document.querySelector(".close-mobile");
const mobileLinks = document.querySelectorAll(".mobile-link");

hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.add("open");
});

closeMobile?.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
});

mobileLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${btn.dataset.tab}"]`);
        if (tabBtn) tabBtn.click();
    });
});
