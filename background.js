/*chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if(tab.url && tab.url.includes("youtube.com/watch")){
        //splits url string at ? and adds left right part to array
        const queryParameters = tab.url.split("?")[1];
        console.log(queryParameters);
        //makes the right part into an object with keys and values
        const URLparameters = new URLSearchParams(queryParameters);
        console.log(2);
        console.log(URLparameters);

        //sends a message to the contentScript that YT page is loaded
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoID: URLparameters.get("v"),
        })
    }
})

async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tabs] = await chrome.tabs.query(queryOptions);
    console.log(tabs);
}
getCurrentTab();*/

// Function to handle the YouTube page update
function handleYouTubePageUpdate(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      console.log(queryParameters);
      const URLparameters = new URLSearchParams(queryParameters);
      console.log(URLparameters);

      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoID: URLparameters.get("v"),
      });
    }
  });
}



// Event listener for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  handleYouTubePageUpdate(tabId);
});

/*chrome.tabs.onUpdated.addListener((tabId, tab) => {
  handleYouTubePageUpdate(tabId);
})*/
// Check the currently active tab when the extension is first loaded
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab) {
    const tabId = currentTab.id;
    handleYouTubePageUpdate(tabId);
  }
});

let URLSent;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("BackroundJS message received!");
  console.log(message);
  if (message.pausedImageURL) {
    URLSent = message.pausedImageURL;
    await chrome.runtime.sendMessage({ URLSent });
    console.log("BackroundJS message sent!");
  }
  else if (message.requestImage) {
    chrome.runtime.sendMessage({ URLSent });
  }
});


