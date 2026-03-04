document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LISTE DES PRODUITS
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    const productList = document.getElementById('product-list');

    if (productList) {
        productList.innerHTML = ""; // Vide le texte "Bientôt disponible"
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}" onerror="this.src='logo.jpg'">
                <h4>${p.nom}</h4>
                <p style="color:#ff9800; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn" style="width:100%">Ajouter</button>
            `;
            productList.appendChild(card);
        });
    }

    // 2. GESTION DES ONGLETS (Correction pour afficher les produits)
    const buttons = document.querySelectorAll('.tab-btn, .mobile-link');
    const sections = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            // On cache tout
            sections.forEach(s => s.classList.remove('active'));
            buttons.forEach(b => b.classList.remove('active'));

            // On affiche la cible
            document.getElementById(targetId).classList.add('active');
            btn.classList.add('active');
        });
    });

    // 3. PANIER
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');

    document.getElementById('open-cart-btn').onclick = () => {
        cartPanel.classList.add('open');
        overlay.classList.add('show');
    };
});
