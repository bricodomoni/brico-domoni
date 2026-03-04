document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LISTE DES PRODUITS ---
    const produits = [
        { id: 1, nom: "Brouette Renforcée", prix: 25000, image: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de Chantier", prix: 7500, image: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox Cuisine", prix: 45000, image: "Images/AST187429-XL.jpg" }
    ];

    const productList = document.getElementById('product-list');
    if (productList) {
        produits.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${prod.image}" alt="${prod.nom}">
                <h4>${prod.nom}</h4>
                <p class="price">${prod.prix.toLocaleString()} KMF</p>
                <button class="tab-btn" style="width:100%; margin-top:10px;">Ajouter</button>
            `;
            productList.appendChild(card);
        });
    }

    // --- 2. CHANGEMENT D'ONGLETS ---
    const buttons = document.querySelectorAll('.tab-btn, .mobile-link');
    const sections = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            if(!target) return;

            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) targetSection.classList.add('active');
            
            // Fermer le menu mobile
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.style.right = '-300px';
        });
    });

    // --- 3. SLIDER ---
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slide');
    let index = 0;

    if (slides && images.length > 0) {
        document.querySelector('.next').onclick = () => {
            index = (index + 1) % images.length;
            slides.style.transform = `translateX(${-index * 100}%)`;
        };
        document.querySelector('.prev').onclick = () => {
            index = (index - 1 + images.length) % images.length;
            slides.style.transform = `translateX(${-index * 100}%)`;
        };
    }

    // --- 4. PANIER ---
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
});
