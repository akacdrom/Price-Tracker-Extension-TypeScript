//import { createApp } from 'vue';
//import App from './App.vue';

//createApp(App).mount('#app');

// get DOM element
const greeter: HTMLElement = document.getElementById("app") as HTMLElement;
const greeter2: HTMLElement = document.getElementById("other") as HTMLElement;

// Update the relevant fields with the new data.
const setDOMInfo = (info: { app: string; other: string }) => {
  greeter.innerText = info.app;
  greeter2.innerText = info.other;
};

//Communication with background script
const port = chrome.runtime.connect({
  name: "Sample Communication",
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
  console.log("message recieved: " + msg);
});

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
