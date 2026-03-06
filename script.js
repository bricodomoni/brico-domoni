document.addEventListener("DOMContentLoaded", () => {

    /* --- 1. DONNÉES PRODUITS --- */
    const produits = [
        { id: 1, nom: "Adaptateur de Mandrin à pince", prix: 1000, img: "Images/mandrin.jpg", category: "outils" },
        { id: 2, nom: "Adaptateur prise européen", prix: 500, img: "Images/adaptateur-eu.jpg", category: "electricite" },
        { id: 3, nom: "Adaptateur TRAVELKING", prix: 500, img: "Images/travelking.jpg", category: "electricite" },
        { id: 4, nom: "Adaptateur Marken", prix: 750, img: "Images/marken.jpg", category: "electricite" },
        { id: 5, nom: "Adhésif silicone", prix: 2000, img: "Images/silicone.jpg", category: "divers" },
        { id: 6, nom: "Agrafe 1008J", prix: 2000, img: "Images/agrafe1008.jpg", category: "outils" },
        { id: 7, nom: "Agrafe 1010J", prix: 2000, img: "Images/agrafe1010.jpg", category: "outils" },
        { id: 8, nom: "Agrafe 1013J", prix: 2000, img: "Images/agrafe1013.jpg", category: "outils" },
        { id: 9, nom: "Agrafeuse pneumatique", prix: 25000, img: "Images/agrafeuse.jpg", category: "outils" },
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

    let panier = JSON.parse(localStorage.getItem("panier_brico")) || [];

    /* --- 2. FONCTIONS D'AFFICHAGE --- */
    const productList = document.getElementById("product-list");

    window.renderProducts = (data) => {
        if (!productList) return;
        productList.innerHTML = data.map(p => `
            <div class="product-card">
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter</button>
            </div>
        `).join('');
    };

    renderProducts(produits); // Premier affichage

    /* --- 3. RECHERCHE & FILTRES --- */
    window.searchProducts = () => {
        const term = document.getElementById("search-input").value.toLowerCase();
        document.getElementById("clear-search").style.display = term ? "block" : "none";
        
        const filtered = produits.filter(p => p.nom.toLowerCase().includes(term));
        renderProducts(filtered);

        // Si on cherche, on force l'affichage de l'onglet produits
        if (term) {
            document.querySelector('[data-tab="produits"]').click();
        }
    };

    window.clearSearch = () => {
        document.getElementById("search-input").value = "";
        window.searchProducts();
    };

    window.filterProducts = (cat, btn) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filtered = cat === 'all' ? produits : produits.filter(p => p.category === cat);
        renderProducts(filtered);
    };

    /* --- 4. GESTION DU PANIER --- */
    window.ajouter = (id) => {
        const p = produits.find(item => item.id === id);
        const inCart = panier.find(item => item.id === id);
        
        if (inCart) { inCart.qty++; } 
        else { panier.push({ ...p, qty: 1 }); }
        
        majPanier();
        showToast();
    };

    window.changeQty = (id, delta) => {
        const p = panier.find(item => item.id === id);
        if (p) {
            p.qty += delta;
            if (p.qty <= 0) panier = panier.filter(item => item.id !== id);
            majPanier();
        }
    };

    function majPanier() {
        const list = document.getElementById("cart-items-list");
        const totalEl = document.getElementById("total-price");
        const countEl = document.getElementById("cart-count");
        
        let total = 0;
        let count = 0;

        list.innerHTML = panier.map(item => {
            const st = item.prix * item.qty;
            total += st;
            count += item.qty;
            return `
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <div style="max-width:60%"><strong>${item.nom}</strong><br>${item.prix} KMF</div>
                    <div style="text-align:right">
                        <button onclick="changeQty(${item.id}, -1)">-</button> ${item.qty} <button onclick="changeQty(${item.id}, 1)">+</button>
                        <br><strong>${st} KMF</strong>
                    </div>
                </div>
            `;
        }).join('');

        if (panier.length === 0) list.innerHTML = "Votre panier est vide.";
        
        totalEl.innerText = total.toLocaleString() + " KMF";
        countEl.innerText = count;
        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    majPanier(); // Charger au démarrage

    /* --- 5. INTERFACE & NAVIGATION --- */
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab-content, .tab-btn").forEach(el => el.classList.remove("active"));
            document.getElementById(btn.dataset.tab).classList.add("active");
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
        const t = document.getElementById("toast-notification");
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 2000);
    }

    /* --- 6. SLIDER --- */
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    const moveSlide = (dir) => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + dir + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
    };

    document.querySelector(".next").onclick = () => moveSlide(1);
    document.querySelector(".prev").onclick = () => moveSlide(-1);
    setInterval(() => moveSlide(1), 5000);

    /* --- 7. WHATSAPP --- */
    document.getElementById("whatsapp-send").onclick = () => {
        if (panier.length === 0) return alert("Panier vide !");
        let msg = "Bonjour BRICO DOMONI, voici ma commande :%0A";
        panier.forEach(i => msg += `- ${i.nom} (x${i.qty}) : ${i.prix * i.qty} KMF%0A`);
        const total = panier.reduce((acc, i) => acc + (i.prix * i.qty), 0);
        msg += `%0A*TOTAL : ${total} KMF*`;
        window.open(`https://wa.me/2694484047?text=${msg}`, "_blank");
    };
});
