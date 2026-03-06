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
        if (data.length === 0) {
            productList.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px;">Aucun produit trouvé.</p>`;
            return;
        }
        productList.innerHTML = data.map(p => `
            <div class="product-card">
                <img src="${p.img}" alt="${p.nom}" onerror="this.onerror=null;this.src='https://placehold.co/300x300?text=Image+à+venir'">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter</button>
            </div>
        `).join('');
    };

    renderProducts(produits);

    /* --- 3. RECHERCHE & FILTRES --- */
    window.searchProducts = () => {
        const input = document.getElementById("search-input");
        const clearBtn = document.getElementById("clear-search");
        const term = input.value.toLowerCase();
        
        if (clearBtn) clearBtn.style.display = term ? "block" : "none";
        
        const filtered = produits.filter(p => p.nom.toLowerCase().includes(term));
        renderProducts(filtered);

        if (term) showTab('produits');
    };

    window.clearSearch = () => {
        const input = document.getElementById("search-input");
        if (input) {
            input.value = "";
            window.searchProducts();
        }
    };

    window.filterProducts = (cat, btn) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        const filtered = cat === 'all' ? produits : produits.filter(p => p.category === cat);
        renderProducts(filtered);
    };

    /* --- 4. GESTION DU PANIER --- */
    window.ajouter = (id) => {
        const p = produits.find(item => item.id === id);
        const inCart = panier.find(item => item.id === id);
        inCart ? inCart.qty++ : panier.push({ ...p, qty: 1 });
        majPanier();
        showToast();
    };

    window.changeQty = (id, delta) => {
        const item = panier.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) panier = panier.filter(i => i.id !== id);
            majPanier();
        }
    };

    function majPanier() {
        const list = document.getElementById("cart-items-list");
        const totalEl = document.getElementById("total-price");
        const countEl = document.getElementById("cart-count");
        
        if (!list) return;

        list.innerHTML = panier.length === 0 ? 
            "<p style='text-align:center; margin-top:20px;'>Votre panier est vide.</p>" :
            panier.map(item => `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div style="max-width:60%; font-size:0.85rem;"><strong>${item.nom}</strong><br>${item.prix.toLocaleString()} KMF</div>
                    <div style="text-align:right">
                        <div style="margin-bottom:5px;">
                            <button onclick="changeQty(${item.id}, -1)" style="padding:2px 8px;">-</button> 
                            <span style="margin:0 5px">${item.qty}</span> 
                            <button onclick="changeQty(${item.id}, 1)" style="padding:2px 8px;">+</button>
                        </div>
                        <strong style="color:var(--orange)">${(item.prix * item.qty).toLocaleString()} KMF</strong>
                    </div>
                </div>
            `).join('');

        const total = panier.reduce((acc, i) => acc + (i.prix * i.qty), 0);
        const count = panier.reduce((acc, i) => acc + i.qty, 0);

        if (totalEl) totalEl.innerText = `${total.toLocaleString()} KMF`;
        if (countEl) countEl.innerText = count;
        localStorage.setItem("panier_brico", JSON.stringify(panier));
    }

    /* --- 5. NAVIGATION --- */
    window.showTab = (target) => {
        document.querySelectorAll(".tab-content").forEach(tab => {
            tab.style.display = (tab.id === target) ? "block" : "none";
        });
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.tab === target);
        });
        window.scrollTo(0, 0);
    };

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => showTab(btn.dataset.tab);
    });

    // Panier Sidebar
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");
    const openCart = document.getElementById("cart-icon-btn");
    const closeCart = document.getElementById("close-cart");

    if (openCart) openCart.onclick = () => { sidebar.classList.add("open"); overlay.classList.add("show"); };
    if (closeCart) closeCart.onclick = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };
    if (overlay) overlay.onclick = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };

    function showToast() {
        const t = document.getElementById("toast-notification");
        if (t) {
            t.classList.add("show");
            setTimeout(() => t.classList.remove("show"), 2000);
        }
    }

    /* --- 6. SLIDER --- */
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    const moveSlide = (dir) => {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + dir + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
    };

    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    if (nextBtn) nextBtn.onclick = () => moveSlide(1);
    if (prevBtn) prevBtn.onclick = () => moveSlide(-1);
    
    setInterval(() => {
        const accueil = document.getElementById("accueil");
        if (accueil && getComputedStyle(accueil).display !== "none") moveSlide(1);
    }, 5000);

    /* --- 7. WHATSAPP --- */
    const waBtn = document.getElementById("whatsapp-send");
    if (waBtn) {
        waBtn.onclick = () => {
            if (panier.length === 0) return alert("Votre panier est vide !");
            let msg = "Bonjour BRICO DOMONI, voici ma commande :%0A%0A";
            panier.forEach(i => msg += `• ${i.nom} (x${i.qty}) : ${(i.prix * i.qty).toLocaleString()} KMF%0A`);
            const total = panier.reduce((acc, i) => acc + (i.prix * i.qty), 0);
            msg += `%0A*TOTAL : ${total.toLocaleString()} KMF*`;
            window.open(`https://wa.me/2694484047?text=${msg}`, "_blank");
        };
    }

    // Init
    majPanier();
});
