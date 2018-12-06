chrome.runtime.onInstalled.addListener(function() {
  
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'TOGGLE_MENU'}, function(response) {
        console.log(response);
      });
    }
  });
});

