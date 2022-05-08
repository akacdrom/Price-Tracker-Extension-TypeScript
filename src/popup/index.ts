//import { createApp } from 'vue';
//import App from './App.vue';

//createApp(App).mount('#app');

// get DOM element
const priceGreeter: HTMLElement = document.getElementById(
  "price"
) as HTMLElement;
const otherGreeter: HTMLElement = document.getElementById(
  "other"
) as HTMLElement;
const discountGreeter: HTMLElement = document.getElementById(
  "discount"
) as HTMLElement;

// update the relevant fields with the new data.
const setDOMInfo = (info: { priceValue: string; other: string }) => {
  priceGreeter.innerText = info.priceValue;
  otherGreeter.innerText = info.other;
};

// once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  //communication with content script
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
  //communication with background script
  const port = chrome.runtime.connect({
    name: "Sample Communication",
  });
  //send message
  port.postMessage("Hi BackGround");
  //receive message
  port.onMessage.addListener(function(msg) {
    console.log("message received from background: " + msg);
    discountGreeter.innerText = msg;
  });
});
