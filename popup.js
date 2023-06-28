function handleMessage(message) {
  console.log('PopupJS Message received!')
  console.log(message);
  if(message.URLSent){
    const imageElement = document.getElementById('image');
    imageElement.src = `${message.URLSent}`;
  }
  else{
    console.log("No paused Image element!");
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message);
});

// Call the function to handle the message immediately after the listener is set up
chrome.runtime.sendMessage({ requestImage: true }, handleMessage);
//console.log("sashank");