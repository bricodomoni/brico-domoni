document.addEventListener("DOMContentLoaded", () => {

    /* --- 1. DONNÉES PRODUITS --- */
    const produits = [
        { id: 1, nom: "Adaptateur de Mandrin à pince", prix: 1000, img: "Images/mandrin.jpg", category: "outils" },
        { id: 2, nom: "Adaptateur prise électrique européen", prix: 500, img: "Images/adaptateur-eu.jpg", category: "electricite" },
        { id: 3, nom: "Adaptateur prise électrique TRAVELKING", prix: 500, img: "Images/travelking.jpg", category: "electricite" },
        { id: 4, nom: "Adaptateur prise Marken", prix: 750, img: "Images/marken.png", category: "electricite" },
        { id: 5, nom: "Adhésif silicone", prix: 2000, img: "Images/silicone.png", category: "divers" },
        { id: 6, nom: "Agrafe 1008J", prix: 2000, img: "Images/agrafe1008.png", category: "outils" },
        { id: 7, nom: "Agrafe 1010J", prix: 2000, img: "Images/agrafe1010.png", category: "outils" },
        { id: 8, nom: "Agrafe 1013J", prix: 2000, img: "Images/agrafe1013.png", category: "outils" },
        { id: 9, nom: "Agrafeuse pneumatique 1013J", prix: 25000, img: "Images/agrafeuse.jpg", category: "outils" },
        { id: 10, nom: "Ampoule Led 10w 230v", prix: 900, img: "Images/led10w.png", category: "electricite" },
        { id: 11, nom: "Ampoule Led 12w 12v", prix: 1600, img: "Images/led12w12v.png", category: "electricite" },
        { id: 12, nom: "Ampoule Led 12w 12v/85v", prix: 1350, img: "Images/led12w85v.png", category: "electricite" },
        { id: 13, nom: "Ampoule Led 18w 12v", prix: 1700, img: "Images/led18w12v.png", category: "electricite" },
        { id: 14, nom: "Ampoule Led 18w 12v/85v", prix: 1700, img: "Images/led18w85v.png", category: "electricite" },
        { id: 15, nom: "Ampoule Led 24w 12v/85v", prix: 2500, img: "Images/led24w.png", category: "electricite" },
        { id: 16, nom: "Ampoule Led 28w 230v", prix: 1500, img: "Images/led28w.png", category: "electricite" },
        { id: 17, nom: "Ampoule Led 5w 12v", prix: 850, img: "Images/led5w12v.png", category: "electricite" },
        { id: 18, nom: "Ampoule Led 5w 12v/85v", prix: 900, img: "Images/led5w85v.png", category: "electricite" },
        { id: 19, nom: "Ampoule Led 5w 230v", prix: 750, img: "Images/led5w230v.png", category: "electricite" },
        { id: 20, nom: "Ampoule Led 7w 12v", prix: 1000, img: "Images/led7w12v.png", category: "electricite" },
        { id: 21, nom: "Ampoule Led 7w 12v/85v", prix: 1000, img: "Images/led7w85v.png", category: "electricite" }
    ];

    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];

    /* --- 2. AFFICHAGE & RECHERCHE --- */
    const productList = document.getElementById("product-list");

    window.afficherProduits = (liste) => {
        if (!productList) return;
        productList.innerHTML = liste.length === 0 ? 
            `<p style="grid-column: 1/-1; text-align:center; padding: 40px;">Aucun produit trouvé.</p>` : 
            liste.map(p => `
                <div class="product-card" data-category="${p.category}">
                    <img src="${p.img}" alt="${p.nom}" onerror="this.src='https://placehold.co/300?text=Image+Indisponible'">
                    <h3>${p.nom}</h3>
                    <p class="price">${p.prix.toLocaleString()} KMF</p>
                    <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
                </div>
            `).join('');
    };

    window.searchProducts = () => {
        const query = document.getElementById("search-input").value.toLowerCase();
        const clearBtn = document.getElementById("clear-search");
        
        if (clearBtn) clearBtn.style.display = query ? "inline" : "none";

        const filtered = produits.filter(p => p.nom.toLowerCase().includes(query));
        
        // Si on cherche, on bascule automatiquement sur l'onglet produits
        if (query) {
            const btnProduits = document.querySelector('[data-tab="produits"]');
            if (btnProduits) btnProduits.click();
        }
        afficherProduits(filtered);
    };

    window.clearSearch = () => {
        const input = document.getElementById("search-input");
        if (input) { input.value = ""; searchProducts(); input.focus(); }
    };

    window.filterProducts = (category, btnElement) => {
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');
        const filtered = category === 'all' ? produits : produits.filter(p => p.category === category);
        afficherProduits(filtered);
    };

    /* --- 3. LOGIQUE DU PANIER --- */
    window.ajouter = (id) => {
        const prod = produits.find(p => p.id === id);
        const existant = panier.find(item => item.id === id);
        existant ? existant.qty++ : panier.push({ ...prod, qty: 1 });
        majPanier();
        showToast();
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
        const list = document.getElementById("cart-items-list");
        const totalHtml = document.getElementById("total-price");
        const badge = document.getElementById("cart-count");
        const waBtn = document.getElementById("whatsapp-send");
        
        if (!list) return;

        let total = 0;
        let nombreArticles = 0;

        if (panier.length === 0) {
            list.innerHTML = `<div class="empty-cart-msg">🛒 Votre panier est vide.<br><small>Ajoutez des articles pour commander !</small></div>`;
        } else {
            list.innerHTML = panier.map(item => {
                const sousTotal = item.prix * item.qty;
                total += sousTotal;
                nombreArticles += item.qty;
                return `
                    <div class="cart-item-row">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span><strong>${item.nom}</strong></span>
                            <span style="color:var(--orange); font-weight:bold;">${sousTotal.toLocaleString()} KMF</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                            <span style="font-weight:600;">${item.qty}</span>
                            <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                        </div>
                    </div>`;
            }).join('');
        }

        if (totalHtml) totalHtml.innerText = total.toLocaleString() + " KMF";
        if (badge) badge.innerText = nombreArticles;
        
        if (waBtn) {
            waBtn.innerHTML = panier.length > 0 
                ? `🛍️ Commander sur WhatsApp (${total.toLocaleString()} KMF)` 
                : `Commander sur WhatsApp`;
        }

        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    /* --- 4. SLIDER AUTOMATIQUE --- */
    const slides = document.querySelectorAll(".slide");
    let slideIndex = 0;

    if (slides.length > 0) {
        const showSlide = (n) => {
            slides.forEach(s => s.classList.remove("active"));
            slides[n].classList.add("active");
        };

        const nextSlide = () => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        };

        document.querySelector(".next").onclick = nextSlide;
        document.querySelector(".prev").onclick = () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showSlide(slideIndex);
        };

        setInterval(() => {
            const accueil = document.getElementById("accueil");
            if (accueil && accueil.classList.contains("active")) nextSlide();
        }, 5000);
    }

    /* --- 5. INTERFACE & NAVIGATION --- */
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.getElementById(target).classList.add("active");
            btn.classList.add("active");
            window.scrollTo(0,0);
        };
    });

    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");

    document.getElementById("cart-icon-btn").onclick = () => { sidebar.classList.add("open"); overlay.classList.add("show"); };
    document.getElementById("close-cart").onclick = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };
    overlay.onclick = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };

    function showToast() {
        const toast = document.getElementById("toast-notification");
        if (toast) { 
            toast.classList.add("show"); 
            setTimeout(() => toast.classList.remove("show"), 2500); 
        }
    }

    /* --- 6. COMMANDE WHATSAPP --- */
    document.getElementById("whatsapp-send").onclick = () => {
        if (panier.length === 0) return alert("Votre panier est vide !");
        
        let message = "🛠️ *NOUVELLE COMMANDE - BRICO DOMONI*%0A%0A";
        panier.forEach((item, index) => {
            message += `*${index + 1}.* ${item.nom}%0A   👉 Qté: ${item.qty} | Total: ${(item.prix * item.qty).toLocaleString()} KMF%0A%0A`;
        });
        
        const total = panier.reduce((t, i) => t + (i.prix * i.qty), 0);
        message += `💰 *TOTAL À PAYER : ${total.toLocaleString()} KMF*`;
        
        window.open(`https://wa.me/2694484047?text=${message}`, "_blank");
    };

    // Initialisation au chargement
    afficherProduits(produits);
    majPanier();
});
