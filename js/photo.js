'use strict';

(function () {

  const FILE_TYPES = ['jpg', 'jpeg', 'png'];

  let uploadFile = document.querySelector('#upload-file');
  let editor = document.querySelector('.img-upload__overlay');
  let photo = editor.querySelector('.img-upload__preview img');
  let buttonCloseEditor = editor.querySelector('#upload-cancel');
  let controlSmaller = editor.querySelector('.scale__control--smaller');
  let controlBigger = editor.querySelector('.scale__control--bigger');
  let controlValue = editor.querySelector('.scale__control--value');

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


  function imageResize(way) {
    let valueNow = parseInt(controlValue.getAttribute('value'));
    if ( (way === 'decrease' && valueNow <= 25) || (way === 'increase' && valueNow >= 100) ) {
      return false;
    } else {
      let newValue = (way === 'decrease') ? (valueNow - 25) : (valueNow + 25);
      controlValue.setAttribute('value', (newValue + '%'));
      photo.style.transform = `scale(${newValue / 100})`;
    }
  };


  // function imageResize(way) {
  //   let valueNow = parseInt(controlValue.getAttribute('value'));
  //   let newValue = valueNow;
  //   if (valueNow === 25 || valueNow === 100) {
  //     return false;
  //   } else {
  //     newValue = (way === 'decrease') ? (valueNow - 25) : (valueNow + 25)
  //   }
  //   if (way === 'decrease') {
  //     valueNow === 25 ? false : newValue = valueNow - 25;
  //   } else {
  //     valueNow === 100 ? false : newValue = valueNow + 25;
  //   }
  //   controlValue.setAttribute('value', (newValue + '%'));
  //   photo.style.transform = `scale(${newValue / 100})`;
  //   console.log(newValue)
  // };


  function openEditor() {
    pullPhoto(uploadFile, photo);
    editor.classList.remove('hidden');
    document.body.classList.add('modal-open');

    buttonCloseEditor.addEventListener('click', closeEditor);
    document.body.addEventListener('keydown', evt => {
      window.util.isEscEvent(evt, closeEditor);
    })

    controlSmaller.addEventListener('click', () => {
      imageResize('decrease');
    });
    controlBigger.addEventListener('click', () => {
      imageResize('increase');
    });
  };

  uploadFile.addEventListener('change', openEditor);
})();
