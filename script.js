document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DONNÉES ---
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" },
        { id: 3, nom: "Évier Inox", prix: 45000, img: "Images/AST187429-XL.jpg" }
    ];
    let panier = [];

    // --- 2. AFFICHAGE PRODUITS ---
    const container = document.getElementById('product-list');
    produits.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.nom}">
            <h3>${p.nom}</h3>
            <p style="color:#ff9800; font-weight:bold;">${p.prix.toLocaleString()} KMF</p>
            <button class="add-to-cart-btn" data-id="${p.id}" style="background:#002147; color:white; border:none; padding:10px; cursor:pointer; width:100%;">Ajouter au panier</button>
        `;
        container.appendChild(card);
    });

    // --- 3. DIAPORAMA (SLIDER) ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    document.querySelector('.next').onclick = () => showSlide(currentSlide + 1);
    document.querySelector('.prev').onclick = () => showSlide(currentSlide - 1);
    setInterval(() => showSlide(currentSlide + 1), 5000); // Défilement auto

    // --- 4. PANIER ---
    function updateCartUI() {
        const cartItems = document.getElementById('cart-items-container');
        const totalEl = document.getElementById('cart-total');
        const badge = document.querySelector('.cart-count');
        
        cartItems.innerHTML = panier.length === 0 ? "<p>Panier vide</p>" : "";
        let total = 0;
        let count = 0;

        panier.forEach(item => {
            total += item.prix * item.qty;
            count += item.qty;
            const itemDiv = document.createElement('div');
            itemDiv.style.borderBottom = "1px solid #eee";
            itemDiv.innerHTML = `<p>${item.nom} x${item.qty} <br> <b>${(item.prix * item.qty).toLocaleString()} KMF</b></p>`;
            cartItems.appendChild(itemDiv);
        });

        totalEl.innerText = total.toLocaleString() + " KMF";
        badge.innerText = count;
    }

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

    // Boutons Fermer/Ouvrir Panier
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-panel').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    };
    document.getElementById('open-cart-btn').onclick = () => {
        document.getElementById('cart-panel').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };

    // Commande WhatsApp
    document.getElementById('whatsapp-order-btn').onclick = () => {
        if (panier.length === 0) return alert("Votre panier est vide");
        let message = "Bonjour Brico Domoni, je souhaite commander :\n";
        panier.forEach(i => message += `- ${i.nom} (x${i.qty})\n`);
        message += `Total : ${document.getElementById('cart-total').innerText}`;
        window.open(`https://wa.me/2693330000?text=${encodeURIComponent(message)}`);
    };

    // Navigation Onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.add('active');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });
});
