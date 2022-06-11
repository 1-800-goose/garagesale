"use strict";

(function() {
  // to see who the current user is and current cart.
  // let currentUser = window.localStorage.getItem("username");
  // let currentUserData = window.localStorage.getItem("user");
  // let currentCartData = window.localStorage.getItem("cart");

  // for filtering purposes, if you want to use filter and search combine.
  // let searchBarValue = null;

  const PHOTOS = ["bucket.png", "chocolate.png", "hairdryer.png", "hangers.png", "jacket.png",
   "ketchup.png", "lights.png", "mirror.png", "pillow.png", "towel.png"];
  const PHOTOS_ALT = ["a halloween bucket", "a box of swiss miss", "a hairdryer",
   "a bunch of hangers", "a jean jacket", "ketchup packets", "christmas lights", "bathroom mirror",
   "a pillow", "a towel"];
  const TITLE = ["bucket", "chocolate", "hairdryer", "hangers", "jacket", "ketchup", "lights",
   "mirror", "pillow", "towel"];
  const DESC = [
    "I bought this halloween bucket at target to store my keys. Please take him!! He deserves a new home",
    "My roommates and I pooled our hot chocolate packets we kept getting from care packages. Please god take them we have so many.",
    "I bought this hairdryer and I forgot to put it into storage :( ",
    "My roommate dropped out and left me with separation anxiety and one billion hangers :( I don't need any of them please take them!!",
    "I bought this jacket and never wore it. It's perfectly fine I just don't think denim's my thing. It's new <3 please take!",
    "I didn't really know what to do with the sauces I got from take out so I just collected them. Uhhhhhhhhh",
    "I've had these Christmas lights for years. I've developed an emotional attachment to them, but sadly it is time for them and me to part ways. Please take care of them, they are very pretty (also broken lol)",
    "I hate this mirror. It's perfectly fine. I just hate it.",
    "This pillow cost $4 at Target. I don't want to take it home. You can have it!",
    "My roommate bought a few towels, forgot them in his closet, and then never used them. They could be yours!"
  ];
  const PRICE = [0.00, 2.00, 10.00, 0.00, 20.00, 0.00, 1.00, 2.00, 0.50, 5.00];
  const RATING = [5, 4, 5, 3, 5, 3, 4, 0, 2, 3];
  const TAG = ["free", "none", "none", "free", "none", "free", "sale", "sale", "sale", "sale"];

  window.addEventListener("load", init);

  /**
   * At launch, all the functionally of buttons, forms, user-interactive aspects are added, cart
   * items are generated if needed and displays the menu.
   */
  function init() {
    let homeButtons = qsa(".home-btn");

    showMenu();
    addEventListeners();

    for (let i = 0; i < homeButtons.length; i++) {
      homeButtons[i].addEventListener("click", function() {
        homeView();
      });
    }
  }

  /**
   * For the majority of buttons, their functionally and functions are added to be ran when needed.
   */
  function addEventListeners() {
    id("open").addEventListener("click", open);
    id("close").addEventListener("click", close);
    id("checkout").addEventListener("click", checkout);
    id("checkout").disabled = true;

    id("cart-btn").addEventListener("click", displayCart);
    // id("redirect").addEventListener("click", displayAccount);
    // id("checkout").addEventListener("click", confirmationSwitch);
    // id("confirm").addEventListener("click", checkoutTime);

    // id("search-btn").addEventListener("click", searchRequest);
    id("free").addEventListener("click", filter);
    id("free-nav").addEventListener("click", filter);
    id("sale").addEventListener("click", filter);
    id("sale-nav").addEventListener("click", filter);

  }

  /**
   * For the filter aside bar, the open function, opens the aside bar.
   */
  function open() {
    id("open").classList.add("hidden");
    id("aside").classList.add("open-aside");
    id("main").classList.add("open-main");
  }

  /**
   * For the filter aside bar, the close function, closes the aside bar.
   */
  function close() {
    id("aside").classList.remove("open-aside");
    id("main").classList.remove("open-main");
    id("open").classList.remove("hidden");
  }

  function showAll() {
    let sort = qsa("#items article");
    for (let i = 0; i < sort.length; i++) {
      sort[i].classList.remove("hidden");
    }
  }

  /**
   * Displays the cart view, when the function is activated.
   */
   function displayCart() {
    close();
    id("home").classList.add("hidden");
    id("item").classList.add("hidden");
    id("cart").classList.remove("hidden");
  }

  /**
   * displays menu
   */
  function showMenu() {
    let cards = qsa("#items article");

    if (cards.length === 0) {
      for (let i = 0; i < PHOTOS.length; i++) {
        let card = gen("article");
        card.classList.add("card");
        card.classList.add(TAG[i]);

        let img = gen("img");
        img.src = "img/" + PHOTOS[i];
        img.alt = PHOTOS_ALT[i];
        let name = gen("p");
        name.textContent = TITLE[i];

        card.appendChild(img);
        card.appendChild(name);

        card.addEventListener("click", itemView);
        id("items").appendChild(card);
      }
    } else {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("hidden");
      }
    }
  }

  /**
   * When a filter button is pressed, this function calls the filter request to get all the items
   * that matches the filter request in addition to the search bar value if present.
   */
  function filter() {
    filterView();
    let type = this.textContent.trim();
    let filterButtons = qsa("aside li");

    let sort = qsa("#items article");
    for (let i = 0; i < sort.length; i++) {
      if (!sort[i].classList.contains(type)) {
        sort[i].classList.add("hidden");
      }
    }

  }

  /**
   * Changes the filter view when filter button is pressed.
   */
  function filterView() {
    id("cart").classList.add("hidden");
    id("item").classList.add("hidden");
    id("home").classList.remove("hidden");
    showAll();
  }

  /**
   * Switches the view to the detailed individual item view, and sends a request to get the item
   * data.
   */
  function itemView() {
    id("item").innerHTML = "";
    id("home").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("item").classList.remove("hidden");

    let name = this.getElementsByTagName("p")[0].textContent;
    displaySelectedItem(name);
  }

  /**
   * Displays the main home menu grid view when the function is activated.
   */
  function homeView() {
    close();
    id("cart").classList.add("hidden");
    id("item").classList.add("hidden");
    id("home").classList.remove("hidden");
    let cards = qsa(".card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("hidden");
    }
  }

  /**
   * Generates the item view based on the item data given and displays it to the user.
   * @param {Object} resp - itemView API response data.
   */
   function displaySelectedItem(name) {
    let check = name;
    let chosen;
    for (let i = 0; i < PHOTOS.length; i++) {
      if (TITLE[i] == check){
        chosen = i;

      }
    }
    let card = gen("article");
    card.classList.add("selected-item");
    let colOne = generatedColumnOne(chosen);
    let colTwo = generatedColumnTwo(chosen);

    id("item").appendChild(card);
    card.appendChild(colOne);
    card.appendChild(colTwo);
  }

  /**
   * This function generates the first element for the displaySelectedItem which includes the
   * rating and the item photo.
   * @param {Object} resp - itemView API response data.
   * @returns {HTMLElement} - Column one div.
   */
  function generatedColumnOne(chosen) {
    let colOne = gen("div");
    colOne.id = "colOne";
    let newPhoto = gen("img");
    newPhoto.src = "img/" + PHOTOS[chosen];
    newPhoto.alt = PHOTOS_ALT[chosen];
    let rating = gen("p");
    for (let i = 0; i < RATING[chosen]; i++) {
      let heart = gen("img");
      heart.src = "img/full-heart.png";
      heart.alt = "full heart";
      heart.classList.add("heart");
      rating.appendChild(heart);
    }
    for (let i = RATING[chosen]; i < 5; i++) {
      let white = gen("img");
      white.src = "img/unfull-heart.png";
      white.alt = "unfull heart";
      white.classList.add("heart");
      rating.appendChild(white);
    }
    colOne.appendChild(newPhoto);
    colOne.appendChild(rating);
    return colOne;
  }

  /**
   * This function generates the second element for the displaySelectedItem which includes the
   * name, price, description, stock, the ability to purchase.
   * @param {Object} resp - itemView API response data.
   * @returns {HTMLElement} - Column two div.
   */
  function generatedColumnTwo(chosen) {
    let colTwo = gen("div");
    colTwo.id = "colTwo";
    let name = gen("h2");
    name.textContent = TITLE[chosen];
    let price = gen("p");
    price.textContent = "$" + PRICE[chosen];
    let desc = gen("p");
    desc.textContent = DESC[chosen];
    colTwo.appendChild(name);
    colTwo.appendChild(price);
    colTwo.appendChild(desc);
    colTwo.appendChild(addPurchase(chosen));
    return colTwo;
  }

  /**
   * This function generates the buy element for the displaySelectedItem and its functionally.
   * @param {Object} resp - itemView API response data.
   * @returns {HTMLElement} buy - Form element
   */
   function addPurchase(chosen) {
    let buy = gen("form");
    let addToCart = gen("input");
    addToCart.setAttribute("type", "submit");
    addToCart.id = "add-to-cart";
    addToCart.setAttribute("value", "Add to Cart");

    buy.appendChild(addToCart);

    buy.addEventListener("submit", function(event) {
      event.preventDefault();
      // purchase(chosen, false);
      purchase(chosen);
      displayCart();
    });
    return buy;
  }

  function checkout() {
    id("cart-card").classList.add("hidden");
    id("thanks").classList.remove("hidden");
    let buttons = qsa("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true
    }
    let header = qsa("header")[0];
    console.log(header);
    header.classList.add("hidden");
  }

  /**
   * This function adds the selected item to the cart and generates the individual display in the
   * Cart view with information such as item name, total cost, quantity, and the functionally to
   * remove it from the cart view.
   * @param {Object} itemData - currentCartData JSON data or itemView API response data
   * @param {Boolean} existingCart - checks if the cart state, true if the cart data is being used,
   * false if the cart data is not being used.
   */
  //  function purchase(itemData, existingCart) {

  function purchase(chosen) {

    // let cart = JSON.parse(currentCartData);
    // if (!existingCart) {
    //   cart["itemData"].push(itemData);
    //   // window.localStorage.setItem("cart", JSON.stringify(cart));
    //   // currentCartData = window.localStorage.getItem("cart");
    // }

    id("empty").classList.add("hidden");
    id("checkout").disabled = false;

    let product = gen("div");
    let itemName = gen("h3");
    itemName.textContent = TITLE[chosen] + " ($" + PRICE[chosen] + ")";

    let remove = gen("button");
    remove.textContent = "remove";

    product.appendChild(itemName);
    product.appendChild(remove);

    product.classList.add("cart");
    id("cart-list").appendChild(product);

    remove.addEventListener("click", function() {
      removeItem(product);
    });
  }

  function removeItem(product) {
    let cart = qsa(".cart");

    let child;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].firstChild == product.firstChild) {
        child = cart[i];
        child.remove();
      }
    }
    cart = qsa(".cart");
    console.log(cart.length);
    if (cart.length == 0) {
      id("empty").classList.remove("hidden");
      id("checkout").disabled = true;
    }
  }

  /**
   * Displays the cart view, when the function is activated.
   */
     function displayCart() {
      close();
      id("home").classList.add("hidden");
      id("item").classList.add("hidden");
      id("cart").classList.remove("hidden");
    }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Note: You may use these in your code, but remember that your code should not have
   * unused functions. Remove this comment in your own code.
   */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
   function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }
})();