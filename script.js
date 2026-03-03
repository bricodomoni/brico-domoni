// LISTE DES PRODUITS
const products = [
    { name: "Marteau", price: 2500 },
    { name: "Tournevis", price: 1500 },
    { name: "Clé plate", price: 1800 },
    { name: "Pince", price: 2200 },
    { name: "Ampoule LED", price: 500 },
    { name: "Raccord plomberie", price: 300 }
];

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const totalDisplay = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp-btn");

let cart = [];

// AFFICHAGE DES PRODUITS
products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
        <h4>${p.name}</h4>
        <p>${p.price} KMF</p>
        <button onclick="addToCart(${index})">Ajouter</button>
    `;
    productList.appendChild(div);
});

// AJOUT AU PANIER
function addToCart(i) {
    cart.push(products[i]);
    updateCart();
}

// MISE À JOUR DU PANIER
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price} KMF`;
        cartItems.appendChild(li);
    });

    totalDisplay.textContent = total;

    const message = encodeURIComponent(
        "Bonjour, je souhaite commander :\n\n" +
        cart.map(i => `- ${i.name} (${i.price} KMF)`).join("\n") +
        `\n\nTotal : ${total} KMF`
    );

    whatsappBtn.href = `https://wa.me/2694484047?text=${message}`;
}
