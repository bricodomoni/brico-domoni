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
const cartCount = document.getElementById("cart-count");

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

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}
