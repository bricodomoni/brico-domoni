document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DES ONGLETS (Navigation) ---
    const btns = document.querySelectorAll('.tab-btn, .mobile-link');
    const sections = document.querySelectorAll('.tab-content');

    btns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-tab');
            btns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        };
    });

    // --- 2. LOGIQUE DU SLIDER ---
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    let index = 0;

    if(document.querySelector('.next')) {
        document.querySelector('.next').onclick = () => {
            index = (index + 1) % totalSlides;
            slides.style.transform = `translateX(${-index * 100}%)`;
        };
        document.querySelector('.prev').onclick = () => {
            index = (index - 1 + totalSlides) % totalSlides;
            slides.style.transform = `translateX(${-index * 100}%)`;
        };
    }

    // --- 3. OUVERTURE DU PANIER ---
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart');

    if(openCartBtn) {
        openCartBtn.onclick = () => {
            cartPanel.classList.add('open');
            overlay.classList.add('show');
        };
    }

    if(closeCartBtn) {
        closeCartBtn.onclick = () => {
            cartPanel.classList.remove('open');
            overlay.classList.remove('show');
        };
    }

    // --- 4. AFFICHAGE AUTOMATIQUE DES PRODUITS ---
    const produits = [
        { name: "Brouette Robuste", price: 25000, img: "Images/Brouette.jpg" },
        { name: "Outil de Coupe", price: 3500, img: "Images/9641602024.jpg" },
        { name: "Évier Moderne", price: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    const grid = document.getElementById('product-list');
    if(grid) {
        produits.forEach(p => {
            grid.innerHTML += `
                <div style="background:white; padding:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); text-align:center;">
                    <img src="${p.img}" alt="${p.name}" style="width:100%; height:150px; object-fit:contain;">
                    <h3 style="font-size:1rem; margin:10px 0;">${p.name}</h3>
                    <p style="color:#ff9800; font-weight:bold;">${p.price.toLocaleString()} KMF</p>
                    <button style="background:#0A1F44; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Ajouter</button>
                </div>
            `;
        });
    }

    // BOUTON "VOIR NOS PRODUITS" SUR L'ACCUEIL
    const heroBtn = document.getElementById('go-to-products');
    if(heroBtn) {
        heroBtn.onclick = () => {
            document.querySelector('[data-tab="produits"]').click();
        };
    }
});
