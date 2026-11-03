/* ==========================================================
   ALNS OFFICIAL MARKET
   SHARED JAVASCRIPT FOR ALL WEBSITE PAGES
   ========================================================== */

"use strict";

// ========================================
// 01. STORAGE SETTINGS
// ========================================

const CART_KEY = "alnsCart";
const WISHLIST_KEY = "alnsWishlist";

const PRODUCTS = [
    { name: "Everyday Black Tee", price: 499, image: "./images/product-tshirt.jpg" },
    { name: "Basic Hoodie", price: 899, image: "./images/product-hoodie.jpg" },
    { name: "Cargo Pants", price: 1299, image: "./images/product-pants.jpg" },
    { name: "Utility Jacket", price: 1499, image: "./images/product-jacket.jpg" },
    { name: "Relaxed Shorts", price: 799, image: "./images/product-shorts.jpg" },
    { name: "Classic Black Cap", price: 599, image: "./images/product-cap.jpg" }
];

function readStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch (error) {
        console.warn("Could not read saved data:", error);
        return fallback;
    }
}

let cart = readStorage(CART_KEY, []);
let wishlist = readStorage(WISHLIST_KEY, []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(wishlist)) wishlist = [];


// ========================================
// 02. SAVE AND FORMAT CART
// ========================================

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function money(value) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
}

function cartQuantity() {
    return cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );
}

function cartSubtotal() {
    return cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );
}


// ========================================
// 03. SHARED HEADER
// ONE HEADER FOR ALL THREE HTML PAGES
// ========================================

function renderSharedHeader() {

    const mount = document.getElementById("site-header");

    if (!mount) return;

    const page = location.pathname.split("/").pop().toLowerCase();

    const homeActive = page === "" || page === "index.html";
    const shopActive = page === "products.html";

    mount.innerHTML = `

        <div class="announcement-bar">

            <div class="announcement-message">
                <span>🚚</span>
                <span>FREE SHIPPING ON ORDERS ₱2,000+</span>
            </div>

            <div class="announcement-links">

                <a href="track-order.html">📈 Track Order</a>

                <span>|</span>

                <a href="help.html">Help</a>

                <span>|</span>

                <a href="login.html">♙ Login / Register</a>

            </div>

        </div>


        <header class="site-header">

            <a class="brand" href="index.html#home"
               aria-label="ALNS Official Market home">

                <img
                    class="brand-logo"
                    src="./images/ALNS Official.png"
                    alt="ALNS Official Market"
                >

                <span class="brand-subtitle">
                    OFFICIAL MARKET
                </span>

            </a>


            <nav class="main-nav" aria-label="Main navigation">

                <a class="nav-link ${homeActive ? "active" : ""}"
                   href="index.html#home">
                    Home
                </a>

                <a class="nav-link ${shopActive ? "active" : ""}"
                   href="products.html">
                    Shop
                </a>

                <a class="nav-link"
                   href="index.html#categories">
                    Categories
                </a>

                <a class="nav-link"
                   href="index.html#footer">
                    About Us
                </a>

                <a class="nav-link"
                   href="index.html#footer">
                    Contact
                </a>

            </nav>


            <div class="header-actions">

                <form class="header-search"
                      id="siteSearch"
                      action="products.html"
                      method="get">

                    <button type="submit" aria-label="Search">
                        ⌕
                    </button>

                    <input
                        type="search"
                        name="q"
                        placeholder="Search for products..."
                        aria-label="Search products"
                    >

                </form>


                <button
                    class="header-icon wishlist-header"
                    type="button"
                    aria-label="View wishlist"
                    title="Wishlist">
                    ♡
                </button>


                <a class="header-icon cart-icon"
                   href="cart.html"
                   aria-label="Shopping cart">

                    🛒

                    <span class="cart-count" id="cartCount">
                        0
                    </span>

                </a>

            </div>

        </header>

    `;


    // KEEP SEARCH TEXT WHEN CHANGING PAGES

    const searchInput = mount.querySelector('input[name="q"]');

    const params = new URLSearchParams(location.search);

    if (searchInput) {
        searchInput.value = params.get("q") || "";
    }


    // WISHLIST BUTTON

    mount.querySelector(".wishlist-header")?.addEventListener(
        "click",
        () => {

            const saved = wishlist.length;

            alert(
                saved
                    ? `You have ${saved} saved item(s). Wishlist items are marked with a pink heart.`
                    : "Your wishlist is empty. Tap a heart on a product to save it."
            );

        }
    );

}


