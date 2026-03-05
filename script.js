document.addEventListener('DOMContentLoaded', () => {
    let panier = [];
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    // 1. GÉNÉRATION DES PRODUITS
    const productList = document.getElementById('product-list');
    if (productList) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouterAuPanier(${p.id})">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }

    // 2. LOGIQUE DU PANIER
    window.ajouterAuPanier = (id) => {
        const produit = produits.find(p => p.id === id);
        const itemExistant = panier.find(item => item.id === id);

        if (itemExistant) {
            itemExistant.qty++;
        } else {
            panier.push({ ...produit, qty: 1 });
        }

        majPanier();
        afficherToast();
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('cart-overlay').classList.add('show');
    };

    window.modifierQty = (id, delta) => {
        const item = panier.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) panier = panier.filter(i => i.id !== id);
            majPanier();
        }
    };

    function majPanier() {
        const listeHtml = document.getElementById('cart-items-list');
        const totalHtml = document.getElementById('total-price');
        listeHtml.innerHTML = "";
        let total = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div style="flex:1">
                    <strong>${item.nom}</strong><br>
                    ${item.prix.toLocaleString()} KMF
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                </div>
            `;
            listeHtml.appendChild(div);
        });
        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    function afficherToast() {
        const toast = document.getElementById('toast-notification');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // 3. NAVIGATION & SLIDER
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            const target = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            tab.classList.add('active');
        }
    });

    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('show');
    };
});
