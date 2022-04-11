console.log(
  "Hey! This code is executed in the background, you will not see it in the browser console..."
);

//Background, is responsible for checking the price of product continuously in the background
//I used "document.querySelector()" method inside of content to catch price "div".
//But using same method in here is impossible.
//I tried to use "dom-parser" and "jsdom" to convert string html to a readable html form to get the price "div"
//But they didn't work or broke the entire application.

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
      .then(parsePrice);
  }

  function parsePrice(rawHtml: string) {
    // Parse the price from fetched HTML template
    let price = rawHtml
      .substring(
        rawHtml.lastIndexOf("price:amount") + 23,
        rawHtml.lastIndexOf("price:amount") + 23 + 10
      )
      .trim();
    price = price.substring(0, price.indexOf('">'));
    console.log(price);
    console.log(price.length);
    console.log("------");

    // make a new parser
    

    // Sample HTML page of the "reserved.com";
    // <meta property="og:title" content="Klapki z imitacji skóry, RESERVED, 2061L-39X">
    // <meta property="og:description" content="Klapki z imitacji skóry, , rÓŻowy, RESERVED">
    // <meta property="og:type" content="product">
    // <meta property="product:original_price:amount" content="59.99">
    // <meta property="product:original_price:currency" content="PLN">
    // <meta property="product:price:amount" content="59.99">
    // <meta property="product:price:currency" content="PLN">
    // <meta property="product:retailer_part_no" content="2061L-39X">
  }
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if (msg.from === "content" && msg.subject === "showPageAction") {
    // Enable the page-action for the requesting tab.
    if (sender.tab?.id) {
      chrome.pageAction.show(sender.tab.id);
    }
  }
});
