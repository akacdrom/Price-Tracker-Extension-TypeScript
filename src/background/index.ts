import { parse } from "node-html-parser";

//background, is responsible for checking the price of product continuously in the background
//i used "document.querySelector()" method inside of content to catch price "div".
//but using same method in here is impossible.
//"node-html-parser used" to make element queries to html object for get the price.

let price: number;

//interval to make a GET request to server in every 4seconds
setInterval(function() {
  check();
}, 4000);
function check() {
  getHtml("https://www.reserved.com/pl/pl/2061l-39x/klapki-k-re");
  // Fetch the price continuously in background
  function getHtml(url: string) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then(parsePrice)
      .then(sendPriceToPopup);
  }
  function parsePrice(rawHtml: string) {
    //convert the raw html string to the simplified DOM tree, with element query support using node-html-parser library
    const domTreeHtml = parse(rawHtml);
    const priceMetaTag = domTreeHtml.querySelector(
      "meta[property ='product:price:amount']"
    );
    if (priceMetaTag !== null) {
      price = parseFloat(
        priceMetaTag.getAttribute("content") as string
      ) as number;
      console.log(price);
    } else {
      console.log(
        "I couldn't find price, Maybe html elements is changed by server."
      );
    }
  }
  function sendPriceToPopup() {
    //communication with popup script
    chrome.runtime.onConnect.addListener(function(port) {
      console.log("Connected ...");
      port.onMessage.addListener(function(msg) {
        console.log("message received: " + msg);
        port.postMessage("The price of the tracked product: " + price);
      });
    });
  }
}
