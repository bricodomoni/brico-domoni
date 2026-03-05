document.addEventListener('DOMContentLoaded', () => {
    let panier = [];
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    // --- AFFICHAGE PRODUITS ---
    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p style="color:var(--orange); font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" onclick="ajouter(${p.id})">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // --- GESTION DES ONGLETS (CORRIGÉ) ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-tab');
            
            // Masquer toutes les sections
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            // Afficher la section cible
            document.getElementById(target).classList.add('active');
            
            // Changer le style des boutons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    // --- PANIER ---
    window.ajouter = (id) => {
        const prod = produits.find(p => p.id === id);
        const existant = panier.find(item => item.id === id);
        if (existant) { existant.qty++; } else { panier.push({ ...prod, qty: 1 }); }
        
        majPanier();
        showToast();
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('cart-overlay').classList.add('show');
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
        const liste = document.getElementById('cart-items-list');
        const totalHtml = document.getElementById('total-price');
        liste.innerHTML = "";
        let total = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            const div = document.createElement('div');
            div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `
                <strong>${item.nom}</strong><br>
                <button onclick="modifierQty(${item.id}, -1)">-</button>
                <span> ${item.qty} </span>
                <button onclick="modifierQty(${item.id}, 1)">+</button>
                <span> | ${(item.prix * item.qty).toLocaleString()} KMF</span>
            `;
            liste.appendChild(div);
        });
        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    function showToast() {
        const t = document.getElementById('toast-notification');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    }

    // --- SLIDER ---
    const slides = document.querySelectorAll('.slide');
    let cur = 0;
    const nextSlide = () => {
        if(slides.length === 0) return;
        slides[cur].classList.remove('active');
        cur = (cur + 1) % slides.length;
        slides[cur].classList.add('active');
    };
    
    document.querySelector('.next').onclick = nextSlide;
    document.querySelector('.prev').onclick = () => {
        slides[cur].classList.remove('active');
        cur = (cur - 1 + slides.length) % slides.length;
        slides[cur].classList.add('active');
    };
    setInterval(nextSlide, 5000);

    // --- FERMETURE PANIER ---
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('show');
    };

    // --- WHATSAPP ---
    document.getElementById('whatsapp-send').onclick = () => {
        if (panier.length === 0) return alert("Panier vide");
        let msg = "Bonjour BRICO DOMONI, commande :%0A";
        panier.forEach(i => msg += `- ${i.nom} x${i.qty}%0A`);
        window.open(`https://wa.me/269334XXXX?text=${msg}`, "_blank");
    };
});
