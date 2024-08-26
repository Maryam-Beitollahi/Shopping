const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".box__items");
const clearCart = document.querySelector(".clear-cart");

import { productsData } from "/products.js";
let cart = [];

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
            <i class="fas fa-shopping-cart"></i>
            add to cart
          </button>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addToCartBtns = document.querySelectorAll(".add-to-cart"); //nodelist
    const buttons = [...addToCartBtns]; //convert nodelist to array!!!!!
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      //console.log(id);
      //check if this product id is in cart or not?
      const isInCart = cart.find((product) => product.id === id); //
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
    console.log(cartItem);
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4 class="cart-item-title">${cartItem.title}</h4>
              <h5 class="cart-item-price">${cartItem.price}</h5>
            </div>
            <div class="cart-item-controller">
              <i class="fas fa-chevron-up"></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down"></i>
            </div>
             <i class="far fa-trash-alt"></i>`;
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
}
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  //set up : get cart and set up app
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
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
    return _products.find((p) => (p.id = parseInt(id))); //returns an object!!!convert to number
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
}
function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
clearCart.addEventListener("click", closeModalFunction);