// ========================================
// 04. UPDATE CART COUNTER
// ========================================

function updateCartBadge() {

    const badge = document.getElementById("cartCount");

    if (badge) {
        badge.textContent = cartQuantity();
    }

}


// ========================================
// 05. ADD PRODUCT TO CART
// ========================================

function addToCart(product, quantity = 1) {

    const existing = cart.find(
        item => item.name === product.name
    );

    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({
            ...product,
            quantity
        });

    }

    saveCart();

}


// ========================================
// 06. GET PRODUCT INFORMATION
// ========================================

function productFromButton(button) {

    const card = button.closest(".product-card");

    if (!card) return null;

    const name =
        button.dataset.product ||
        card.querySelector("h3")?.textContent.trim();

    const price = Number(
        button.dataset.price ||
        card.querySelector("[data-price]")?.dataset.price
    );

    const image =
        card.querySelector(".product-image")?.getAttribute("src") || "";

    if (
        !name ||
        !Number.isFinite(price) ||
        price <= 0
    ) {

        console.error(
            "Product is missing a valid name or data-price:",
            card
        );

        alert(
            "This product is not set up correctly yet. Please check its data-price."
        );

        return null;
    }

    return {
        name,
        price,
        image
    };

}


// ========================================
// 07. PRODUCT CARDS AND BUY NOW BUTTON
// ========================================

function setupProductCards() {

    document.querySelectorAll(".product-card").forEach(card => {

        const addButton = card.querySelector(".add-to-cart");

        if (!addButton) return;


        // CREATE BUY NOW BUTTON

        if (!card.querySelector(".buy-now")) {

            const buyButton = document.createElement("button");

            buyButton.type = "button";

            buyButton.className = "buy-now";

            buyButton.textContent = "BUY NOW";

            addButton.insertAdjacentElement(
                "afterend",
                buyButton
            );

        }


        // WISHLIST STATUS

        const name =
            addButton.dataset.product ||
            card.querySelector("h3")?.textContent.trim();

        card.querySelector(".wishlist-btn")?.classList.toggle(
            "active",
            wishlist.includes(name)
        );

        card.querySelector(".wishlist-btn")?.setAttribute(
            "aria-pressed",
            wishlist.includes(name) ? "true" : "false"
        );


        // WISHLIST CLICK

        card.querySelector(".wishlist-btn")?.addEventListener(
            "click",
            () => toggleWishlist(name)
        );

    });

}


// ========================================
// 08. WISHLIST FUNCTION
// ========================================

function toggleWishlist(name) {

    if (!name) return;

    wishlist = wishlist.includes(name)
        ? wishlist.filter(item => item !== name)
        : [...wishlist, name];

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );


    document.querySelectorAll(".product-card").forEach(card => {

        const button = card.querySelector(".wishlist-btn");

        const cardName =
            card.querySelector("h3")?.textContent.trim();

        if (button && cardName === name) {

            button.classList.toggle(
                "active",
                wishlist.includes(name)
            );

            button.setAttribute(
                "aria-pressed",
                wishlist.includes(name) ? "true" : "false"
            );

            button.textContent =
                wishlist.includes(name) ? "♥" : "♡";

        }

    });

}


// ========================================
// 09. ADD TO CART AND BUY NOW EVENTS
// ========================================

