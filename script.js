document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LISTE DES PRODUITS
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    const container = document.getElementById('product-list');
    if (container) {
        container.innerHTML = ""; // Nettoie le texte par défaut
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p style="color:#ff9800; font-size:1.2rem; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn" style="width:100%">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // 2. OUVERTURE / FERMETURE DU PANIER
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('open-cart-btn');
    const closeBtn = document.getElementById('close-cart');

    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            cartPanel.classList.add('open');
            overlay.classList.add('show');
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            cartPanel.classList.remove('open');
            overlay.classList.remove('show');
        };
    }

    overlay.onclick = () => {
        cartPanel.classList.remove('open');
        overlay.classList.remove('show');
    };

    // 3. NAVIGATION ONGLETS
    const buttons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            if (!target) return;

            sections.forEach(s => s.classList.remove('active'));
            buttons.forEach(b => b.classList.remove('active'));

            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        });
    });
});
