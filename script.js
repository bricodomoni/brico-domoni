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
   NAVIGATION ENTRE ONGLET
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

/* Démarre le slider si Accueil est actif */
if (document.getElementById("accueil").classList.contains("active")) {
    startSlider();
}

/* ============================
   OUVERTURE DIRECTE PRODUITS
============================ */
function openProduits() {
    const btn = document.querySelector('[data-tab="produits"]');
    if (btn) btn.click();
}

/* ============================
   PANIER
============================ */
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
