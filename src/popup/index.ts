//import { createApp } from 'vue';
//import App from './App.vue';

//createApp(App).mount('#app');

//default value for price is N/A
const greeter: HTMLElement = document.getElementById("app") as HTMLElement;
greeter.innerText = "N/A";

// Update the relevant fields with the new data.
const setDOMInfo = (info: { app: string }) => {
  greeter.innerText = info.app;
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
