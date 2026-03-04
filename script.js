document.addEventListener('DOMContentLoaded', () => {
    
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    let panier = [];

    // AFFICHAGE PRODUITS
    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p style="color:#ff9800; font-size:1.2rem; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn add-btn" data-id="${p.id}" style="width:100%">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // MISE À JOUR DU PANIER (AFFICHAGE ET CALCULS)
    function updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCountBadge = document.querySelector('.cart-count');
        
        cartItems.innerHTML = panier.length === 0 ? "<p>Votre panier est vide</p>" : "";
        let total = 0;
        let totalArticles = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            totalArticles += item.qty;

            const div = document.createElement('div');
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.padding = "10px 0";
            div.style.borderBottom = "1px solid #eee";
            
            div.innerHTML = `
                <div>
                    <strong>${item.nom}</strong><br>
                    <small>${item.prix.toLocaleString()} KMF</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            `;
            cartItems.appendChild(div);
        });

        cartTotal.innerText = total.toLocaleString() + " KMF";
        cartCountBadge.innerText = totalArticles;
    }

    // FONCTION POUR AJOUTER
    window.addToCart = (id) => {
        const produit = produits.find(p => p.id === id);
        const articleExistant = panier.find(item => item.id === id);

        if (articleExistant) {
            articleExistant.qty += 1;
        } else {
            panier.push({ ...produit, qty: 1 });
        }
        
        updateCartUI();
        document.getElementById('cart-panel').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };

    // FONCTION POUR CHANGER LA QUANTITÉ (+ ou -)
    window.changeQty = (id, delta) => {
        const article = panier.find(item => item.id === id);
        if (article) {
            article.qty += delta;
            if (article.qty <= 0) {
                panier = panier.filter(item => item.id !== id); // Supprime si 0
            }
        }
        updateCartUI();
    };

    // ÉCOUTEUR CLIC AJOUT
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        }
    });

    // OUVRIR / FERMER LE PANIER
    document.getElementById('open-cart-btn').onclick = () => {
        document.getElementById('cart-panel').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-panel').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    };
    document.getElementById('overlay').onclick = () => {
        document.getElementById('cart-panel').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    };

    // NAVIGATION ONGLETS
    const navBtns = document.querySelectorAll('.tab-btn');
    navBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-tab');
            if(!target) return;
            document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
            navBtns.forEach(b => b.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        };
    });
});
