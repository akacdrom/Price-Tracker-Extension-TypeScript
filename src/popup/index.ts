//import { createApp } from 'vue';
//import App from './App.vue';
//createApp(App).mount('#app');

///{{{
// get DOM element
const productNameGreeter: HTMLElement = document.getElementById(
  "productName"
) as HTMLElement;
const productPriceGreeter: HTMLElement = document.getElementById(
  "productPrice"
) as HTMLElement;
const productDiscountGreeter: HTMLElement = document.getElementById(
  "productDiscount"
) as HTMLElement;
const productURLGreeter: HTMLElement = document.getElementById(
  "productURL"
) as HTMLElement;
const statusGreeter: HTMLElement = document.getElementById(
  "status"
) as HTMLElement;
//add product button
const addProductButton = document.getElementById("addProduct") as HTMLElement;
addProductButton.addEventListener("click", addProduct);
//delete product button
const deleteProductButton = document.getElementById(
  "deleteProduct"
) as HTMLElement;
deleteProductButton.addEventListener("click", deleteProduct);
const listUlGreeter: HTMLElement = document.getElementById(
  "products"
) as HTMLElement;

chrome.runtime.sendMessage({
  message: "get",
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "get_success") {
    if (request.payload) {
      for (let i = 0; i < request.payload.length; i++) {
        const name = request.payload[i].name;
        const price = request.payload[i].price;
        const url = request.payload[i].url;

        const title = document.createElement("ul");
        const elemName = document.createElement("li");
        const elemPrice = document.createElement("li");
        const elemUrl = document.createElement("li");

        title.innerHTML = `${i + 1}:      🐧 👇🏻  ---------🧛🏽---------   🐧 👇🏻`;
        elemName.innerHTML = name;
        elemPrice.innerHTML = price;
        elemUrl.innerHTML = url;

        listUlGreeter.appendChild(title);
        listUlGreeter.appendChild(elemName);
        listUlGreeter.appendChild(elemPrice);
        listUlGreeter.appendChild(elemUrl);
      }
    }
  }
});

//communication with content script
// update the relevant fields with the new data.
const setDOMInfo = (product: {
  productName: string;
  productPrice: string;
  productURL: string;
  status: string;
}) => {
  productNameGreeter.innerText = product.productName;
  productPriceGreeter.innerText = product.productPrice;
  productURLGreeter.innerText = product.productURL;
  statusGreeter.innerText = product.status;
  ///}}}
  //remove the button if user not on the page.
  if (statusGreeter.innerText === "N/A") {
    removeElements();
  }
};

///{{{
// once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0].id) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            from: "popup",
            subject: "DOMInfo",
          },
          // ...also specifying a callback to be called
          //    from the receiving end (content script).
          setDOMInfo
        );
      }
    }
  );
});
///}}}

///{{{
//communication with background script
const port = chrome.runtime.connect({
  name: "Sample Communication",
});
//send message
port.postMessage("Hi BackGround");
//receive message
port.onMessage.addListener(function(msg) {
  console.log("message received from background: " + msg);
  productDiscountGreeter.innerText = msg;
});
///}}}

//{{{
//button and dom properties
function addProduct() {
  chrome.runtime.sendMessage({
    message: "insert",
    payload: [
      {
        name: productNameGreeter.innerText,
        price: productPriceGreeter.innerText,
        url: productURLGreeter.innerText,
      },
    ],
  });
  disableAddProductButton();
  addProductButton.innerText = "Product added!".toUpperCase();
}
function deleteProduct() {
  chrome.runtime.sendMessage({
    message: "delete",
    payload: productURLGreeter.innerText,
  });
  disableDeleteProductButton();
  deleteProductButton.innerText = "Product deleted!".toUpperCase();
}
function removeElements() {
  addProductButton.remove();
  deleteProductButton.remove();
  productPriceGreeter.remove();
  productURLGreeter.remove();
  statusGreeter.remove();
}
function disableAddProductButton() {
  addProductButton.innerText = "Product not addable".toUpperCase();
  addProductButton.setAttribute("disabled", "");
  addProductButton.style.backgroundColor = "#0d1117";
}
function disableDeleteProductButton() {
  deleteProductButton.innerText = "Product not deletable".toUpperCase();
  deleteProductButton.setAttribute("disabled", "");
  deleteProductButton.style.backgroundColor = "#0d1117";
}
///}}}
