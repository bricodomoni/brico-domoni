/* SLIDER */
let currentSlide = 0;
const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");

function updateSlider() {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.querySelector(".next").addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
});

document.querySelector(".prev").addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
});

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}, 4000);

/* NAVIGATION ENTRE ONGLET */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        tabContents.forEach(c => c.classList.remove("active"));
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add("active");

        if (btn.dataset.tab === "accueil") {
            currentSlide = 0;
            updateSlider();
        }

        mobileMenu.classList.remove("open");
    });
});

/* MENU MOBILE */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");
const closeMobile = document.querySelector(".close-mobile");

hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

closeMobile.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
});

mobileLinks.forEach(btn => {
    btn.addEventListener("click", () => {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${btn.dataset.tab}"]`);
        if (tabBtn) tabBtn.click();
        mobileMenu.classList.remove("open");
    });
});

/* PANIER */
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");

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
