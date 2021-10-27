const bedEl=document.querySelector(".products");
const cartItemsEl= document.querySelector(".cart-items");
const cartFooterEl= document.querySelector(".cart-footer");
const totalItemsEl =document.querySelector(".total-items");
const cartEl =document.getElementById("Cart");
const modal_container= document.getElementById("modal-container");
const close= document.getElementById("continue-shopping");

const cartItemsEl1= document.querySelector(".cart-table");

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 5000); // Change image every 5 seconds
}

//fUNCTIONALITY
function renderProducts(){
  products.forEach((product)=>{
    bedEl.innerHTML += `
    <div class="card">
      <img src="${product.imgSrc}" alt="${product.name}">
      <p>${product.name}</p>
      <p>Price: $${product.price}</p>
      <p>${product.description}</p>
      <div class="add-to-cart" >
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>  
    `
  });
}
renderProducts();

//cart array for items in the array
let cart = JSON.parse(localStorage.getItem("CART")) ||[];
updateCart();

function addToCart(id){
  if(cart.some((item)=> item.id === id)){
    changeNumberOfUnits("plus", id)
  }else{
    const item =products.find((product) => product.id === id);
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
    alert(`${item.name} has been added to the cart`)
  }
  updateCart();
}

//update cart 

function updateCart(){
  renderCartItems();
  
}



//render cart items
function renderCartItems(){
    let totalPrice =0;
    let discount =0;
    let subTotal =0;
    let grandTotal=0;
    let totalDiscount=0;
    let payableAmount=0;
    let totalItems=0;
    cartItemsEl.innerHTML = ""; // clear cart element

    cart.forEach((item)=>{
      subTotal= item.price*item.numberOfUnits;
      if(item.numberOfUnits >=50){
        discount = item.numberOfUnits*0.5;

      }else if(item.numberOfUnits >=25){
        discount= item.numberOfUnits*0.25;
      }else if(item.numberOfUnits >=10){
        discount =item.numberOfUnits*0.1;
      }else{
        discount=0;
      }
      totalPrice=subTotal-discount;
      totalItems+= item.numberOfUnits;

      totalItemsEl.innerHTML=totalItems;

      cartItemsEl.innerHTML += `
        
                <div class="cart-item">
                    <div class="item-info">
                        <img src="${item.imgSrc}" alt="Double size bed">
                        <h4>${item.name}</h4>
                        <button onclick="removeItemFromCart(${item.id})">Remove Item </button>
                    </div>
                    <div class="unit-price">
                        <small>$</small>${item.price}
                    </div>
                    <div class="units">
                        <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
                        <div class="number">${item.numberOfUnits}</div>
                        <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>           
                    </div>
                    <div class="sub-total">
                        <small>$</small>${subTotal.toFixed(2)}
                    </div>
                    <div class="discount">
                        <small>$</small>${discount.toFixed(2)}
                    </div>
                    <div class="total-price">
                        <small>$</small>${totalPrice.toFixed(2)}
                    </div>
                </div>
        `;
      cartItemsEl1.innerHTML += `
          <tr>
            <td><h4>${item.name}</h4></td>
            <td>$${item.price}</td>
            <td>${item.numberOfUnits}</td>
            <td>$${subTotal.toFixed(2)}</td>
            <td>$${discount.toFixed(2)}</td>
            <td>$${totalPrice.toFixed(2)}</td>
          </tr>
      `
      grandTotal+=subTotal;
      totalDiscount+=discount;
      payableAmount+=totalPrice;

        cartFooterEl.innerHTML =`
        <div class="grand-total">
            Grand total: $<span>${grandTotal.toFixed(2)}</span>
        </div>
        <div class="total-discount">
          Total Discount: $<span>${totalDiscount.toFixed(2)}</span>
        </div>
        <div class="total-price">
          Total  price after discount: $<span>${payableAmount.toFixed(2)}</span>
        </div>
        <div class="checkout">
          <button id="checkout">Proceed to Checkout</button>
          <button onclick="closeCartModal()" id="continue-shopping">Continue Shopping</button>
        </div>
        `;
  
    });

    cartEl.addEventListener("click", () =>{
      modal_container.classList.add('show');
    });
    
}



function changeNumberOfUnits(action, id){
  cart= cart.map((item)=>{
    let numberOfUnits = item.numberOfUnits;
      if(item.id === id){
          if(action === "minus" && numberOfUnits > 1){
            numberOfUnits--;
          }else if(action === "plus" && numberOfUnits < item.instock){
            numberOfUnits++;
          }
      }
      return {
        ...item,
        numberOfUnits,
      };
  });
  updateCart();
}

function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

function closeCartModal(){
    modal_container.classList.remove('show');
}