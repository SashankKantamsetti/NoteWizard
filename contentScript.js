(() => {
    let currentVideo = "";

    const newVideoLoaded = async () => {
        const noteButtonExists = document.getElementsByClassName("note_but")[0];
        if (!noteButtonExists) {
            const noteButton = document.createElement("img");
            noteButton.src = chrome.runtime.getURL("edit.png");
            noteButton.className = "ytp-button note_but";
            noteButton.title = "Click to take a ScreenShot Note!";
            noteButton.style.width = '32px !important';
            noteButton.style.width = '32px !important';
            noteButton.style.transform = "scale(0.5)";

            const youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];
            const youtubePlayer = document.getElementsByClassName("video-stream")[0];
            const pauseButton = document.querySelector(".ytp-play-button");

            youtubeRightControls.appendChild(noteButton);
            function captureVideoAsImage(videoElement) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = videoElement.offsetWidth;
                canvas.height = videoElement.offsetHeight;
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                console.log(canvas.width);
                console.log(canvas.height);
                return canvas.toDataURL('image/png');
            }

            async function cropperArea() {
                if (youtubePlayer && pauseButton /*&& pauseButton.title != "Play (k)"*/) {
                    youtubePlayer.pause();
                    const pausedImageURL = captureVideoAsImage(youtubePlayer);
                    console.log(pausedImageURL);
                    await chrome.runtime.sendMessage({ pausedImageURL });
                    console.log("ContentScript Message sent!");
                }
            }

            noteButton.addEventListener('click', cropperArea);
        }
    }

    // When received message
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoID } = obj;
        if (type == "NEW") {
            currentVideo = videoID;
            newVideoLoaded();
        }
    });

    newVideoLoaded();
})();

console.log(3);