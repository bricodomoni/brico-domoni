document.addEventListener('DOMContentLoaded', () => {
    // 1. GESTION DU DIAPORAMA (SLIDER)
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(s => s.classList.remove('active'));
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        slides[currentSlide].classList.add('active');
    }

    // Initialisation
    if (slides.length > 0) slides[0].classList.add('active');

    if (nextBtn) nextBtn.onclick = () => showSlide(currentSlide + 1);
    if (prevBtn) prevBtn.onclick = () => showSlide(currentSlide - 1);

    // Défilement automatique toutes les 5 secondes
    setInterval(() => showSlide(currentSlide + 1), 5000);

    // 2. GESTION DES ONGLETS (TABS)
    const navBtns = document.querySelectorAll('.tab-btn');
    navBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            if (!target) return;
            document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
            navBtns.forEach(b => b.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        };
    });

    // 3. GESTION DU PANIER (OUVRIR/FERMER)
    const openCart = document.getElementById('open-cart-btn');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartPanel = document.getElementById('cart-panel');

    if (openCart) {
        openCart.onclick = () => {
            cartPanel.classList.add('open');
            overlay.classList.add('show');
        };
    }

    if (closeCart) {
        closeCart.onclick = () => {
            cartPanel.classList.remove('open');
            overlay.classList.remove('show');
        };
    }
});
