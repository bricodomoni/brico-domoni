document.addEventListener('DOMContentLoaded', () => {
    let panier = [];
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    // --- AFFICHAGE INITIAL ---
    const container = document.getElementById('product-list');
    produits.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${p.img}">
            <h3>${p.nom}</h3>
            <p class="price">${p.prix.toLocaleString()} KMF</p>
            <button class="add-to-cart" onclick="ajouter(${p.id})">Ajouter au panier</button>
        `;
        container.appendChild(div);
    });

    // --- LOGIQUE DU PANIER ---
    window.ajouter = (id) => {
        const prod = produits.find(p => p.id === id);
        const dejaDansPanier = panier.find(item => item.id === id);

        if (dejaDansPanier) {
            dejaDansPanier.qty++;
        } else {
            panier.push({ ...prod, qty: 1 });
        }

        majPanier();
        alerte();
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
            div.innerHTML = `
                <strong>${item.nom}</strong><br>
                <button class="qty-btn" onclick="modifierQty(${item.id}, -1)">-</button>
                <span> ${item.qty} </span>
                <button class="qty-btn" onclick="modifierQty(${item.id}, 1)">+</button>
                <span> | ${(item.prix * item.qty).toLocaleString()} KMF</span>
            `;
            liste.appendChild(div);
        });
        totalHtml.innerText = total.toLocaleString() + " KMF";
    }

    function alerte() {
        const t = document.getElementById('toast-notification');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }

    // FERMETURE
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('show');
    };
});
