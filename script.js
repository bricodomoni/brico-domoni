// LISTE DES PRODUITS AVEC CATÉGORIES
const products = [
    { name: "Marteau", price: 2500, image: "marteau.jpg", category: "Outils" },
    { name: "Tournevis", price: 1500, image: "tournevis.jpg", category: "Outils" },
    { name: "Clé plate", price: 1800, image: "cle.jpg", category: "Outils" },
    { name: "Pince", price: 2200, image: "pince.jpg", category: "Outils" },

    { name: "Ampoule LED", price: 500, image: "ampoule.jpg", category: "Électricité" },
    { name: "Rallonge électrique", price: 3500, image: "rallonge.jpg", category: "Électricité" },

    { name: "Raccord plomberie", price: 300, image: "raccord.jpg", category: "Plomberie" },
    { name: "Tuyau PVC", price: 1200, image: "tuyau.jpg", category: "Plomberie" },

    { name: "Gants de travail", price: 800, image: "gants.jpg", category: "Accessoires" },
    { name: "Ruban adhésif", price: 400, image: "ruban.jpg", category: "Accessoires" }
];

const productList      = document.getElementById("product-list");
const cartItems        = document.getElementById("cart-items");
const totalDisplay     = document.getElementById("total");
const whatsappBtn      = document.getElementById("whatsapp-btn");
const cartCount        = document.getElementById("cart-count");
const cartPanel        = document.getElementById("cart-panel");
const cartIcon         = document.querySelector(".cart-icon");
const overlay          = document.getElementById("overlay");
const closeCart        = document.getElementById("close-cart");

const menuToggle       = document.getElementById("menu-toggle");
const mobileMenu       = document.getElementById("mobile-menu");

const addAlert         = document.getElementById("add-alert");

const searchInput      = document.getElementById("search-input");
const resultCount      = document.getElementById("result-count");
const sortSelect       = document.getElementById("sort-select");
const categoryButtons  = document.querySelectorAll(".cat-btn");

let cart = [];

// AFFICHAGE GÉNÉRAL DES PRODUITS
function displayProducts(category = "all") {
    productList.innerHTML = "";

    let filtered = category === "all"
        ? products
        : products.filter(p => p.category === category);

    filtered.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image}" class="product-img">
            <h4>${p.name}</h4>
            <p>${p.price} KMF</p>
            <button onclick="addToCart(${products.indexOf(p)})">Ajouter</button>
        `;
        productList.appendChild(div);
    });
}

// AFFICHAGE D’UNE LISTE FILTRÉE (recherche / tri / catégories)
function displayFilteredProducts(list) {
    productList.innerHTML = "";

    list.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.image}" class="product-img">
            <h4>${p.name}</h4>
            <p>${p.price} KMF</p>
            <button onclick="addToCart(${products.indexOf(p)})">Ajouter</button>
        `;
        productList.appendChild(div);
    });
}

// AJOUT AU PANIER
function addToCart(i) {
    const product = products[i];
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    showAddAlert();
}

// MISE À JOUR DU PANIER
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - ${item.price} KMF × ${item.quantity}
            <button onclick="increaseQuantity(${index})">+</button>
            <button onclick="decreaseQuantity(${index})">-</button>
        `;
        cartItems.appendChild(li);
    });

    totalDisplay.textContent = total;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    const message = encodeURIComponent(
        "Bonjour, je souhaite commander :\n\n" +
        cart.map(i => `- ${i.name} × ${i.quantity} (${i.price * i.quantity} KMF)`).join("\n") +
        `\n\nTotal : ${total} KMF`
    );

    whatsappBtn.href = `https://wa.me/2694484047?text=${message}`;
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decreaseQuantity(index) {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

// OUVERTURE / FERMETURE DU PANIER
cartIcon.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
    overlay.classList.toggle("show");
});

closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
});

// OVERLAY : ferme tout
overlay.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    overlay.classList.remove("show");
});

// MENU MOBILE
menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("open");
    overlay.classList.toggle("show");
});

// NOTIFICATION AJOUT PANIER
function showAddAlert() {
    addAlert.classList.add("show");

    setTimeout(() => {
        addAlert.classList.remove("show");
    }, 2000);
}

// CATÉGORIES
categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Retirer l'état actif
        categoryButtons.forEach(b => b.classList.remove("active"));

        // Ajouter l'état actif
        btn.classList.add("active");

        // Filtrer par catégorie
        const cat = btn.getAttribute("data-category");

        let filtered = cat === "all"
            ? products
            : products.filter(p => p.category === cat);

        // Appliquer la recherche si active
        const text = searchInput.value.toLowerCase();
        if (text !== "") {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(text)
            );
        }

        // Appliquer le tri si actif
        filtered = applySort(filtered);

        displayFilteredProducts(filtered);
        updateResultCount(filtered);
    });
});

// RECHERCHE + COMPTEUR
searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase();

    // Catégorie active
    const activeCat = document.querySelector(".cat-btn.active").dataset.category;

    let list = activeCat === "all"
        ? products
        : products.filter(p => p.category === activeCat);

    // Filtre recherche
    list = list.filter(p =>
        p.name.toLowerCase().includes(text)
    );

    // Tri
    list = applySort(list);

    displayFilteredProducts(list);
    updateResultCount(list);
});

// TRI
sortSelect.addEventListener("change", () => {
    // Catégorie active
    const activeCat = document.querySelector(".cat-btn.active").dataset.category;

    let list = activeCat === "all"
        ? products
        : products.filter(p => p.category === activeCat);

    // Recherche active
    const text = searchInput.value.toLowerCase();
    if (text !== "") {
        list = list.filter(p => p.name.toLowerCase().includes(text));
    }

    // Tri
    list = applySort(list);

    displayFilteredProducts(list);
    updateResultCount(list);
});

// FONCTION DE TRI
function applySort(list) {
    const value = sortSelect.value;
    let sorted = [...list];

    if (value === "price-asc") {
        sorted.sort((a, b) => a.price - b.price);
    }
    if (value === "price-desc") {
        sorted.sort((a, b) => b.price - a.price);
    }
    if (value === "az") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (value === "za") {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
}

// COMPTEUR
function updateResultCount(list) {
    if (list.length === 0) {
        resultCount.textContent = "Aucun produit trouvé";
    } else if (list.length === 1) {
        resultCount.textContent = "1 produit trouvé";
    } else {
        resultCount.textContent = list.length + " produits trouvés";
    }
}

// AU CHARGEMENT : afficher tous les produits
displayProducts();
updateResultCount(products);
