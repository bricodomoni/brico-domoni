document.addEventListener('DOMContentLoaded', () => {
    const produits = [
        { id: 1, nom: "Brouette Renforcée", prix: 25000, image: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de Chantier", prix: 7500, image: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox Cuisine", prix: 45000, image: "Images/AST187429-XL.jpg" }
    ];

    const container = document.getElementById('product-list');

    if (container) {
        container.innerHTML = ""; // On nettoie avant d'afficher
        produits.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `
                <img src="${p.image}" alt="${p.nom}">
                <h4>${p.nom}</h4>
                <p style="font-weight:bold; color:#ff9800;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn" style="width:100%">Ajouter</button>
            `;
            container.appendChild(div);
        });
        console.log("Produits chargés : " + produits.length);
    }
});

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
