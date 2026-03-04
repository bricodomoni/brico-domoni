document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DONNÉES DES PRODUITS
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    let panier = [];

    // 2. AFFICHAGE DES PRODUITS
    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p style="color:#ff9800; font-size:1.2rem; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn add-to-cart-btn" data-id="${p.id}" style="width:100%">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // 3. FONCTIONS DU PANIER
    function updateCartUI() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotal = document.getElementById('cart-total');
        const cartCountBadge = document.querySelector('.cart-count');
        
        cartItemsContainer.innerHTML = panier.length === 0 ? "<p>Votre panier est vide</p>" : "";
        let total = 0;
        let totalItems = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            totalItems += item.qty;

            const itemDiv = document.createElement('div');
            itemDiv.style.display = "flex";
            itemDiv.style.justifyContent = "space-between";
            itemDiv.style.alignItems = "center";
            itemDiv.style.marginBottom = "15px";
            itemDiv.innerHTML = `
                <div>
                    <span style="font-weight:bold;">${item.nom}</span><br>
                    <small>${item.prix.toLocaleString()} KMF</small>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" data-id="${item.id}" data-action="minus">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        cartTotal.innerText = total.toLocaleString() + " KMF";
        cartCountBadge.innerText = totalItems;
    }

    // Gestion des clics (Ajout et Quantité)
    document.addEventListener('click', (e) => {
        // Ajouter au panier
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = parseInt(e.target.dataset.id);
            const produit = produits.find(p => p.id === id);
            const existant = panier.find(item => item.id === id);

            if (existant) {
                existant.qty++;
            } else {
                panier.push({ ...produit, qty: 1 });
            }
            updateCartUI();
            document.getElementById('cart-panel').classList.add('open');
            document.getElementById('overlay').classList.add('show');
        }

        // Modifier quantité (+ ou -)
        if (e.target.classList.contains('qty-btn')) {
            const id = parseInt(e.target.dataset.id);
            const action = e.target.dataset.action;
            const article = panier.find(item => item.id === id);

            if (action === 'plus') {
                article.qty++;
            } else if (action === 'minus') {
                article.qty--;
                if (article.qty <= 0) {
                    panier = panier.filter(item => item.id !== id);
                }
            }
            updateCartUI();
        }
    });

    // 4. OUVERTURE / FERMETURE
    document.getElementById('open-cart-btn').onclick = () => {
        document.getElementById('cart-panel').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-panel').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    };

    // 5. NAVIGATION ONGLETS
    const navBtns = document.querySelectorAll('.tab-btn');
    navBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
            navBtns.forEach(b => b.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        };
    });

    // 6. COMMANDE WHATSAPP
    document.getElementById('whatsapp-order-btn').onclick = () => {
        if (panier.length === 0) return alert("Votre panier est vide !");
        
        let message = "Bonjour Brico Domoni, je souhaite commander :\n\n";
        panier.forEach(item => {
            message += `- ${item.nom} (x${item.qty}) : ${(item.prix * item.qty).toLocaleString()} KMF\n`;
        });
        message += `\n*Total : ${document.getElementById('cart-total').innerText}*`;
        
        const phone = "2693330000"; // CHANGE LE NUMÉRO ICI
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };
});
