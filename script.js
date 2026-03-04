document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DES ONGLETS (TABS) ---
    const btns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-content');

    btns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.tab;

            // Désactiver tout
            btns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Activer le cliqué
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        };
    });

    // --- 2. LOGIQUE DU SLIDER ---
    const slidesContainer = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    let index = 0;

    document.querySelector('.next').onclick = () => {
        index = (index + 1) % totalSlides;
        updateSlider();
    };

    document.querySelector('.prev').onclick = () => {
        index = (index - 1 + totalSlides) % totalSlides;
        updateSlider();
    };

    function updateSlider() {
        slidesContainer.style.transform = `translateX(${-index * 100}%)`;
    }

    // --- 3. AFFICHAGE DES PRODUITS ---
    const produits = [
        { name: "Brouette Verte", price: 25000, img: "Images/Brouette.jpg" },
        { name: "Disque de coupe", price: 3500, img: "Images/9641602024.jpg" },
        { name: "Évier Inox", price: 45000, img: "Images/AST187429-XL.jpg" }
    ];

    const grid = document.getElementById('product-list');
    
    produits.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <p><strong>${p.price.toLocaleString()} KMF</strong></p>
            <button class="add-cart-btn">Ajouter au panier</button>
        `;
        grid.appendChild(card);
    });
});
