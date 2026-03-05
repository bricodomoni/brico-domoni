document.addEventListener('DOMContentLoaded', () => {
    let panier = [];
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    // --- AFFICHAGE DES PRODUITS ---
    const productList = document.getElementById('product-list');
    if (productList) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-btn" onclick="ajouterAuPanier(${p.id})">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }

    // --- FONCTION AJOUTER ---
    window.ajouterAuPanier = (id) => {
        const produit = produits.find(p => p.id === id);
        const existant = panier.find(item => item.id === id);

        if (existant) {
            existant.quantite++;
        } else {
            panier.push({ ...produit, quantite: 1 });
        }

        afficherNotification();
        mettreAJourPanier();
        ouvrirPanier();
    };

    function afficherNotification() {
        const toast = document.getElementById('toast-notification');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function mettreAJourPanier() {
        const content = document.getElementById('cart-content');
        const totalEl = document.getElementById('cart-total-price');
        content.innerHTML = "";
        let total = 0;

        panier.forEach(item => {
            total += item.prix * item.quantite;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}">
                <div class="cart-item-info">
                    <h4>${item.nom}</h4>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                        <span>${item.quantite}</span>
                        <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <span>${(item.prix * item.quantite).toLocaleString()} KMF</span>
            `;
            content.appendChild(div);
        });
        totalEl.innerText = total.toLocaleString() + " KMF";
    }

    window.modifierQty = (id, delta) => {
        const item = panier.find(i => i.id === id);
        if (item) {
            item.quantite += delta;
            if (item.quantite <= 0) {
                panier = panier.filter(i => i.id !== id);
            }
            mettreAJourPanier();
        }
    };

    // --- OUVRIR/FERMER ---
    function ouvrirPanier() {
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('cart-overlay').classList.add('show');
    }
    
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('show');
    };
});
