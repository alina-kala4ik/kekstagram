'use strict';

(function () {

  const FILE_TYPES = ['jpg', 'jpeg', 'png'];

  let uploadFile = document.querySelector('#upload-file');
  let editor = document.querySelector('.img-upload__overlay');
  let photo = editor.querySelector('.img-upload__preview img');
  let buttonCloseEditor = editor.querySelector('#upload-cancel');

  function pullPhoto(fileChooser, preview) {
    let file = fileChooser.files[0];
    let fileName = file.name.toLowerCase();

    let validPhoto = FILE_TYPES.some(item => {
      return fileName.endsWith(item);
    });

    if (validPhoto) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  function closeEditor() {
    editor.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };


  function openEditor() {
    pullPhoto(uploadFile, photo);
    editor.classList.remove('hidden');
    document.body.classList.add('modal-open');

    buttonCloseEditor.addEventListener('click', closeEditor);
    document.body.addEventListener('keydown', evt => {
      window.util.isEscEvent(evt, closeEditor);
    })
  };

  uploadFile.addEventListener('change', openEditor);
})();
