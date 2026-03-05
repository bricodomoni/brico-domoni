document.addEventListener('DOMContentLoaded', () => {
    // --- 0. VARIABLES GLOBALES ---
    let panier = []; 

    // --- 1. BASE DE DONNÉES DES PRODUITS ---
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    // --- 2. AFFICHAGE DYNAMIQUE ---
    const container = document.getElementById('product-list');

    function afficherProduits() {
        if (!container) return; 
        container.innerHTML = ""; 
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // --- 3. LOGIQUE DU PANIER ---
    window.ajouter = (id) => {
        const prod = produits.find(p => p.id === id);
        const existant = panier.find(item => item.id === id);

        if (existant) {
            existant.qty++;
        } else {
            panier.push({ ...prod, qty: 1 });
        }

        majPanier();
        showToast();
        openCart(); // Déclenche l'ouverture visuelle (Sidebar + Overlay)
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
        if(!liste || !totalHtml) return;

        liste.innerHTML = "";
        let total = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item-row'; 
            div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${item.nom}</strong><br>
                        <small>${item.prix.toLocaleString()} KMF</small>
                    </div>
                    <div>
                        <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
            liste.appendChild(div);
        });
        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    // --- 4. INTERFACE (SIDEBAR & OVERLAY) ---
    function showToast() {
        const toast = document.getElementById('toast-notification');
        if(toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    }

    function openCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar) sidebar.classList.add('open');
        if(overlay) overlay.classList.add('show');
    }

    const closeBtn = document.getElementById('close-cart');
    if(closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('cart-sidebar').classList.remove('open');
            document.getElementById('cart-overlay').classList.remove('show');
        };
    }

    // Fermer aussi en cliquant sur l'overlay sombre
    const overlay = document.getElementById('cart-overlay');
    if(overlay) {
        overlay.onclick = () => {
            document.getElementById('cart-sidebar').classList.remove('open');
            overlay.classList.remove('show');
        };
    }

    // --- 5. NAVIGATION & SLIDER ---
    const slides = document.querySelectorAll('.slide');
    let cur = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        if(slides[index]) slides[index].classList.add('active');
    }

    if (slides.length > 0) {
        const next = document.querySelector('.next');
        const prev = document.querySelector('.prev');
        
        if(next) next.onclick = () => {
            cur = (cur + 1) % slides.length;
            showSlide(cur);
        };
        if(prev) prev.onclick = () => {
            cur = (cur - 1 + slides.length) % slides.length;
            showSlide(cur);
        };
        
        setInterval(() => {
            cur = (cur + 1) % slides.length;
            showSlide(cur);
        }, 5000);
    }

    // Gestion des onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const targetEl = document.getElementById(target);
            if(targetEl) targetEl.classList.add('active');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    // --- 6. COMMANDE WHATSAPP ---
    const waBtn = document.getElementById('whatsapp-send');
    if(waBtn) {
        waBtn.onclick = () => {
            if (panier.length === 0) return alert("Votre panier est vide.");

            let message = "Bonjour BRICO DOMONI, voici ma commande :%0A";
            panier.forEach(item => {
                message += `- ${item.nom} (x${item.qty}) : ${(item.prix * item.qty).toLocaleString()} KMF%0A`;
            });

            const total = panier.reduce((t, i) => t + i.prix * i.qty, 0);
            message += `%0A*Total : ${total.toLocaleString()} KMF*`;

            const numero = "269334XXXX"; // REMPLACE PAR TON NUMÉRO ICI
            window.open(`https://wa.me/${numero}?text=${message}`, "_blank");
        };
    }

    // --- INITIALISATION FINALE ---
    afficherProduits();
});
