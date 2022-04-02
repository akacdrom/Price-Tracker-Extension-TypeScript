console.log("Hey, the content script is running!");

const getPriceText = () => {
  const tag = document.querySelector("div.regular-price") as HTMLDivElement;
  return tag.innerText;
};

const price = getPriceText();

console.log("PRICE --> " + price);

// Inform the background page that
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction",
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    // Collect the necessary data.
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    const domInfo = {
      app: price,
    };

    // Directly respond to the sender (popup),
    // through the specified callback.
    response(domInfo);
  }
});
