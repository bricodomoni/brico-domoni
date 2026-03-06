document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       1. BASE DE DONNÉES PRODUITS
    --------------------------*/
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 4, nom: "Marteau de coffreur", prix: 3500, img: "Images/marteau.jpg" }
    ];

    /* -------------------------
       2. GESTION DE LA MÉMOIRE (LocalStorage)
    --------------------------*/
    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];

    if (panier.length > 0) {
        setTimeout(() => { majPanier(); }, 100);
    }

    /* -------------------------
       3. AFFICHAGE DYNAMIQUE DES PRODUITS
    --------------------------*/
    const productList = document.getElementById("product-list");

    if (productList) {
        productList.innerHTML = ""; 
        produits.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }

    /* -------------------------
       4. LOGIQUE DU PANIER (FONCTIONS GLOBALES)
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
        animateBadge(); // Nouvelle animation
        // openCart(); // Optionnel : décommente si tu veux que le panier s'ouvre seul
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
        const badge = document.getElementById("cart-count"); // Le badge dans le header
        
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
        
        // Mise à jour du badge (le petit rond sur l'onglet)
        if (badge) {
            badge.innerText = nombreArticles;
        }

        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    // Fonction pour l'animation du badge
    function animateBadge() {
        const badge = document.getElementById("cart-count");
        if (badge) {
            badge.classList.remove("badge-pop");
            void badge.offsetWidth; // Force le redémarrage de l'animation
            badge.classList.add("badge-pop");
        }
    }

    /* -------------------------
       5. INTERFACE (MODALES & TABS)
    --------------------------*/
    function openCart() {
        document.getElementById("cart-sidebar").classList.add("open");
        document.getElementById("cart-overlay").classList.add("show");
    }

    const closeCart = () => {
        const sidebar = document.getElementById("cart-sidebar");
        const overlay = document.getElementById("cart-overlay");
        if(sidebar) sidebar.classList.remove("open");
        if(overlay) overlay.classList.remove("show");
    };

    const closeBtn = document.getElementById("close-cart");
    const overlay = document.getElementById("cart-overlay");
    if (closeBtn) closeBtn.onclick = closeCart;
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

            const monNumero = "+2694484047"; // Mets ton vrai numéro ici
            window.open(`https://wa.me/${monNumero}?text=${message}`, "_blank");
        };
    }
});
