"use strict";

(function() {
  // to see who the current user is and current cart.
  let currentUser = window.localStorage.getItem("username");
  let currentUserData = window.localStorage.getItem("user");
  let currentCartData = window.localStorage.getItem("cart");

  // for filtering purposes, if you want to use filter and search combine.
  let searchBarValue = null;

  // to display purchaseID and for purchaseID to be used throughout multiple functions.
  let purchaseId;

  window.addEventListener("load", init);

  /**
   * At launch, all the functionally of buttons, forms, user-interactive aspects are added, cart
   * items are generated if needed and displays the menu.
   */
  function init() {
    let homeButtons = qsa(".home-btn");

    displayExistingCart();
    showMenu();
    addEventListeners();

    for (let i = 0; i < homeButtons.length; i++) {
      homeButtons[i].addEventListener("click", function() {
        homeView();
        clearFilterClasses();
        searchBarValue = null;
      });
    }
  }

  /**
   * For the majority of buttons, their functionally and functions are added to be ran when needed.
   */
  function addEventListeners() {
    id("open").addEventListener("click", open);
    id("close").addEventListener("click", close);

    id("cart-btn").addEventListener("click", displayCart);
    id("redirect").addEventListener("click", displayAccount);
    id("checkout").addEventListener("click", confirmationSwitch);
    id("confirm").addEventListener("click", checkoutTime);
    id("compact-btn").addEventListener("click", compactView);

    id("search-btn").addEventListener("click", searchRequest);
    let loginForm = id("login");
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      signInRequest();
    });

    let signUpForm = id("sign-up");
    signUpForm.addEventListener("submit", function(event) {
      event.preventDefault();
      signUpRequest();
    });
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

  /**
   * Sends a request to the API to get all the items in Bear Bakerie has to offer.
   */
  function showMenu() {
    fetch("/menu")
      .then(statusCheck)
      .then(resp => resp.json())
      .then(displayItems)
      .catch(handleError);
  }

  /**
   * Generates the main menu grid view by developing each item card available in the data given.
   * @param {JSON} resp - Data from showMenu request.
   */
  function displayItems(resp) {
    let cards = qsa("#food article");

    if (cards.length === 0) {
      for (let i = 0; i < resp.length; i++) {
        let card = gen("article");
        card.classList.add("card");

        let img = gen("img");
        img.src = "img/" + resp[i].image;
        img.alt = resp[i].name;
        let name = gen("p");
        name.textContent = resp[i].name;

        card.appendChild(img);
        card.appendChild(name);

        card.addEventListener("click", itemView);
        id("food").appendChild(card);
      }
      compact();
    } else {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("hidden");
      }
    }
  }

  /**
   * Generates the compact menu view using the main view card information.
   */
  function compact() {
    let cards = qsa(".card");
    for (let i = 0; i < cards.length; i++) {
      let item = gen("li");
      let container = gen("div");
      let name = gen("p");
      name.textContent = cards[i].getElementsByTagName("p")[0].textContent;
      container.appendChild(name);
      container.addEventListener("click", itemView);
      item.appendChild(container);
      id("menu").appendChild(item);
    }
  }

  /**
   * Displays the compact menu view when the function is activated.
   */
  function compactView() {
    close();
    id("account").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("item").classList.add("hidden");
    id("home").classList.add("hidden");
    id("compact").classList.remove("hidden");
    let cards = qsa(".compact");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("hidden");
    }
  }

  /**
   * Displays the main home menu grid view when the function is activated.
   */
  function homeView() {
    close();
    id("account").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("item").classList.add("hidden");
    id("compact").classList.add("hidden");
    id("home").classList.remove("hidden");
    let cards = qsa(".card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("hidden");
    }
  }

  /**
   * Displays the cart view, when the function is activated.
   */
  function displayCart() {
    close();
    id("account").classList.add("hidden");
    id("home").classList.add("hidden");
    id("item").classList.add("hidden");
    id("compact").classList.add("hidden");
    id("cart").classList.remove("hidden");
  }

  /**
   * Switches the view to the detailed individual item view, and sends a request to get the item
   * data.
   */
  function itemView() {
    id("item").innerHTML = "";
    id("account").classList.add("hidden");
    id("home").classList.add("hidden");
    id("compact").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("item").classList.remove("hidden");

    let name = this.getElementsByTagName("p")[0].textContent;

    let data = new FormData();
    data.append("search", name);

    fetch("/filter", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(displaySelectedItem)
      .catch(handleError);
  }

  /**
   * Generates the item view based on the item data given and displays it to the user.
   * @param {Object} resp - itemView API response data.
   */
  function displaySelectedItem(resp) {
    let card = gen("article");
    card.classList.add("selected-item");
    let colOne = generatedColumnOne(resp);
    let colTwo = generatedColumnTwo(resp);

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
  function generatedColumnOne(resp) {
    let colOne = gen("div");
    colOne.id = "colOne";
    let newPhoto = gen("img");
    newPhoto.src = "img/" + resp[0].image;
    newPhoto.alt = resp[0].name;
    let rating = gen("p");
    for (let i = 0; i < resp[0].rating; i++) {
      let heart = gen("img");
      heart.src = "img/full-heart.png";
      heart.alt = "full heart";
      heart.classList.add("heart");
      rating.appendChild(heart);
    }
    for (let i = resp[0].rating; i < 5; i++) {
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
  function generatedColumnTwo(resp) {
    let colTwo = gen("div");
    colTwo.id = "colTwo";
    let name = gen("h2");
    name.textContent = resp[0].name;
    let price = gen("p");
    price.textContent = "$" + resp[0].price.toFixed(2);
    let desc = gen("p");
    desc.textContent = resp[0].description;
    let stock = gen("p");
    stock.textContent = "stock: " + resp[0].stock;
    if (resp[0].stock === 0) {
      stock.textContent = "stock: Out of Stock";
    } else if (resp[0].stock === -1) {
      stock.textContent = "stock: Infinity";
    }
    colTwo.appendChild(name);
    colTwo.appendChild(price);
    colTwo.appendChild(desc);
    colTwo.appendChild(stock);
    colTwo.appendChild(addPurchase(resp));
    return colTwo;
  }

  /**
   * This function generates the buy element for the displaySelectedItem and its functionally.
   * @param {Object} resp - itemView API response data.
   * @returns {HTMLElement} buy - Form element
   */
  function addPurchase(resp) {
    let itemStock = resp[0].stock;
    let buy = gen("form");
    let amount = gen("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 1);
    if (itemStock !== -1) {
      amount.setAttribute("max", itemStock);
    }
    amount.id = "amount";
    let label = gen("label");
    label.setAttribute("for", "amount");
    label.textContent = "qty: ";
    amount.required = true;
    let addToCart = gen("input");
    addToCart.setAttribute("type", "submit");
    addToCart.id = "add-to-cart";
    addToCart.setAttribute("value", "Add to Cart");

    if (itemStock !== 0) {
      buy.append(label);
      buy.appendChild(amount);
      buy.appendChild(addToCart);
    }

    buy.addEventListener("submit", function(event) {
      event.preventDefault();
      purchase(resp[0], amount.value, false);
      displayCart();
    });
    return buy;
  }

  /**
   * This function adds the selected item to the cart and generates the individual display in the
   * Cart view with information such as item name, total cost, quantity, and the functionally to
   * remove it from the cart view.
   * @param {Object} itemData - currentCartData JSON data or itemView API response data
   * @param {Integer} amount - item amount of item being added to cart
   * @param {Boolean} existingCart - checks if the cart state, true if the cart data is being used,
   * false if the cart data is not being used.
   */
  function purchase(itemData, amount, existingCart) {
    let cart = JSON.parse(currentCartData);
    if (!existingCart) {
      itemData["amount"] = parseInt(amount);
      cart["itemData"].push(itemData);
      window.localStorage.setItem("cart", JSON.stringify(cart));
      currentCartData = window.localStorage.getItem("cart");
    }

    id("empty").classList.add("hidden");
    let product = gen("div");
    let itemName = gen("h3");
    itemName.textContent = itemData.name + " ($" + itemData.price.toFixed(2) + ")";

    let quantity = gen("p");
    quantity.textContent = "quantity: " + amount;

    let remove = gen("button");
    remove.textContent = "remove";

    product.appendChild(itemName);
    product.appendChild(quantity);
    product.appendChild(remove);
    id("cart-list").appendChild(product);

    let subtotal = Number(id("subtotal").textContent);
    subtotal += (Number(itemData.price) * Number(amount));
    id("subtotal").textContent = (Math.round(subtotal * 100) / 100).toFixed(2);
    remove.addEventListener("click", function() {
      clearItemLocalStorage(product);
      subtotal -= (Number(itemData.price) * Number(amount));
      id("subtotal").textContent = (Math.round(subtotal * 100) / 100).toFixed(2);
    });
    updateDuplicateItem(itemData, amount, product);
  }

  /**
   * This function checks the current items in the cart to see if it duplicated, if not, then the
   * function will be skipped, if duplicated, it will combine the duplicate with the existing
   * original item while removing the duplicate item, with the data such as quantity, total price
   * and subtotal. Lastly, it prevents an item to be over the total amount of stock available for
   * a product by making the new quantity reflect the total stock count.
   * @param {Object} itemData - itemView API response data.
   */
  function updateDuplicateItem(itemData) {
    let cartItems = id("cart-list").children;
    let cartItemTextContent = [];
    let subtotal = parseFloat(id("subtotal").textContent);

    for (let i = 0; i < cartItems.length - 1; i++) {
      cartItemTextContent[i] = cartItems[i].firstChild.textContent;
    }

    let addedProduct = id("cart-list").lastChild;
    let addedProductName = addedProduct.firstChild.textContent;
    let addedProductAmount = parseInt(addedProduct.children[1].textContent.split(" ")[1]);
    let addedProductTotalPrice = Number((addedProductAmount * itemData.price).toFixed(2));
    if (cartItemTextContent.indexOf(addedProductName) !== -1) {
      let originalIndex = cartItemTextContent.indexOf(addedProduct.firstChild.textContent);
      let originalItem = cartItems[originalIndex];
      let originalProductAmount = parseInt(originalItem.children[1].textContent.split(" ")[1]);
      let originalProductItemPrice = Number((originalProductAmount * itemData.price).toFixed(2));
      let newQuantity = originalProductAmount + addedProductAmount;
      let totalStockPrice = (itemData.stock * itemData.price).toFixed(2);
      updateCartDuplicate(itemData, newQuantity, originalIndex);
      if (itemData.stock >= newQuantity || itemData.stock === -1) {
        originalItem.children[1].textContent = "quantity: " + newQuantity;
      } else {
        let combinedTotal = originalProductItemPrice + addedProductTotalPrice;
        subtotal = Number((subtotal - combinedTotal + totalStockPrice)).toFixed(2);
        id("subtotal").textContent = subtotal;
        originalItem.children[1].textContent = "quantity: " + itemData.stock;
      }
      id("cart-list").lastChild.remove();
    }
  }

  /**
   * This function updates the localStorage of the cart to match the current state of the cart for
   * the user after modifying it in updateDuplicateItem.
   * @param {Object} itemData - itemView API response data.
   * @param {Integer} newQuantity - Duplicate item amount and original item amount.
   * @param {Integer} originalIndex - Original item index in the cart.
   */
  function updateCartDuplicate(itemData, newQuantity, originalIndex) {
    let cart = JSON.parse(currentCartData);
    let itemDataArray = cart["itemData"];
    let stock = itemData.stock;

    if (stock >= newQuantity || stock === -1) {
      itemDataArray[originalIndex].amount = newQuantity;
    } else {
      itemDataArray[originalIndex].amount = stock;
    }
    itemDataArray.pop();

    window.localStorage.setItem("cart", JSON.stringify(cart));
    currentCartData = window.localStorage.getItem("cart");
  }

  /**
   * When the remove from cart button is pressed, this function finds the index of that element
   * and matches it to the localStorage state of the cart and removes that data as well to reflect
   * the same state of the user's current cart.
   * @param {HTMLElement} element - purchase function's product element; the individual item in cart
   */
  function clearItemLocalStorage(element) {
    /*
     * Converts NodeList into Array so indexOf can be called to find the index of the match.
     * Conversion Solution adapted from: https://stackoverflow.com/questions/5913927/get-child-node-index
     */
    let cartItems = element;
    let cart = cartItems.parentNode;
    let index = Array.prototype.indexOf.call(cart.children, cartItems);

    let cartData = JSON.parse(currentCartData);
    cartData["itemData"].splice(index, 1);
    window.localStorage.setItem("cart", JSON.stringify(cartData));
    currentCartData = window.localStorage.getItem("cart");

    id("cart-list").removeChild(element);
    if (id("cart-list").childElementCount === 0) {
      id("empty").classList.remove("hidden");
    }
  }

  /**
   * When the website starts, the function loads the user's Cart localStorage data to the cart view.
   * So after refreshing the page, the user's items will still remain in the cart.
   */
  function displayExistingCart() {
    let cart = JSON.parse(currentCartData);

    if (currentUser) {
      for (let i = 0; i < cart["itemData"].length; i++) {
        let itemData = cart["itemData"][i];
        let amount = cart["itemData"][i]["amount"];
        let existingCart = true;
        purchase(itemData, amount, existingCart);
      }
    }
  }

  /**
   * When the search button is pressed, given the search bar data and filters, the information will
   * be sent to API to receive the items that match those values.
   */
  function searchRequest() {
    let searchBar = id("search-bar");
    searchBarValue = searchBar.value;

    if (searchBarValue.length !== 0) {
      id("account").classList.add("hidden");
      id("cart").classList.add("hidden");
      id("compact").classList.add("hidden");
      id("item").classList.add("hidden");
      id("home").classList.remove("hidden");
      let filterButtons = qsa("aside li");
      let params = new FormData();
      params.append("search", searchBarValue);

      for (let i = 0; i < filterButtons.length; i++) {
        if (filterButtons[i].classList.contains("selected")) {
          let type = filterButtons[i].textContent.trim().replace(" ", "-");
          params.append("type", type);
        }
      }

      fetch("/filter", {method: "POST", body: params})
        .then(statusCheck)
        .then(resp => resp.json())
        .then(displaySearch)
        .catch(handleError);
    }
  }

  /**
   * This functions displays all the items that matches the filter item data to the user in the main
   * view.
   * @param {Object} data - searchRequest data, all the items that matches with the search/filters.
   */
  function displaySearch(data) {
    id("search-bar").value = "";
    let items = qsa("#food article");
    let itemsText = [];

    for (let i = 0; i < items.length; i++) {
      items[i].classList.add("hidden");
      itemsText[i] = items[i].textContent;
    }

    for (let i = 0; i < data.length; i++) {
      let matchedText = data[i].name;
      let matchedIndex = itemsText.indexOf(matchedText);

      if (matchedIndex !== -1) {
        items[matchedIndex].classList.remove("hidden");
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
    for (let i = 0; i < filterButtons.length; i++) {
      if (filterButtons[i] !== this) {
        filterButtons[i].classList.remove("selected");
      } else {
        this.classList.toggle("selected");
      }
    }

    let params = new FormData();
    if (!searchBarValue && !this.classList.contains("selected")) {
      showMenu();
    } else {
      if (searchBarValue) {
        params.append("search", searchBarValue);
      }

      if (this.classList.contains("selected") && !this.textContent.includes(4)) {
        params.append("type", type);
      } else {
        params.append("rating", 4);
      }

      fetch("/filter", {method: "POST", body: params})
        .then(statusCheck)
        .then(resp => resp.json())
        .then(displaySearch)
        .catch(handleError);
    }
  }

  /**
   * Changes the filter view when filter button is pressed.
   */
  function filterView() {
    id("account").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("compact").classList.add("hidden");
    id("item").classList.add("hidden");
    id("home").classList.remove("hidden");
  }

  /**
   * Un-toggles all the filter buttons to off.
   */
  function clearFilterClasses() {
    let filterButtons = qsa("aside li");
    for (let i = 0; i < filterButtons.length; i++) {
      filterButtons[i].classList.remove("selected");
    }
  }

  /**
   * When the confirmation button is pressed, it checks if the purchase is valid then fulfills the
   * information needed to purchase only the first item in the cart to retrieve the Purchase ID that
   * will be used throughout the entire transaction, then sends that Purchase ID for the rest of the
   * items in the cart to be bought.
   */
  function checkoutTime() {
    let subtotal = parseFloat(id("subtotal").textContent);
    let account = JSON.parse(currentUserData);

    if (subtotal < account.money) {
      let cost = subtotal;
      id("subtotal").textContent = "0.00";
      if (id("cart-list").childElementCount > 0) {
        let first = id("cart-list").childNodes[0];
        let item = first.getElementsByTagName("h3")[0].textContent;
        let itemName = item.substring(0, item.indexOf(" ("));
        let quantity = first.getElementsByTagName("p")[0].textContent;
        let qty = quantity.split(" ")[1];

        let data = new FormData();
        data.append("username", currentUser);
        data.append("item", itemName);
        data.append("amount", qty);

        fetch("/purchase", {method: "POST", body: data})
          .then(statusCheck)
          .then(resp => resp.json())
          .then((resp) => {
            cartCheckout(resp, cost);
          })
          .catch(handleError);
      }
    } else {
      displayTransactionFailure();
    }
  }

  /**
   * This function buys the rest of the items in the cart until transaction is complete and updates
   * the total balance of the account.
   * @param {Object} resp - Purchase API data to get the Purchase ID.
   * @param {Number} cost - Total cost of the item.
   */
  function cartCheckout(resp, cost) {
    purchaseId = resp.purchase_id;
    let length = id("cart-list").childElementCount;
    let quantity;
    let qty;
    let item;
    let itemName;
    for (let i = 1; i < length; i++) {
      // the selected purchase in cart
      let purchaseSelected = id("cart-list").childNodes[i];

      // the first item's "quantity: x" p tag text
      quantity = purchaseSelected.getElementsByTagName("p")[0].textContent;

      qty = quantity.split(" ")[1];

      // the item's name
      item = purchaseSelected.getElementsByTagName("h3")[0].textContent;
      itemName = item.substring(0, item.indexOf(" ("));

      let data = new FormData();
      data.append("username", currentUser);
      data.append("item", itemName);
      data.append("amount", qty);
      data.append("pid", purchaseId);

      fetch("/purchase", {method: "POST", body: data})
        .then(statusCheck)
        .catch(handleError);
    }

    // CLEARS THE CART IN LOCAL STORAGE
    let cartJSON = {itemData: []};
    window.localStorage.setItem("cart", JSON.stringify(cartJSON));
  }

  /**
   * In the cart view, this function switches the checkout button to the confirmation button.
   */
  function confirmationSwitch() {
    let cart = id("cart");
    let checkout = id("checkout");
    let confirm = id("confirm");

    if (!cart.classList.contains("hidden")) {
      checkout.classList.add("hidden");
      confirm.classList.remove("hidden");
    }

    setTimeout(() => {
      confirm.classList.add("hidden");
      checkout.classList.remove("hidden");
    }, 3000);
  }

  /**
   * If the transaction fails due to insufficient funds, the transaction failure screen will be
   * shown.
   */
  function displayTransactionFailure() {
    let failureError = id("failure");
    let cart = id("cart-card");

    cart.classList.add("hidden");
    failureError.classList.remove("hidden");

    setTimeout(() => {
      cart.classList.remove("hidden");
      failureError.classList.add("hidden");
    }, 5000);
  }

  /**
   * If one of the API requests fails due to an unintended error / uncontrollable error, the
   * website will display the Error View.
   */
  function handleError() {
    close();
    id("open").disabled = "true";
    id("close").disabled = "true";
    id("account-btn").disabled = "true";
    id("cart-btn").disabled = "true";
    id("compact-btn").disabled = "true";
    id("search-btn").disabled = "true";
    id("main").classList.add("hidden");
    id("error").classList.remove("hidden");
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