document.addEventListener("click", function(event) {


    // ADD TO CART

    const addButton = event.target.closest(".add-to-cart");

    if (addButton) {

        const product = productFromButton(addButton);

        if (!product) return;

        addToCart(product);

        const oldText = addButton.textContent;

        addButton.textContent = "✓ ADDED";

        setTimeout(() => {

            addButton.textContent = oldText;

        }, 1100);

        return;

    }


    // BUY NOW

    const buyButton = event.target.closest(".buy-now");

    if (buyButton) {

        const product = productFromButton(buyButton);

        if (!product) return;

        addToCart(product);

        location.href = "cart.html#checkout";

    }

});


// ========================================
// 10. DISPLAY SHOPPING CART
// ========================================

function renderCartPage() {

    const list = document.getElementById("cartItems");

    if (!list) return;

    list.innerHTML = "";


    // EMPTY CART

    if (!cart.length) {

        list.innerHTML = `

            <div class="empty-cart">

                <h3>Your cart is empty.</h3>

                <p>
                    Add products to your cart to see them here.
                </p>

                <a class="primary-button" href="products.html">
                    CONTINUE SHOPPING
                </a>

            </div>

        `;

    } else {


        // DISPLAY EACH PRODUCT

        cart.forEach((item, index) => {

            const row = document.createElement("article");

            row.className = "cart-row";


            // PRODUCT IMAGE

            const img = document.createElement("img");

            img.className = "cart-row-image";

            img.src = item.image || "";

            img.alt = item.name;

            img.onerror = () => {
                img.style.visibility = "hidden";
            };


            // PRODUCT DETAILS

            const details = document.createElement("div");

            details.className = "cart-row-details";


            const title = document.createElement("h3");

            title.textContent = item.name;


            const price = document.createElement("p");

            price.textContent = money(item.price) + " each";


            // QUANTITY CONTROLS

            const qty = document.createElement("div");

            qty.className = "cart-quantity";


            const minus = document.createElement("button");

            minus.type = "button";

            minus.textContent = "−";

            minus.setAttribute(
                "aria-label",
                "Decrease quantity"
            );

            minus.addEventListener("click", () => {
                changeQuantity(index, -1);
            });


            const number = document.createElement("span");

            number.textContent = item.quantity;


            const plus = document.createElement("button");

            plus.type = "button";

            plus.textContent = "+";

            plus.setAttribute(
                "aria-label",
                "Increase quantity"
            );

            plus.addEventListener("click", () => {
                changeQuantity(index, 1);
            });


            qty.append(minus, number, plus);


            // PRODUCT SUBTOTAL

            const line = document.createElement("strong");

            line.className = "cart-line-total";

            line.textContent = money(
                item.price * item.quantity
            );


            details.append(
                title,
                price,
                qty,
                line
            );


            // REMOVE BUTTON

            const remove = document.createElement("button");

            remove.type = "button";

            remove.className = "cart-remove";

            remove.textContent = "×";

            remove.setAttribute(
                "aria-label",
                "Remove " + item.name
            );

            remove.addEventListener("click", () => {
                removeCartItem(index);
            });


            row.append(
                img,
                details,
                remove
            );

            list.append(row);

        });

    }


    // UPDATE TOTAL

    const subtotal = cartSubtotal();

    const subtotalEl =
        document.getElementById("cartSubtotal");

    const totalEl =
        document.getElementById("cartTotal");

    if (subtotalEl) {
        subtotalEl.textContent = money(subtotal);
    }

    if (totalEl) {
        totalEl.textContent = money(subtotal);
    }

    updateCartBadge();

}


// ========================================
// 11. CHANGE PRODUCT QUANTITY
// ========================================

function changeQuantity(index, amount) {

    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    renderCartPage();

}


// ========================================
// 12. REMOVE PRODUCT FROM CART
// ========================================

