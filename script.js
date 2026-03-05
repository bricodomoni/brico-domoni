document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       PRODUITS DISPONIBLES
    --------------------------*/
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    let panier = [];
    const productList = document.getElementById("product-list");

    /* -------------------------
       AFFICHAGE DES PRODUITS
    --------------------------*/
    if (productList) {
        productList.innerHTML = ""; // Sécurité : on vide avant d'afficher
        produits.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p><strong>${p.prix.toLocaleString()} KMF</strong></p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }

    /* -------------------------
       LOGIQUE DU PANIER
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

        panier.forEach(item => {
            total += item.prix * item.qty;
            const div = document.createElement("div");
            div.className = "cart-item-row"; // Pour styliser en CSS
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span><strong>${item.nom}</strong> (x${item.qty})</span>
                    <div>
                        <button onclick="modifierQty(${item.id}, -1)">-</button>
                        <button onclick="modifierQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
            list.appendChild(div);
        });

        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    /* -------------------------
       INTERFACE (SIDEBAR & TOAST)
    --------------------------*/
    function showToast() {
        const toast = document.getElementById("toast-notification");
        if (toast) {
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    }

    function openCart() {
        const sidebar = document.getElementById("cart-sidebar");
        const overlay = document.getElementById("cart-overlay");
        if (sidebar) sidebar.classList.add("open");
        if (overlay) overlay.classList.add("show");
    }

    const closeBtn = document.getElementById("close-cart");
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById("cart-sidebar").classList.remove("open");
            document.getElementById("cart-overlay").classList.remove("show");
        };
    }

    /* -------------------------
       SLIDER (SÉCURISÉ)
    --------------------------*/
    const slides = document.querySelectorAll(".slide");
    let slideIndex = 0;

    if (slides.length > 0) {
        function showSlide(i) {
            slides.forEach(s => s.classList.remove("active"));
            slides[i].classList.add("active");
        }

        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

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
       ONGLETS & WHATSAPP
    --------------------------*/
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            
            const targetEl = document.getElementById(target);
            if (targetEl) {
                targetEl.classList.add("active");
                btn.classList.add("active");
            }
        };
    });

    const waBtn = document.getElementById("whatsapp-send");
    if (waBtn) {
        waBtn.onclick = () => {
            if (panier.length === 0) return alert("Votre panier est vide.");
            let message = "Bonjour BRICO DOMONI, voici ma commande :%0A";
            panier.forEach(item => {
                message += `- ${item.nom} x${item.qty} = ${(item.prix * item.qty).toLocaleString()} KMF%0A`;
            });
            const total = panier.reduce((t, i) => t + i.prix * i.qty, 0);
            message += `%0ATotal : ${total.toLocaleString()} KMF`;
            window.open(`https://wa.me/269334XXXX?text=${message}`, "_blank");
        };
    }
});
