console.log('Hey! This code is executed in the background, you will not see it in the browser console...');

chrome.runtime.onMessage.addListener((msg, sender) => {
    // First, validate the message's structure.
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {        
      // Enable the page-action for the requesting tab.
      if (sender.tab?.id){
        chrome.pageAction.show(sender.tab.id);
      }
    }
  });