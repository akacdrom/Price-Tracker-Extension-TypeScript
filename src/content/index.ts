// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  let domInfo = {};
  // First, validate the message's structure.
  if (
    window.location.hostname === "www.reserved.com" &&
    msg.from === "popup" &&
    msg.subject === "DOMInfo"
  ) {
    const getPriceText = () => {
      const tag = document.querySelector("div.regular-price") as HTMLDivElement;
      return tag.innerText;
    };
    const price = getPriceText();
    console.log("PRICE --> " + price);

    // Collect the necessary data.
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    domInfo = {
      app: "Price: " + price,
      other: "We are in the Page",
    };
  } else {
    domInfo = {
      app: "N/A",
      other: "",
    };
  }
  // Directly respond to the sender (popup),
  // through the specified callback.
  response(domInfo);
});
