document.addEventListener('DOMContentLoaded', () => {
    
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    let panier = [];

    // Affichage des produits
    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" data-id="${p.id}">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    // Gestion du Panier
    function updateCartUI() {
        const cartItems = document.getElementById('cart-items-container');
        const totalEl = document.getElementById('cart-total');
        const badge = document.querySelector('.cart-count');
        
        cartItems.innerHTML = panier.length === 0 ? "<p>Votre panier est vide</p>" : "";
        let total = 0;
        let count = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            count += item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.nom} (x${item.qty})</span>
                <span>${(item.prix * item.qty).toLocaleString()} KMF</span>
            `;
            cartItems.appendChild(div);
        });

        totalEl.innerText = total.toLocaleString() + " KMF";
        badge.innerText = count;
    }

    // Événements de clic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = parseInt(e.target.dataset.id);
            const prod = produits.find(p => p.id === id);
            const exist = panier.find(i => i.id === id);
            if (exist) exist.qty++; else panier.push({ ...prod, qty: 1 });
            updateCartUI();
            document.getElementById('cart-panel').classList.add('open');
            document.getElementById('overlay').classList.add('show');
        }
    });

    // Navigation entre onglets
    const navBtns = document.querySelectorAll('.tab-btn');
    navBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
            navBtns.forEach(b => b.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        };
    });

    // Slider
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    function move(n) {
        slides[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
    }
    document.querySelector('.next').onclick = () => move(current + 1);
    document.querySelector('.prev').onclick = () => move(current - 1);

    // Ouvrir/Fermer
    document.getElementById('open-cart-btn').onclick = () => {
        document.getElementById('cart-panel').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-panel').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    };
});
