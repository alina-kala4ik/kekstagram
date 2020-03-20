'use strict';

(function () {

  const FILE_TYPES = ['jpg', 'jpeg', 'png'];

  let uploadFile = document.querySelector('#upload-file');
  let imageEditor = document.querySelector('.img-upload__overlay');
  let photo = imageEditor.querySelector('.img-upload__preview img');

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

  uploadFile.addEventListener('change', () => {
    pullPhoto(uploadFile, photo);
    imageEditor.classList.remove('hidden');
  })
})();
