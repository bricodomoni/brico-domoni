document.addEventListener('DOMContentLoaded', () => {
    
    // --- GESTION DES ONGLETS (TABS) ---
    const buttons = document.querySelectorAll('.tab-btn, .mobile-link');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            // Retirer 'active' de tous les boutons et cacher les contenus
            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');

            // Activer le bon bouton et afficher le bon contenu
            btn.classList.add('active');
            document.getElementById(target).style.display = 'block';
            
            // Fermer le menu mobile si on clique sur un lien
            document.getElementById('mobile-menu').classList.remove('open');
        });
    });

    // --- GESTION DU SLIDER ---
    const slidesContainer = document.querySelector('.slides');
    const images = document.querySelectorAll('.slide');
    let index = 0;

    document.querySelector('.next').addEventListener('click', () => {
        index = (index + 1) % images.length;
        updateSlider();
    });

    document.querySelector('.prev').addEventListener('click', () => {
        index = (index - 1 + images.length) % images.length;
        updateSlider();
    });

    function updateSlider() {
        slidesContainer.style.transform = `translateX(${-index * 100}%)`;
    }

    // --- MENU MOBILE ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobile = document.getElementById('close-mobile');

    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMobile.addEventListener('click', () => mobileMenu.classList.remove('open'));

    // --- PANIER (CART) ---
    const cartBtn = document.getElementById('open-cart-btn');
    const cartPanel = document.getElementById('cart-panel');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');

    cartBtn.addEventListener('click', () => {
        cartPanel.classList.add('open');
        overlay.classList.add('show');
    });

    [closeCart, overlay].forEach(el => {
        el.addEventListener('click', () => {
            cartPanel.classList.remove('open');
            overlay.classList.remove('show');
        });
    });

    // --- BOUTON HERO ---
    document.getElementById('go-to-products').addEventListener('click', () => {
        document.querySelector('[data-tab="produits"]').click();
    });
});
