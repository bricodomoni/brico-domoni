document.addEventListener('DOMContentLoaded', () => {
    let panier = [];
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    // --- 1. AFFICHAGE DES PRODUITS ---
    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `
                <img src="${p.img}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            container.appendChild(div);
        });
    }

    // --- 2. LOGIQUE DU PANIER (FONCTIONS GLOBALES) ---
    window.ajouter = (id) => {
        const prod = produits.find(p => p.id === id);
        const dejaDansPanier = panier.find(item => item.id === id);

        if (dejaDansPanier) {
            dejaDansPanier.qty++;
        } else {
            panier.push({ ...prod, qty: 1 });
        }

        majPanier();
        alerte();
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('cart-overlay').classList.add('show');
    };

    window.modifierQty = (id, change) => {
        const item = panier.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) panier = panier.filter(i => i.id !== id);
            majPanier();
        }
    };

    function majPanier() {
        const liste = document.getElementById('cart-items-list');
        const totalHtml = document.getElementById('total-price');
        if (!liste || !totalHtml) return;

        liste.innerHTML = "";
        let total = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item'; // Utilise la classe CSS pour le style
            div.innerHTML = `
                <div style="flex:1">
                    <strong>${item.nom}</strong><br>
                    <small>${item.prix.toLocaleString()} KMF</small>
                </div>
                <div>
                    <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                    <span style="margin:0 10px">${item.qty}</span>
                    <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                </div>
            `;
            liste.appendChild(div);
        });
        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    function alerte() {
        const t = document.getElementById('toast-notification');
        if (t) {
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2500);
        }
    }

    // --- 3. SLIDER AUTOMATIQUE ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // --- 4. NAVIGATION PAR ONGLETS ---
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            const target = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            tab.classList.add('active');
        };
    });

    // --- 5. FERMETURE DU PANIER ---
    const closeBtn = document.getElementById('close-cart');
    const overlay = document.getElementById('cart-overlay');
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('cart-sidebar').classList.remove('open');
            overlay.classList.remove('show');
        };
    }
    if (overlay) {
        overlay.onclick = () => {
            document.getElementById('cart-sidebar').classList.remove('open');
            overlay.classList.remove('show');
        };
    }
});
