loadingELement = document.getElementById('loading');
resultElement = document.getElementById('result');
saveButton = document.getElementById('save');

function saveNoteToStorage(note) {
  chrome.storage.local.get('notes', function (result) {
    const notes = result.notes || [];
    notes.push(note);
    chrome.storage.local.set({ notes: notes }, function () {
      console.log('Note saved:', note);
    });
  });
}

function getAllNotesFromStorage(callback) {
  chrome.storage.local.get('notes', function (result) {
    const notes = result.notes || [];
    callback(notes);
  });
}

function deleteNoteFromStorage(noteId) {
  chrome.storage.local.get('notes', function (result) {
    const notes = result.notes || [];
    const updatedNotes = notes.filter(note => note.title !== noteId);
    chrome.storage.local.set({ notes: updatedNotes }, function () {
      console.log('Note deleted:', noteId);
      displayAllNotes(updatedNotes);
    });
  });
}

function displayAllNotes(notes) {
  const notesContainer = document.getElementById('notes-container');
  notesContainer.innerHTML = '';

  notes.forEach(function (note) {
    const noteElement = document.createElement('div');
    noteElement.id = 'note';
    const subNoteElement = document.createElement('div');
    subNoteElement.id = 'sub-note';
    const noteBlock = document.createElement('button');
    noteBlock.id = 'note-title';
    noteBlock.textContent = `${note.title}`;
    const noteText = document.createElement('textarea');
    noteText.id = 'note-text';
    noteText.rows = 65;
    noteText.cols = 30;
    noteText.value = note.text;
    const copyButton = document.createElement('button');
    copyButton.id = 'copy-but';
    copyButton.textContent = 'Copy';
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-but';
    deleteButton.textContent = 'Delete';
    noteBlock.addEventListener('click', function () {
      if (noteText.style.display === 'none') {
        noteText.style.display = 'block';
        copyButton.style.display = 'block';
        deleteButton.style.display = 'block';
      }
      else {
        noteText.style.display = 'none';
        copyButton.style.display = 'none';
        deleteButton.style.display = 'none';
      }
    });
    copyButton.addEventListener('click', async function () {
      noteText.select();
      await navigator.clipboard.writeText(noteText.value);
      copyButton.textContent = "Copied!"
      setTimeout(function () {
        copyButton.textContent = 'Copy';
      }, 2000);
    })
    deleteButton.addEventListener('click', () => {
      deleteNoteFromStorage(note.title);
    })
    subNoteElement.appendChild(noteBlock);
    subNoteElement.appendChild(copyButton);
    subNoteElement.appendChild(deleteButton);
    noteElement.appendChild(subNoteElement);
    noteElement.appendChild(noteText);
    notesContainer.appendChild(noteElement);
  });
}

function downloadTextFile(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
async function saveFile() {
  const noteName = prompt("Enter Note Name");
  try {
    const filename = `${noteName}.txt`;
    downloadTextFile(filename, resultElement.value);
    const note = { title: noteName, text: resultElement.value };
    saveNoteToStorage(note);

    getAllNotesFromStorage(displayAllNotes);

    console.log('Note saved successfully!');
  }
  catch (err) {
    console.error("Failed to save: ", err);
  }
}

saveButton.addEventListener('click', saveFile);

async function handleMessage(message) {
  console.log('PopupJS Message received!')
  console.log(message);
  if (message.URLSent) {
    const imageElement = document.createElement('img')
    imageElement.id = 'image';
    imageElement.src = `${message.URLSent}`;
    document.querySelector('.image-container').prepend(imageElement);
    const cropper = new Cropper(image, {
      aspectRatio: 0,
      viewMode: 1,
      zoomable: false
    })
    const apiKey = 'K82135622088957';

    async function sendImageForOCR(base64Image) {
      const url = `https://api.ocr.space/parse/image`;

      const formData = new FormData();
      formData.append('base64Image', base64Image);
      formData.append('apikey', apiKey);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Process the OCR response data
        console.log(data);
        console.log(data.ParsedResults[0].ParsedText);
        resultElement.value = data.ParsedResults[0].ParsedText;
        loadingELement.style.display = 'none';
        resultElement.style.display = 'block';
        saveButton.style.display = "block";
      } else {
        console.error('Failed to send image for OCR');
      }
    }
    const crop_button = document.getElementById('cropButton');
    crop_button.addEventListener('click', async () => {
      const croppedImage = cropper.getCroppedCanvas().toDataURL('image/png');
      //console.log(croppedImage);
      document.getElementById('cropped').src = `${croppedImage}`;
      sendImageForOCR(croppedImage);
      document.querySelector('.image-container').style.display = 'none';
      loadingELement.style.display = 'block';
      document.body.style.width = '500px';
      document.body.style.height = '500px';
      chrome.runtime.sendMessage({ croppedImageURL: croppedImage });
    })
    crop_button.style.display = "block";

  }
  else {
    console.log("No paused Image element!");
  }
};


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message);
});

// Call the function to handle the message immediately after the listener is set up
chrome.runtime.sendMessage({ requestImage: true }, handleMessage);

getAllNotesFromStorage(displayAllNotes);

