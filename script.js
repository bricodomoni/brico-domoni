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

    /* -------------------------
       AJOUTER AU PANIER
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

    /* -------------------------
       MODIFIER QUANTITÉ
    --------------------------*/
    window.modifierQty = (id, change) => {
        const item = panier.find(i => i.id === id);

        if (item) {
            item.qty += change;
            if (item.qty <= 0) panier = panier.filter(i => i.id !== id);
            majPanier();
        }
    };

    /* -------------------------
       METTRE À JOUR LE PANIER
    --------------------------*/
    function majPanier() {
        const list = document.getElementById("cart-items-list");
        const totalHtml = document.getElementById("total-price");

        list.innerHTML = "";
        let total = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;

            const div = document.createElement("div");
            div.innerHTML = `
                <strong>${item.nom}</strong><br>
                <button onclick="modifierQty(${item.id}, -1)">-</button>
                <span> ${item.qty} </span>
                <button onclick="modifierQty(${item.id}, 1)">+</button>
                <span> | ${(item.prix * item.qty).toLocaleString()} KMF</span>
            `;

            list.appendChild(div);
        });

        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    /* -------------------------
       TOAST "Produit ajouté"
    --------------------------*/
    function showToast() {
        const toast = document.getElementById("toast-notification");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2000);
    }

    /* -------------------------
       OUVERTURE / FERMETURE PANIER
    --------------------------*/
    function openCart() {
        document.getElementById("cart-sidebar").classList.add("open");
        document.getElementById("cart-overlay").classList.add("show");
    }

    document.getElementById("close-cart").onclick = () => {
        document.getElementById("cart-sidebar").classList.remove("open");
        document.getElementById("cart-overlay").classList.remove("show");
    };

    /* -------------------------
       SLIDER AUTOMATIQUE + BOUTONS
    --------------------------*/
    const slides = document.querySelectorAll(".slide");
    let index = 0;

    function showSlide(i) {
        slides.forEach(s => s.classList.remove("active"));
        slides[i].classList.add("active");
    }

    document.querySelector(".next").onclick = () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    };

    document.querySelector(".prev").onclick = () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    };

    setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
    }, 5000);

    /* -------------------------
       ONGLET ACCUEIL / PRODUITS
    --------------------------*/
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;

            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.getElementById(target).classList.add("active");

            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        };
    });

    /* -------------------------
       BOUTON WHATSAPP
    --------------------------*/
    document.getElementById("whatsapp-send").onclick = () => {
        if (panier.length === 0) {
            alert("Votre panier est vide.");
            return;
        }

        let message = "Bonjour, je souhaite commander :%0A";

        panier.forEach(item => {
            message += `- ${item.nom} x${item.qty} = ${(item.prix * item.qty).toLocaleString()} KMF%0A`;
        });

        const total = panier.reduce((t, i) => t + i.prix * i.qty, 0);
        message += `%0ATotal : ${total.toLocaleString()} KMF`;

        const numero = "269xxxxxxx"; // Mets ton numéro ici
        window.open(`https://wa.me/${numero}?text=${message}`, "_blank");
    };

});