function removeCartItem(index) {

    cart.splice(index, 1);

    saveCart();

    renderCartPage();

}


// ========================================
// 13. CHECKOUT
// ========================================

function setupCheckout() {

    const goButton =
        document.getElementById("goToCheckout");

    const checkout =
        document.getElementById("checkout");

    const form =
        document.getElementById("checkoutForm");


    // PROCEED TO CHECKOUT BUTTON

    if (goButton && checkout) {

        goButton.addEventListener("click", () => {

            if (!cart.length) {

                alert(
                    "Your cart is empty. Add a product before checkout."
                );

                return;

            }

            checkout.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    if (!form) return;


    // PLACE ORDER BUTTON

    form.addEventListener("submit", event => {

        event.preventDefault();


        if (!cart.length) {

            alert(
                "Your cart is empty. Add products before placing an order."
            );

            return;

        }


        if (!form.reportValidity()) return;


        // CUSTOMER INFORMATION

        const customer = Object.fromEntries(
            new FormData(form).entries()
        );


        // ORDER INFORMATION

        const order = {

            orderNumber:
                "ALNS-" + Date.now().toString().slice(-8),

            createdAt: new Date().toISOString(),

            customer: customer,

            items: cart,

            subtotal: cartSubtotal(),

            shipping: "To be confirmed by seller",

            total: cartSubtotal(),

            status: "Pending seller confirmation"

        };


        // SAVE ORDER IN BROWSER

        const orders = readStorage("alnsOrders", []);

        orders.push(order);

        localStorage.setItem(
            "alnsOrders",
            JSON.stringify(orders)
        );


        // CLEAR SHOPPING CART

        cart = [];

        saveCart();

        renderCartPage();


        // HIDE CHECKOUT FORM

        form.hidden = true;


        // SHOW ORDER CONFIRMATION

        const confirmation =
            document.getElementById("orderConfirmation");

        if (confirmation) {

            confirmation.hidden = false;

            confirmation.innerHTML = `

                <h2>
                    Thank you! Your order details have been saved.
                </h2>

                <p>
                    <strong>Order number:</strong>
                    ${order.orderNumber}
                </p>

                <p>
                    <strong>Name:</strong>
                    ${escapeHTML(customer.fullName || "")}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${escapeHTML(customer.paymentMethod || "")}
                </p>

                <p>
                    <strong>Order total (shipping not included):</strong>
                    ${money(order.total)}
                </p>

                <p class="checkout-disclaimer">

                    This is a front-end demonstration only.
                    ALNS will not receive this order automatically.
                    Connect a secure order service or backend before
                    accepting real customer orders or payments.

                </p>

                <a class="primary-button" href="products.html">
                    CONTINUE SHOPPING
                </a>

            `;

        }

    });

}


// ========================================
// 14. HTML SECURITY HELPER
// ========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

    })[char]);

}


// ========================================
// 15. PRODUCT SEARCH
// ========================================

function setupSearch() {

    const params = new URLSearchParams(location.search);

    const query = (params.get("q") || "")
        .trim()
        .toLowerCase();

    if (!query) return;


    const cards = [
        ...document.querySelectorAll(".product-card")
    ];

    let matches = 0;


    cards.forEach(card => {

        const text = card.textContent.toLowerCase();

        const show = text.includes(query);

        card.hidden = !show;

        if (show) matches++;

    });


    const grid = document.querySelector(".product-grid");


    if (grid && matches === 0) {

        const note = document.createElement("p");

        note.className = "no-search-results";

        note.textContent =
            `No products found for “${params.get("q")}”.`;

        grid.before(note);

    }

}


// ========================================
// 16. START WEBSITE
// RUN ON ALL THREE HTML PAGES
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    renderSharedHeader();

    setupProductCards();

    updateCartBadge();

    renderCartPage();

    setupCheckout();

    setupSearch();

    console.log(
        "ALNS Official Market - Website Loaded Successfully!"
    );

});