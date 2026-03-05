document.addEventListener('DOMContentLoaded', () => {

   // --- 1. LISTE DES PRODUITS ---
    const produits = [
        { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
        { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
        { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
    ];

    const productList = document.getElementById('product-list');

    if (productList) {
        produits.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nom}">
                <h3>${p.nom}</h3>
                <p class="price">${p.prix.toLocaleString()} KMF</p>
                <button class="add-to-cart-btn" data-id="${p.id}">Ajouter au panier</button>
            `;
            productList.appendChild(card);
        });
    }
    
    // --- GESTION DU SLIDER ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let index = 0;

    function changerSlide(n) {
        slides[index].classList.remove('active'); // On cache l'actuelle
        index = (n + slides.length) % slides.length; // On calcule la suivante
        slides[index].classList.add('active'); // On affiche la nouvelle
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => changerSlide(index + 1));
        prevBtn.addEventListener('click', () => changerSlide(index - 1));
    }

    // Automatique toutes les 5 secondes
    setInterval(() => changerSlide(index + 1), 5000);

    // --- GESTION DES ONGLETS ---
    const boutons = document.querySelectorAll('.tab-btn');
    boutons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cible = btn.getAttribute('data-tab');
            
            // Masquer tout
            document.querySelectorAll('.tab-content').forEach(section => {
                section.classList.remove('active');
            });
            boutons.forEach(b => b.classList.remove('active'));

            // Afficher la cible
            document.getElementById(cible).classList.add('active');
            btn.classList.add('active');
        });
    });
});

// --- 1. LISTE DES PRODUITS ---
const produits = [
    { id: 1, nom: "Brouette Verte", prix: 25000, img: "Images/Brouette.jpg" },
    { id: 2, nom: "Évier Inox Double", prix: 45000, img: "Images/AST187429-XL.jpg" },
    { id: 3, nom: "Pelle de chantier", prix: 7500, img: "Images/9641602024.jpg" }
];

const container = document.getElementById('product-list');

if (container) {
    produits.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.nom}">
            <h3>${p.nom}</h3>
            <p class="price">${p.prix.toLocaleString()} KMF</p>
            <button class="add-to-cart-btn" data-id="${p.id}" style="width:100%; padding:10px; cursor:pointer;">Ajouter au panier</button>
        `;
        container.appendChild(card);
    });
}
