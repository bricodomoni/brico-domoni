document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CHANGEMENT D'ONGLETS
    const buttons = document.querySelectorAll('.tab-btn, .mobile-link');
    const sections = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Fermer le menu mobile si ouvert
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.style.right = '-280px';
            }
        });
    });

    // 2. SLIDER
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slide');
    let index = 0; // "soit l'indice" devient "let index"

    if (slides && images.length > 0) {
        document.querySelector('.next').onclick = () => {
            index = (index + 1) % images.length; // "longueur" devient "length"
            slides.style.transform = `translateX(${-index * 100}%)`;
        };

        document.querySelector('.prev').onclick = () => {
            index = (index - 1 + images.length) % images.length;
            slides.style.transform = `translateX(${-index * 100}%)`;
        };
    }

    // 3. PANIER
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');

    const openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
        openCartBtn.onclick = () => {
            cartPanel.classList.add('open');
            overlay.classList.add('show');
        };
    }

    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.onclick = () => {
            cartPanel.classList.remove('open');
            overlay.classList.remove('show');
        };
    }

    // 4. BOUTON HERO
    const heroBtn = document.getElementById('go-to-products');
    if (heroBtn) {
        heroBtn.onclick = () => {
            const productTab = document.querySelector('[data-tab="produits"]');
            if (productTab) productTab.click();
        };
    }
});
