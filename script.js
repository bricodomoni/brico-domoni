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
            document.getElementById(target).classList.add('active');
            
            // Fermer le menu mobile si ouvert
            document.getElementById('mobile-menu').style.right = '-260px';
        });
    });

    // 2. SLIDER
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slide');
    let index = 0;

    document.querySelector('.next').onclick = () => {
        index = (index + 1) % images.length;
        slides.style.transform = `translateX(${-index * 100}%)`;
    };

    document.querySelector('.prev').onclick = () => {
        index = (index - 1 + images.length) % images.length;
        slides.style.transform = `translateX(${-index * 100}%)`;
    };

    // 3. PANIER
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');

    document.getElementById('open-cart-btn').onclick = () => {
        cartPanel.classList.add('open');
        overlay.classList.add('show');
    };

    document.getElementById('close-cart').onclick = () => {
        cartPanel.classList.remove('open');
        overlay.classList.remove('show');
    };

    // 4. BOUTON HERO
    document.getElementById('go-to-products').onclick = () => {
        document.querySelector('[data-tab="produits"]').click();
    };
});
