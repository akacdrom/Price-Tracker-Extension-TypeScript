import { parse } from "node-html-parser";

//background, is responsible for checking the price of product continuously in the background
//i used "document.querySelector()" method inside of content to catch price "div".
//but using same method in here is impossible.
//"node-html-parser used" to make element queries to html object for get the price.

let price: number;
let all: any;
let i = 0;
//interval to make a GET request to server in every 4seconds
setInterval(function() {
  check();
}, 4000);
function check() {
  if (i > all.length - 1) {
    i = 0;
  }
  const theUrlInDB = all[i].url.trim();
  const priceInDB = all[i].price as number;
  const productName = all[i].name as string;
  console.log("price in db: " + priceInDB);
  i++;

  getHtml(theUrlInDB);
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
      price = parseInt(
        priceMetaTag.getAttribute("content") as string
      ) as number;
      console.log(`current price in the page: ${price}`);
      console.log("----");
      if (priceInDB == price) {
        console.log("there is no price change");
      } else {
        console.log("price is changed".toUpperCase());
        chrome.notifications.create("", {
          type: "basic",
          iconUrl: "../../assets/icons/icon128.png",
          title: "price change!".toUpperCase() + "\n",
          message: productName,
        });
      }
    } else {
      console.log(
        "I couldn't find price, Maybe html elements is changed by the server."
      );
    }
  }
  function sendPriceToPopup() {
    //communication with popup script
    chrome.runtime.onConnect.addListener(function(port) {
      console.log("Connectedxx ...");
      port.onMessage.addListener(function(msg) {
        console.log("message received from popup: " + msg);
        port.postMessage("The price of the tracked product: " + price);
      });
    });
  }
}

///{{{

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "insert") {
    insertRecords(request.payload);
  } else if (request.message === "get") {
    const getRequest = getRecord();
    getRequest?.then((res) => {
      chrome.runtime.sendMessage({
        message: "get_success",
        payload: res,
      });
    });
  } else if (request.message === "delete") {
    deleteRecord(request.payload);
  }
});

//dummy products
// const roster = [
// {
//   name: "XXX",
//   price: 100,
//   url: "https://www.reserved.com/pl/pl/koszula-z-wiskozy-i-lnu-6031l-59x",
// },
// {
//   name: "b",
//   price: 119,
//   url: "https://www.reserved.com/pl/pl/koszula-z-kwiatowym-motywem-4656l-99p",
// },
// {
//   name: "c",
//   price: 49,
//   url:
//     "https://www.reserved.com/pl/pl/koszulka-polo-regular-z-dzianiny-pique-2338c-99x",
// },
// ];

let db: IDBDatabase;
function createDatabase() {
  const request = indexedDB.open("MyTestDB");
  request.onerror = function(event) {
    console.log("Problem opening the DB");
  };
  request.onupgradeneeded = function(event) {
    db = (event.target as IDBOpenDBRequest).result;
    const objectStore = db.createObjectStore("roster", {
      keyPath: "url",
    });
    objectStore.transaction.oncomplete = function(event) {
      console.log("ObjectStore Created.");
    };
  };
  request.onsuccess = function(event) {
    db = (event.target as IDBOpenDBRequest).result;
    console.log("DB OPENED.");
    //insertRecords(roster);
  };
}

function deleteDatabase() {
  const request = indexedDB.deleteDatabase("MyTestDB");
  request.onerror = function(event) {
    console.log("Problem deleting DB");
  };
  request.onsuccess = function(event) {
    console.log("DB deleted");
  };
}

function insertRecords(
  records: { name: string; price: string; url: string }[]
) {
  if (db) {
    const insertTransaction = db.transaction("roster", "readwrite");
    const objectStore = insertTransaction.objectStore("roster");
    return new Promise((resolve, reject) => {
      insertTransaction.oncomplete = function() {
        console.log("ALL INSERT TRANSACTIONS COMPLETE.");
        resolve(true);
      };
      insertTransaction.onerror = function() {
        console.log("PROBLEM INSERTING RECORDS.");
        resolve(false);
      };
      records.forEach((person: object) => {
        const request = objectStore.add(person);
        request.onsuccess = function() {
          console.log("Added: ", person);
        };
      });
    });
  }
}

function getRecord() {
  if (db) {
    const get_transaction = db.transaction("roster", "readonly");
    const objectStore = get_transaction.objectStore("roster");
    return new Promise((resolve, reject) => {
      get_transaction.oncomplete = function() {
        console.log("ALL GET TRANSACTIONS COMPLETE.");
      };
      get_transaction.onerror = function() {
        console.log("PROBLEM GETTING RECORDS.");
      };
      all = objectStore.getAll();
      all.onsuccess = function(event: any) {
        all = event.target.result;
        resolve(event.target.result);
      };
    });
  }
}

// function updateRecord(record: any) {
//   if (db) {
//     const put_transaction = db.transaction("roster", "readwrite");
//     const objectStore = put_transaction.objectStore("roster");
//     return new Promise((resolve, reject) => {
//       put_transaction.oncomplete = function() {
//         console.log("ALL PUT TRANSACTIONS COMPLETE.");
//         resolve(true);
//       };
//       put_transaction.onerror = function() {
//         console.log("PROBLEM UPDATING RECORDS.");
//         resolve(false);
//       };
//       objectStore.put(record);
//     });
//   }
// }

function deleteRecord(url: string) {
  if (db) {
    url.substring(url.indexOf("https")).trim();

    const delete_transaction = db.transaction("roster", "readwrite");
    const objectStore = delete_transaction.objectStore("roster");
    return new Promise((resolve, reject) => {
      delete_transaction.oncomplete = function() {
        console.log("ALL DELETE TRANSACTIONS COMPLETE.");
        resolve(true);
      };
      delete_transaction.onerror = function() {
        console.log("PROBLEM DELETE RECORDS.");
        resolve(false);
      };
      objectStore.delete(url);
    });
  }
}
createDatabase();
// deleteDatabase()
// ///}}}
