document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DONNÉES DES PRODUITS ---
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    let panier = [];

    // --- 2. AFFICHAGE AUTOMATIQUE DES PRODUITS ---
    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}" onerror="this.src='logo.jpg'">
                <h3>${p.nom}</h3>
                <p style="color:#ff9800; font-size:1.2rem; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn add-btn" data-id="${p.id}" style="width:100%">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // --- 3. LOGIQUE DU PANIER ---
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.querySelector('.cart-count');
        
        cartItems.innerHTML = panier.length === 0 ? "<p>Votre panier est vide</p>" : "";
        let total = 0;

        panier.forEach((item, index) => {
            total += item.prix;
            const div = document.createElement('div');
            div.style.padding = "10px 0";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `<strong>${item.nom}</strong> - ${item.prix.toLocaleString()} KMF`;
            cartItems.appendChild(div);
        });

        cartTotal.innerText = total.toLocaleString() + " KMF";
        cartCount.innerText = panier.length;
    }

    // Événement clic pour ajouter un produit
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const p = produits.find(prod => prod.id === id);
            panier.push(p);
            updateCart();
            // Ouvre le panier pour confirmer l'ajout
            document.getElementById('cart-panel').classList.add('open');
            document.getElementById('overlay').classList.add('show');
        }
    });

    // Ouvrir / Fermer le panier
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

    // --- 4. NAVIGATION ENTRE LES ONGLETS ---
    const navBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-tab');
            if(!target) return;
            
            sections.forEach(s => s.classList.remove('active'));
            navBtns.forEach(b => b.classList.remove('active'));
            
            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        };
    });

    // --- 5. LOGIQUE DU SLIDER (ACCUEIL) ---
    const slides = document.querySelector('.slides');
    const slideImages = document.querySelectorAll('.slide');
    let currentIndex = 0;

    if (slides && slideImages.length > 0) {
        document.querySelector('.next').onclick = () => {
            currentIndex = (currentIndex + 1) % slideImages.length;
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        document.querySelector('.prev').onclick = () => {
            currentIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
    }
});
