import { HtmlHTMLAttributes } from "vue";

///{{{
// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  let domInfo = {};
  // First, validate the message's structure.
  if (
    window.location.hostname === "www.reserved.com" &&
    msg.from === "popup" &&
    msg.subject === "DOMInfo"
  ) {
    const getProductPrice = () => {
      const tag = document.querySelector("div.regular-price") as HTMLDivElement;
      tag.innerText = tag.innerText.replace("PLN", "").trim();
      const price = parseFloat(tag.innerText) as number;
      return Math.ceil(price);
    };
    const getProductName = () => {
      const tag = document.querySelector("h1.product-name") as HTMLTitleElement;
      return tag.innerText;
    };
    const getProductURL = () => {
      const URL = window.location.href;
      return URL;
    };

    const productPrice = getProductPrice();
    const productName = getProductName();
    const productURL = getProductURL();
    console.log(`Product Price --> ${productPrice}`);
    console.log(`Product Name --> ${productName}`);
    console.log(`Product URL --> ${productURL}`);

    // Collect the necessary data.
    domInfo = {
      productName: productName,
      productPrice: productPrice,
      productURL: productURL,
      status: `We are in the shop page 😎`,
    };
  } else {
    domInfo = {
      productName: `Product not found 😕`,
      priceValue: ``,
      productURL: ``,
      status: `N/A`,
    };
  }
  // Directly respond to the sender (popup),
  // through the specified callback.
  response(domInfo);
});
///}}}
