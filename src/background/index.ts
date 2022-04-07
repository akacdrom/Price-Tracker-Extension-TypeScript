console.log(
  "Hey! This code is executed in the background, you will not see it in the browser console..."
);

setInterval(function() {
  check();
}, 2000);
function check() {
  // Fetch the price continuously in background
  fetch("https://www.reserved.com/pl/pl/2061l-39x/klapki-k-re")
    .then(function(response) {
      switch (response.status) {
        // status "OK"
        case 200:
          return response.text();
        // status "Not Found"
        case 404:
          throw response;
      }
    })
    .then(function(template) {
      // Parse the price from fetched HTML template
      const value = template!.lastIndexOf("price:amount");
      let parsedValue = template!.substring(value + 23, value + 23 + 10).trim();
      parsedValue = parsedValue.substring(0, parsedValue.indexOf('">'));
      console.log(parsedValue);
      console.log(parsedValue.length);

      // Sample HTML page of the "reserved.com";
      // <meta property="og:title" content="Klapki z imitacji skóry, RESERVED, 2061L-39X">
      // <meta property="og:description" content="Klapki z imitacji skóry, , rÓŻowy, RESERVED">
      // <meta property="og:type" content="product">
      // <meta property="product:original_price:amount" content="59.99">
      // <meta property="product:original_price:currency" content="PLN">
      // <meta property="product:price:amount" content="59.99">
      // <meta property="product:price:currency" content="PLN">
      // <meta property="product:retailer_part_no" content="2061L-39X">
    })
    .catch(function(response) {
      // "Not Found"
      console.log(response.statusText);
    });
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
