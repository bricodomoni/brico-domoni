document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       1. BASE DE DONNÉES PRODUITS
    --------------------------*/
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/sl Brouette.jpg", category: "jardin" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/sl Evier.jpg", category: "plomberie" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg", category: "maconnerie" },
        { id: 4, nom: "Lame Scie Circulaire", prix: 12500, img: "Images/sl lame de scie circulaire.jpg", category: "outils" },
        { id: 5, nom: "Marteau de coffreur", prix: 3500, img: "Images/marteau.jpg", category: "maconnerie" },
        { id: 6, nom: "Ampoule LED 12W", prix: 1500, img: "Images/ampoule.jpg", category: "electricite" },
        { id: 7, nom: "Truelle Italienne", prix: 2500, img: "Images/truelle.jpg", category: "maconnerie" },
        { id: 8, nom: "Coupe-carreaux Pro", prix: 55000, img: "Images/coupe-carreau.jpg", category: "carreleur" }
    ];

    /* -------------------------
       2. GESTION DU PANIER (LocalStorage)
    --------------------------*/
    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];

    // On initialise l'affichage du panier au chargement
    if (panier.length > 0) {
        setTimeout(() => { majPanier(); }, 100);
    }

    /* -------------------------
       3. AFFICHAGE DYNAMIQUE & FILTRAGE
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

    // Affichage de tous les produits au départ
    afficherProduits(produits);

    // Fonction de filtrage globale (appelée par onclick dans le HTML)
    window.filterProducts = (category) => {
        // 1. Mise à jour visuelle des boutons
        const buttons = document.querySelectorAll('.cat-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        if (event) event.currentTarget.classList.add('active');

        // 2. Logique de masquage/affichage
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const productCat = card.getAttribute('data-category');
            
            // Si c'est 'all' ou si la catégorie correspond, on affiche
            if (category === 'all' || productCat === category) {
                card.style.display = 'flex';
                // Petit délai pour l'animation d'opacité (CSS)
                setTimeout(() => card.style.opacity = "1", 10);
            } else {
                // Sinon on cache
                card.style.opacity = "0";
                card.style.display = 'none';
            }
        });
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
        
        if (!list || !totalHtml) return;

        list.innerHTML = "";
        let total = 0;
        let nombreArticles = 0;

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

        totalHtml.innerText = total.toLocaleString() + " KMF";
        if (badge) badge.innerText = nombreArticles;

        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    function animateBadge() {
        const badge = document.getElementById("cart-count");
        if (badge) {
            badge.classList.remove("badge-pop");
            void badge.offsetWidth; 
            badge.classList.add("badge-pop");
        }
    }

    /* -------------------------
       5. INTERFACE (MODALES & TABS)
    --------------------------*/
    const openCart = () => {
        document.getElementById("cart-sidebar").classList.add("open");
        document.getElementById("cart-overlay").classList.add("show");
    };

    const closeCart = () => {
        document.getElementById("cart-sidebar").classList.remove("open");
        document.getElementById("cart-overlay").classList.remove("show");
    };

    const cartBtn = document.getElementById("cart-icon-btn");
    if (cartBtn) cartBtn.onclick = openCart;

    const closeBtn = document.getElementById("close-cart");
    if (closeBtn) closeBtn.onclick = closeCart;

    const overlay = document.getElementById("cart-overlay");
    if (overlay) overlay.onclick = closeCart;

    function showToast() {
        const toast = document.getElementById("toast-notification");
        if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    }

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            
            document.getElementById(target).classList.add("active");
            btn.classList.add("active");
        };
    });

    /* -------------------------
       6. SLIDER AUTOMATIQUE
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
       7. ENVOI WHATSAPP
    --------------------------*/
    const waBtn = document.getElementById("whatsapp-send");

    if (waBtn) {
        waBtn.onclick = () => {
            if (panier.length === 0) {
                alert("Votre panier est vide !");
                return;
            }

            let message = "🛠️ *NOUVELLE COMMANDE - BRICO DOMONI*%0A";
            message += "---------------------------------------%0A";

            panier.forEach((item, index) => {
                const sTotal = item.prix * item.qty;
                message += `*${index + 1}.* ${item.nom}%0A`;
                message += `   Quantité : ${item.qty}%0A`;
                message += `   Prix : ${sTotal.toLocaleString()} KMF%0A%0A`;
            });

            const totalFinal = panier.reduce((t, i) => t + (i.prix * i.qty), 0);
            message += "---------------------------------------%0A";
            message += `💰 *TOTAL À PAYER : ${totalFinal.toLocaleString()} KMF*%0A%0A`;
            message += "Merci de confirmer la commande.";

            const monNumero = "+2694484047"; 
            window.open(`https://wa.me/${monNumero}?text=${message}`, "_blank");
        };
    }
});
