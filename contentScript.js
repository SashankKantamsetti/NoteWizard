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



            //

            async function cropperArea() {
                if (youtubePlayer && pauseButton /*&& pauseButton.title != "Play (k)"*/) {
                    youtubePlayer.pause();
                    const pausedImageURL = captureVideoAsImage(youtubePlayer);
                    console.log(pausedImageURL);
                    await chrome.runtime.sendMessage({ pausedImageURL });
                    console.log("ContentScript Message sent!");


                    /*const canvas = document.createElement('canvas');
                    canvas.id = 'cropCanvas';
                    canvas.style.border = '2px solid blue';
                    canvas.style.display = 'none';

                    const youtubePlayerRect = youtubePlayer.getBoundingClientRect();
                    canvas.style.position = 'absolute';
                    canvas.style.top = `${youtubePlayerRect.top}px`;
                    canvas.style.left = `${youtubePlayerRect.left}px`;
                    canvas.style.width = `${youtubePlayerRect.width}px`;
                    canvas.style.height = `${youtubePlayerRect.height}px`;

                    youtubePlayer.parentNode.insertBefore(canvas, youtubePlayer.nextSibling);

                    let startX, startY, endX, endY;
                    const ctx = canvas.getContext('2d');

                    function drawCropArea() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.strokeStyle = 'blue';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
                    }

                    function handleMouseDown(event) {
                        startX = event.clientX - canvas.offsetLeft;
                        startY = event.clientY - canvas.offsetTop;
                        endX = startX;
                        endY = startY;
                        youtubePlayer.style.cursor = "crosshair";
                    }

                    function handleMouseMove(event) {
                        endX = event.clientX - canvas.offsetLeft;
                        endY = event.clientY - canvas.offsetTop;
                        drawCropArea();
                    }

                    function handleMouseUp() {
                        canvas.removeEventListener('mousemove', handleMouseMove);
                        console.log("Crop Details:", startX, startY, endX, endY);
                        youtubePlayer.style.cursor = "auto";
                    }

                    canvas.addEventListener('mousemove', handleMouseMove);
                    canvas.addEventListener('mousedown', handleMouseDown);
                    canvas.addEventListener('mouseup', handleMouseUp);

                    canvas.style.display = 'block';*/


                    /*const jQueryURL = chrome.runtime.getURL("jquery.min.js");
                    const jQueryElement = document.createElement("script");
                    jQueryElement.src = jQueryURL;

                    const cropperCSS = document.createElement("link");
                    cropperCSS.rel = "stylesheet";
                    cropperCSS.href = chrome.runtime.getURL("cropper_proj.css");

                    const cropperJSURL = chrome.runtime.getURL("cropper_proj2.js");
                    const cropperJS = document.createElement("script");
                    cropperJS.src = cropperJSURL;

                    jQueryElement.onload = () => {

                        cropperJS.onload = () => {
                            const cropper = new Cropper(youtubePlayer, {
                                dragMode: 'crop',
                                cropBoxResizable: true,
                                cropBoxMovable: true,
                                viewMode: 1,
                                crop: function (event) {
                                    const croppedData = event.detail;
                                    console.log(croppedData);
                                },
                            });
                            document.head.appendChild(cropperCSS);
                        }
                        document.head.appendChild(cropperJS);







                        /*const cropContainer = document.createElement("div");
                        cropContainer.id = "crop-container";
                        cropContainer.style.position = "absolute";
                        cropContainer.style.top = "0";
                        cropContainer.style.left = "0";
                        cropContainer.style.width = "100%";
                        cropContainer.style.height = "100%";

                        // Append the div element after the video element
                        youtubePlayer.parentNode.insertBefore(cropContainer, youtubePlayer.nextSibling);

                        // Call the Croppie initialization code inside the div element
                        const cropper = new Croppie(document.getElementById("crop-container"), {
                            viewport: { width: 300, height: 300 },
                            boundary: { width: 400, height: 400 },

                        });

                        cropper.bind({
                            url: youtubePlayer.src,
                            points: [0, 0, 1, 1]
                        })
                        cropContainer.style.display = "block";*/
                    //};
                    //document.head.append(jQueryElement);




                    /*const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = youtubePlayer.videoWidth;
                    canvas.height = youtubePlayer.videoHeight;
                    context.drawImage(youtubePlayer, 0, 0, canvas.width, canvas.height);

                    const image_crop = new Image();
                    image_crop.src = canvas.toDataURL();
                    image_crop.onload = () => {
                        console.log("Image Loaded!");
                        $(() => {
                            const cropper = new Cropper(image_crop, {
                                dragMode: 'crop',
                                cropBoxResizable: true,
                                cropBoxMovable: true,
                                viewMode: 1,
                                crop: function (event) {
                                    const croppedData = event.Detail;
                                    console.log(croppedData);
                                },
                            });
                        });
                    }*/


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


/*noteButton.title.style.fontSize = "10px";
            noteButton.title.style.fontFamily = "Roboto, Arial, sans-serif";
            noteButton.title.style.backgroundColor = "#424242";
            noteButton.title.style.color = "#fff";*/