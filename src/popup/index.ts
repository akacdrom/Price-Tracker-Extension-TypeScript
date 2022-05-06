//import { createApp } from 'vue';
//import App from './App.vue';

//createApp(App).mount('#app');

// get DOM element
const greeter: HTMLElement = document.getElementById("app") as HTMLElement;
const greeter2: HTMLElement = document.getElementById(
  "discount"
) as HTMLElement;

// Update the relevant fields with the new data.
const setDOMInfo = (info: { app: string; discount: string }) => {
  greeter.innerText = info.app;
  greeter2.innerText = info.discount;
};

// Once the DOM is ready...
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
          { from: "popup", subject: "DOMInfo" },
          // ...also specifying a callback to be called
          //    from the receiving end (content script).
          setDOMInfo
        );
      }
    }
  );
});
