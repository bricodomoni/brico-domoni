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
let cart = [];

/* ============================
   ONGLET NAVIGATION
============================ */
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Active bouton
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Active contenu
        tabContents.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add("active");

        // Ferme menu mobile
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");

        // Remet slider à zéro si on revient sur Accueil
        if (btn.dataset.tab === "accueil") {
            currentSlide = 0;
            updateSlider();
        }
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
   SLIDER FLUIDE + OPTIMISÉ
============================ */
function updateSlider() {
    if (!slidesContainer || slides.length === 0) return;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.querySelector(".next")?.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
});

document.querySelector(".prev")?.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
});

// Auto-slide
if (slides.length > 0) {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 4500);
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
    });
});
