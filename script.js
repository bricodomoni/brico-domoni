document.addEventListener('DOMContentLoaded', () => {
    
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    let panier = [];

    const container = document.getElementById('product-list');
    if (container) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p style="color:#ff9800; font-size:1.2rem; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
                <button class="tab-btn add-to-cart-btn" data-id="${p.id}" style="width:100%">Ajouter au panier</button>
            `;
            container.appendChild(card);
        });
    }

    function updateCartUI() {
        const container = document.getElementById('cart-items-container');
        const totalEl = document.getElementById('cart-total');
        const badge = document.querySelector('.cart-count');
        
        container.innerHTML = panier.length === 0 ? "<p>Votre panier est vide</p>" : "";
        let total = 0, count = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            count += item.qty;
            const div = document.createElement('div');
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.marginBottom = "10px";
            div.innerHTML = `
                <span>${item.nom} (x${item.qty})</span>
                <div class="qty-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            `;
            container.appendChild(div);
        });

        totalEl.innerText = total.toLocaleString() + " KMF";
        badge.innerText = count;
    }

    document.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains('add-to-cart-btn')) {
            const prod = produits.find(p => p.id === id);
            const exist = panier.find(item => item.id === id);
            if (exist) exist.qty++; else panier.push({ ...prod, qty: 1 });
            updateCartUI();
            document.getElementById('cart-panel').classList.add('open');
            document.getElementById('overlay').classList.add('show');
        }

        if (e.target.classList.contains('plus')) {
            panier.find(i => i.id === id).qty++;
            updateCartUI();
        }

        if (e.target.classList.contains('minus')) {
            const item = panier.find(i => i.id === id);
            item.qty--;
            if (item.qty <= 0) panier = panier.filter(i => i.id !== id);
            updateCartUI();
        }
    });

    document.getElementById('open-cart-btn').onclick = () => {
        document.getElementById('cart-panel').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-panel').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    };

    const navBtns = document.querySelectorAll('.tab-btn');
    navBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;
            if (!target) return;
            document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
            navBtns.forEach(b => b.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            btn.classList.add('active');
        };
    });

    document.getElementById('whatsapp-order-btn').onclick = () => {
        if (panier.length === 0) return alert("Panier vide");
        let msg = "Commande Brico Domoni :\n";
        panier.forEach(i => msg += `- ${i.nom} x${i.qty}\n`);
        msg += `Total: ${document.getElementById('cart-total').innerText}`;
        window.open(`https://wa.me/2693330000?text=${encodeURIComponent(msg)}`);
    };
    <script src="script.js"></script>
</body>
</html>
});
