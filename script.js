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
       2. GESTION DU PANIER (LOCALSTORAGE)
    --------------------------*/
    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];

    /* -------------------------
       3. AFFICHAGE DES PRODUITS
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
                <img src="${p.img}" alt="${p.nom}" loading="lazy">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }

    // Initialisation
    afficherProduits(produits);
    majPanier(); // Met à jour le badge au chargement

    /* -------------------------
       4. FILTRAGE ET RECHERCHE
    --------------------------*/
    window.filterProducts = (category, btnElement) => {
        // Gérer l'état actif des boutons
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');

        // Filtrer les données
        const filtered = category === 'all' ? produits : produits.filter(p => p.category === category);
        afficherProduits(filtered);
    };

    window.searchProducts = () => {
        const query = document.getElementById("search-input").value.toLowerCase();
        const clearBtn = document.getElementById("clear-search");
        
        if (clearBtn) clearBtn.style.display = query.length > 0 ? "inline" : "none";

        const filtered = produits.filter(p => p.nom.toLowerCase().includes(query));

        // Aller à l'onglet produits si on commence à taper
        if (query.length > 0) {
            const prodTab = document.querySelector('[data-tab="produits"]');
            if (prodTab && !prodTab.classList.contains('active')) prodTab.click();
        }

        afficherProduits(filtered);
    };

    window.clearSearch = () => {
        const input = document.getElementById("search-input");
        input.value = "";
        window.searchProducts();
        input.focus();
    };

    /* -------------------------
       5. LOGIQUE DU PANIER
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
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.9rem; max-width:70%;"><strong>${item.nom}</strong></span>
                        <span style="color:var(--orange); font-weight:700;">${sousTotal.toLocaleString()} KMF</span>
                    </div>
                    <div style="margin-top:8px; display:flex; align-items:center; gap:12px;">
                        <button class="tab-btn" style="padding:2px 10px; background:#eee; color:#333; border:none;" onclick="modifierQty(${item.id}, -1)">-</button>
                        <span style="font-weight:bold;">${item.qty}</span>
                        <button class="tab-btn" style="padding:2px 10px; background:#eee; color:#333; border:none;" onclick="modifierQty(${item.id}, 1)">+</button>
                    </div>
                `;
                list.appendChild(div);
            });
            if (waBtn) waBtn.innerHTML = `COMMANDER SUR WHATSAPP (${total.toLocaleString()} KMF)`;
        }

        totalHtml.innerText = total.toLocaleString() + " KMF";
        if (badge) badge.innerText = nombreArticles;

        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    function animateBadge() {
        const badge = document.getElementById("cart-count");
        if (badge) {
            badge.style.transform = "scale(1.3)";
            setTimeout(() => badge.style.transform = "scale(1)", 200);
        }
    }

    /* -------------------------
       6. INTERFACE (ONGLETS & MODALES)
    --------------------------*/
    // Gestion des Onglets
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            if (!target) return;
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.getElementById(target).classList.add("active");
            btn.classList.add("active");
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
    });

    // Sidebar Panier
    const cartBtn = document.getElementById("cart-icon-btn");
    const closeBtn = document.getElementById("close-cart");
    const overlay = document.getElementById("cart-overlay");
    const sidebar = document.getElementById("cart-sidebar");

    const toggleCart = (show) => {
        if (show) {
            sidebar.classList.add("open");
            overlay.classList.add("show");
        } else {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
        }
    };

    if (cartBtn) cartBtn.onclick = () => toggleCart(true);
    if (closeBtn) closeBtn.onclick = () => toggleCart(false);
    if (overlay) overlay.onclick = () => toggleCart(false);

    function showToast() {
        const toast = document.getElementById("toast-notification");
        if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    }

    /* -------------------------
       7. SLIDER
    --------------------------*/
    const slides = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    let slideIndex = 0;

    if (slides.length > 0) {
        const showSlide = (n) => {
            slides.forEach(s => s.classList.remove("active"));
            slides[n].classList.add("active");
        };

        if (nextBtn) nextBtn.onclick = () => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        };

        if (prevBtn) prevBtn.onclick = () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showSlide(slideIndex);
        };

        setInterval(() => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }, 5000);
    }

    /* -------------------------
       8. ENVOI WHATSAPP
    --------------------------*/
    const waSendBtn = document.getElementById("whatsapp-send");
    if (waSendBtn) {
        waSendBtn.onclick = () => {
            if (panier.length === 0) {
                alert("Votre panier est vide !");
                return;
            }

            let message = "🛠️ *COMMANDE - BRICO DOMONI*%0A";
            message += "---------------------------------------%0A";

            panier.forEach((item, index) => {
                const sTotal = item.prix * item.qty;
                message += `*${index + 1}.* ${item.nom}%0A`;
                message += `   Quantité : ${item.qty}%0A`;
                message += `   Prix : ${sTotal.toLocaleString()} KMF%0A%0A`;
            });

            const totalFinal = panier.reduce((t, i) => t + (i.prix * i.qty), 0);
            message += "---------------------------------------%0A";
            message += `💰 *TOTAL : ${totalFinal.toLocaleString()} KMF*%0A%0A`;
            message += "Merci de préparer ma commande.";

            const monNumero = "2694484047"; 
            window.open(`https://wa.me/${monNumero}?text=${message}`, "_blank");
        };
    }
});
