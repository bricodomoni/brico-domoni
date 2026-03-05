document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       1. BASE DE DONNÉES PRODUITS
    --------------------------*/
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    let panier = [];
    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];

// Et on force la mise à jour visuelle immédiate si le panier n'est pas vide
if (panier.length > 0) {
    majPanier();
}

    /* -------------------------
       2. AFFICHAGE DYNAMIQUE
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
       3. LOGIQUE DU PANIER
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
        openCart();
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
        if (!list || !totalHtml) return;

        list.innerHTML = "";
        let total = 0;
        localStorage.setItem("panier_brico", JSON.stringify(panier));

        panier.forEach(item => {
            total += item.prix * item.qty;
            const div = document.createElement("div");
            div.style.padding = "10px 0";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>${item.nom}</strong></span>
                    <span>${(item.prix * item.qty).toLocaleString()} KMF</span>
                </div>
                <div style="margin-top:5px;">
                    <button onclick="modifierQty(${item.id}, -1)">-</button>
                    <span style="margin: 0 10px;">${item.qty}</span>
                    <button onclick="modifierQty(${item.id}, 1)">+</button>
                </div>
            `;
            list.appendChild(div);
        });

        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    /* -------------------------
       4. INTERFACE (PANIER & TABS)
    --------------------------*/
    function openCart() {
        document.getElementById("cart-sidebar").classList.add("open");
        document.getElementById("cart-overlay").classList.add("show");
    }

    const closeCart = () => {
        document.getElementById("cart-sidebar").classList.remove("open");
        document.getElementById("cart-overlay").classList.remove("show");
    };

    if (document.getElementById("close-cart")) {
        document.getElementById("close-cart").onclick = closeCart;
    }
    if (document.getElementById("cart-overlay")) {
        document.getElementById("cart-overlay").onclick = closeCart;
    }

    function showToast() {
        const toast = document.getElementById("toast-notification");
        if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    }

    // Gestion des Onglets
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            
            // Masquer tous les contenus
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            // Désactiver tous les boutons
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            
            // Afficher la cible
            document.getElementById(target).classList.add("active");
            btn.classList.add("active");
        };
    });

    /* -------------------------
       5. SLIDER AUTOMATIQUE
    --------------------------*/
    const slides = document.querySelectorAll(".slide");
    let slideIndex = 0;

    if (slides.length > 0) {
        const showSlide = (n) => {
            slides.forEach(s => s.classList.remove("active"));
            slides[n].classList.add("active");
        };

        document.querySelector(".next").onclick = () => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        };

        document.querySelector(".prev").onclick = () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showSlide(slideIndex);
        };

        setInterval(() => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }, 5000);
    }

    /* -------------------------
   6. ENVOI WHATSAPP OPTIMISÉ
--------------------------*/
const waBtn = document.getElementById("whatsapp-send");

if (waBtn) {
    waBtn.onclick = () => {
        // 1. Vérification si le panier est vide
        if (panier.length === 0) {
            alert("Votre panier est vide. Ajoutez des articles avant de commander !");
            return;
        }

        // 2. Construction du message professionnel
        let message = "🛠️ *NOUVELLE COMMANDE - BRICO DOMONI*%0A";
        message += "---------------------------------------%0A";

        panier.forEach((item, index) => {
            const sousTotal = item.prix * item.qty;
            message += `*${index + 1}.* ${item.nom}%0A`;
            message += `   Quantité : ${item.qty}%0A`;
            message += `   Prix : ${sousTotal.toLocaleString()} KMF%0A%0A`;
        });

        const totalFinal = panier.reduce((t, i) => t + (i.prix * i.qty), 0);

        message += "---------------------------------------%0A";
        message += `💰 *TOTAL À PAYER : ${totalFinal.toLocaleString()} KMF*%0A%0A`;
        message += "Merci de me confirmer la disponibilité et le créneau de livraison.";

        // 3. Ton numéro de téléphone (Format international sans le +)
        const monNumero = "269334XXXX"; // REMPLACE PAR TON VRAI NUMÉRO ICI

        // 4. Ouverture du lien (Lien universel wa.me)
        const url = `https://wa.me/${monNumero}?text=${message}`;
        window.open(url, "_blank");
    };
}
