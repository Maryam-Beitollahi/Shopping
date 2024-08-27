const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".box__items");
const clearCart = document.querySelector(".clear-cart");

import { productsData } from "/src/products.js";
let cart = [];
let buttonsDOM = [];
//1.get products
class Products {
  getProducts() {
    //get from API and product
    return productsData;
  }
}

//2.display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="box__item">
          <div class="img-container">
            <img src=${item.imageUrl} class="box-image"/>
          </div>
          <div class="box__details">
            <p class="detail__title">${item.title}</p>
            <p class="detail__price">${item.price}</p>
          </div>
          <button class="btn--primary add-to-cart" type="submit" data-id=${item.id}>
            Add to cart
          </button>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")]; //nodelist
    ///////const buttons = [...addToCartBtns]; //convert nodelist to array!!!!!
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      //console.log(id);
      //check if this product id is in cart or not?
      const isInCart = cart.find((product) => product.id === parseInt(id)); //
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        //console.log(event.target.dataset.id);
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 }; //id=btn.dataset.id
        //add product to cart
        //console.log(addedProduct);
        cart = [...cart, addedProduct];
        //save cart to local storage
        Storage.saveCart(cart);
        //update cart value
        this.setCartValue(cart);
        //add to cart item
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    //1.cart items
    //2.cart total price
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `$ Total Price : ${totalPrice.toFixed(2)}`;
    cartItems.innerText = tempCartItems;
  }
  addCartItem(cartItem) {
    //console.log(cartItem);
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4 class="cart-item-title">${cartItem.title}</h4>
              <h5 class="cart-item-price">${cartItem.price}</h5>
            </div>
            <div class="cart-item-controller">
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
            </div>
             <i class="far fa-trash-alt" data-id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setUpApp() {
    //get cart from storage;
    cart = Storage.getCart() || [];
    //addCartItem and show in modal
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    //set values: price + items
    this.setCartValue(cart);
  }
  cartLogic() {
    //clear cart
    clearCart.addEventListener("click", () => this.clearCart());
    //cart functionality
    cartContent.addEventListener("click", (event) => {
      //console.log(event.target);
      if (event.target.classList.contains("fa-chevron-up")) {
        //console.log(event.target.dataset.id);
        const addQuantitiy = event.target;
        //get item from cart
        const addedItem = cart.find(
          (cartItem) => cartItem.id == addQuantitiy.dataset.id
        );
        addedItem.quantity++;
        //update cart value
        this.setCartValue(cart);
        //save cart
        Storage.saveCart(cart);
        //update cart item in UI
        //console.log(addQuantitiy.nextElementSibling);
        addQuantitiy.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-alt")) {
        const removeItem = event.target;
        const _removedItem = cart.find(
          (cart) => cart.id == removeItem.dataset.id
        );
        this.removeItem(_removedItem.id);
        //update local storage
        Storage.saveCart(cart);
        //remove from cart item
        cartContent.removeChild(removeItem.parentElement);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const substractedItem = cart.find(
          (cart) => cart.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          //console.log(subQuantity.parentElement.parentElement);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }
  clearCart() {
    //remove
    cart.forEach((cartItem) => this.removeItem(cartItem.id));
    //remove children's cart content
    //console.log(cartContent.children);
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    //update cart
    cart = cart.filter((cartItem) => cartItem.id !== id);
    //total price and cart items
    this.setCartValue(cart);
    //update storage
    Storage.saveCart(cart);
    //get addtocart buttons and update text and disabled
    //console.log(buttonsDOM);
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "Add to cart";
    button.disabled = false;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  //set up : get cart and set up app
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData); //because of static we don't need new Storage
  // console.log(productsData);
});
//3.storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id)); //returns an object!!!convert to number
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
  cartModal.style.left = (winW/2)  - (550 * .5)+ "40%";
}
function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
