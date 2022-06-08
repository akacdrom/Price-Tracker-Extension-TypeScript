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
  disableAddProductButton();
  addProductButton.innerText = "Product added!".toUpperCase();
}
function deleteProduct() {
  disableDeleteProductButton();
  deleteProductButton.innerText = "Product deleted!".toUpperCase();
}
function removeElements() {
  addProductButton.remove();
  deleteProductButton.remove();
  productPriceGreeter.remove();
  productDiscountGreeter.remove();
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
