document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       1. BASE DE DONNÉES PRODUITS
    --------------------------*/
    const produits = [
        { id: 1, nom: "Adaptateur de Mandrin à pince", prix: 1000, img: "Images/mandrin.jpg", category: "outils" },
        { id: 2, nom: "Adaptateur prise électrique européen", prix: 500, img: "Images/adaptateur-eu.jpg", category: "electricite" },
        { id: 3, nom: "Adaptateur prise électrique TRAVELKING", prix: 500, img: "Images/travelking.jpg", category: "electricite" },
        { id: 4, nom: "Adaptateur prise Marken", prix: 750, img: "Images/marken.jpg", category: "electricite" },
        { id: 5, nom: "Adhésif silicone", prix: 2000, img: "Images/silicone.jpg", category: "divers" },
        { id: 6, nom: "Agrafe 1008J", prix: 2000, img: "Images/agrafe1008.jpg", category: "outils" },
        { id: 7, nom: "Agrafe 1010J", prix: 2000, img: "Images/agrafe1010.jpg", category: "outils" },
        { id: 8, nom: "Agrafe 1013J", prix: 2000, img: "Images/agrafe1013.jpg", category: "outils" },
        { id: 9, nom: "Agrafeuse pneumatique 1013J", prix: 25000, img: "Images/agrafeuse.jpg", category: "outils" },
        { id: 10, nom: "Ampoule Led 10w 230v", prix: 900, img: "Images/led10w.jpg", category: "electricite" },
        { id: 11, nom: "Ampoule Led 12w 12v", prix: 1600, img: "Images/led12w12v.jpg", category: "electricite" },
        { id: 12, nom: "Ampoule Led 12w 12v/85v", prix: 1350, img: "Images/led12w85v.jpg", category: "electricite" },
        { id: 13, nom: "Ampoule Led 18w 12v", prix: 1700, img: "Images/led18w12v.jpg", category: "electricite" },
        { id: 14, nom: "Ampoule Led 18w 12v/85v", prix: 1700, img: "Images/led18w85v.jpg", category: "electricite" },
        { id: 15, nom: "Ampoule Led 24w 12v/85v", prix: 2500, img: "Images/led24w.jpg", category: "electricite" },
        { id: 16, nom: "Ampoule Led 28w 230v", prix: 1500, img: "Images/led28w.jpg", category: "electricite" },
        { id: 17, nom: "Ampoule Led 5w 12v", prix: 850, img: "Images/led5w12v.jpg", category: "electricite" },
        { id: 18, nom: "Ampoule Led 5w 12v/85v", prix: 900, img: "Images/led5w85v.jpg", category: "electricite" },
        { id: 19, nom: "Ampoule Led 5w 230v", prix: 750, img: "Images/led5w230v.jpg", category: "electricite" },
        { id: 20, nom: "Ampoule Led 7w 12v", prix: 1000, img: "Images/led7w12v.jpg", category: "electricite" },
        { id: 21, nom: "Ampoule Led 7w 12v/85v", prix: 1000, img: "Images/led7w85v.jpg", category: "electricite" }
    ];

    /* -------------------------
       2. GESTION DU PANIER
    --------------------------*/
    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];
    majPanier();

    /* -------------------------
       3. AFFICHAGE & RECHERCHE
    --------------------------*/
    const productList = document.getElementById("product-list");

    function afficherProduits(liste) {
        if (!productList) return;
        productList.innerHTML = ""; 
        liste.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-category", p.category); 
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }

    afficherProduits(produits);

    // RECHERCHE AVEC GESTION DE LA CROIX (X)
    window.searchProducts = () => {
        const input = document.getElementById("search-input");
        const clearBtn = document.getElementById("clear-search");
        const query = input.value.toLowerCase();
        
        // Afficher/Cacher la croix d'effacement
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? "inline" : "none";
        }

        // Redirection vers onglet Articles si on commence à chercher
        const tabArticles = document.querySelector('[data-tab="produits"]');
        if (query.length > 0 && tabArticles && !tabArticles.classList.contains('active')) {
            tabArticles.click();
        }

        const filtered = produits.filter(p => 
            p.nom.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );

        afficherProduits(filtered);

        if (filtered.length === 0) {
            productList.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px; color:#666;">
                Aucun article ne correspond à "${query}"</div>`;
        }
    };

    // FONCTION POUR EFFACER LA RECHERCHE
    window.clearSearch = () => {
        const input = document.getElementById("search-input");
        input.value = "";
        input.focus();
        window.searchProducts(); // Relance l'affichage complet
    };

    window.filterProducts = (category, btnElement) => {
        const buttons = document.querySelectorAll('.cat-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');

        // Reset recherche quand on filtre par catégorie
        const input = document.getElementById("search-input");
        if(input) input.value = "";
        const clearBtn = document.getElementById("clear-search");
        if(clearBtn) clearBtn.style.display = "none";

        const filtered = category === 'all' ? produits : produits.filter(p => p.category === category);
        afficherProduits(filtered);
    };

    /* -------------------------
       4. LOGIQUE DU PANIER
    --------------------------*/
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
        animateBadge();
    };

    window.modifierQty = (id, change) => {
        const item = panier.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                panier = panier.filter(i => i.id !== id);
            }
            majPanier();
        }
    };

    function majPanier() {
        const list = document.getElementById("cart-items-list");
        const totalHtml = document.getElementById("total-price");
        const badge = document.getElementById("cart-count");
        const waBtn = document.getElementById("whatsapp-send");
        
        if (!list || !totalHtml) return;

        list.innerHTML = "";
        let total = 0;
        let nombreArticles = 0;

        if (panier.length === 0) {
            list.innerHTML = `<p style="text-align:center; color:#888; margin-top:50px;">Votre panier est vide.</p>`;
            if (waBtn) waBtn.innerHTML = "Commander sur WhatsApp";
        } else {
            panier.forEach(item => {
                const sousTotal = item.prix * item.qty;
                total += sousTotal;
                nombreArticles += item.qty;
                
                const div = document.createElement("div");
                div.className = "cart-item-row";
                div.style.padding = "10px 0";
                div.style.borderBottom = "1px solid #eee";
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span><strong>${item.nom}</strong></span>
                        <span>${sousTotal.toLocaleString()} KMF</span>
                    </div>
                    <div style="margin-top:5px; display:flex; align-items:center; gap:10px;">
                        <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                    </div>
                `;
                list.appendChild(div);
            });
            if (waBtn) waBtn.innerHTML = `Commander sur WhatsApp (${total.toLocaleString()} KMF)`;
        }

        totalHtml.innerText = total.toLocaleString() + " KMF";
        if (badge) badge.innerText = nombreArticles;

        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    function animateBadge() {
        const badge = document.getElementById("cart-count");
        if (badge) {
            badge.style.transition = "transform 0.2s";
            badge.style.transform = "scale(1.4)";
            setTimeout(() => badge.style.transform = "scale(1)", 200);
        }
    }

    /* -------------------------
       5. INTERFACE (MODALES & TABS)
    --------------------------*/
    const cartBtn = document.getElementById("cart-icon-btn");
    const closeBtn = document.getElementById("close-cart");
    const overlay = document.getElementById("cart-overlay");

    if (cartBtn) cartBtn.onclick = () => {
        document.getElementById("cart-sidebar").classList.add("open");
        document.getElementById("cart-overlay").classList.add("show");
    };

    if (closeBtn || overlay) {
        const closeAction = () => {
            document.getElementById("cart-sidebar").classList.remove("open");
            document.getElementById("cart-overlay").classList.remove("show");
        };
        if(closeBtn) closeBtn.onclick = closeAction;
        if(overlay) overlay.onclick = closeAction;
    }

    function showToast() {
        const toast = document.getElementById("toast-notification");
        if (toast) {
