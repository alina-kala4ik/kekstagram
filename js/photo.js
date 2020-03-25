'use strict';

(function () {

  const FILE_TYPES = ['jpg', 'jpeg', 'png'];
  const widthFilterLine = 453;
  const stepResizePhoto = 25;

  let uploadFile = document.querySelector('#upload-file');
  let editor = document.querySelector('.img-upload__overlay');
  let photo = editor.querySelector('.img-upload__preview img');
  let buttonCloseEditor = editor.querySelector('#upload-cancel');
  let controlSize = editor.querySelectorAll('.scale__control');
  let controlSmaller = editor.querySelector('.scale__control--smaller');
  let controlBigger = editor.querySelector('.scale__control--bigger');
  let controlValue = editor.querySelector('.scale__control--value');
  let buttonsEffects = editor.querySelectorAll('.effects__radio');
  let effectLevelWrapper = editor.querySelector('.effect-level');
  let effectLevelPin = editor.querySelector('.effect-level__pin');
  let inputEffectLevelValue = editor.querySelector('.effect-level__value');
  let effectLevelDepth = editor.querySelector('.effect-level__depth');
  let textHashtags = editor.querySelector('.text__hashtags');
  let textDescription = editor.querySelector('.text__description');
  let form = document.querySelector('.img-upload__form');

  let activeFilter;

  let listFilters = {
    chrome: 'grayscale',
    sepia: 'sepia',
    marvin: 'invert',
    phobos: 'blur',
    heat: 'brightness'
  };


  function pullPhoto(fileChooser, preview) {
    let file = fileChooser.files[0];
    let fileName = file.name.toLowerCase();

    let validPhoto = FILE_TYPES.some(item => {
      return fileName.endsWith(item);
    });

    if (validPhoto) {
      var reader = new FileReader();
      reader.addEventListener('load', () => {
        preview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  }


  function changesIntensityEffect(coordPin) {
    let intensityFilter;
    let filterValue;
    switch (activeFilter) {
      case 'chrome':
        filterValue = (coordPin / widthFilterLine).toFixed(1);
        intensityFilter = filterValue; break;
      case 'sepia':
        filterValue = (coordPin / widthFilterLine).toFixed(1);
        intensityFilter = filterValue; break;
      case 'marvin':
        filterValue = (coordPin / widthFilterLine).toFixed(1) * 100;
        intensityFilter = filterValue + '%'; break;
      case 'phobos':
        filterValue = (coordPin * 3 / widthFilterLine).toFixed(1);
        intensityFilter = filterValue + 'px'; break;
      case 'heat':
        filterValue = ((coordPin * 2 / widthFilterLine) + 1).toFixed(1);
        intensityFilter = filterValue; break;
    }
    photo.style.filter = `${listFilters[activeFilter]}(${intensityFilter})`;
    inputEffectLevelValue.setAttribute('value', filterValue);
    effectLevelDepth.style.width = `${(coordPin / widthFilterLine).toFixed(1) * 100}%`;
  }


  function effectLevelPinMove(evt) {
    let startCoords = {
      x: evt.clientX,
    };

    function onMouseMove(evtMove) {
      let shift = {
        x: startCoords.x - evtMove.clientX,
      };

      startCoords = {
        x: evtMove.clientX,
      };

      let coordsForPin = effectLevelPin.offsetLeft - shift.x;
      if (coordsForPin < 0) {
        coordsForPin = 0;
      } else if (coordsForPin > widthFilterLine) {
        coordsForPin = widthFilterLine;
      }
      effectLevelPin.style.left = `${coordsForPin}px`;
      changesIntensityEffect(coordsForPin);
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }


  function resetFilter() {
    inputEffectLevelValue.setAttribute('value', '0');
    effectLevelPin.removeEventListener('mousedown', effectLevelPinMove);
    photo.classList = '';
    photo.setAttribute('style', '');
    effectLevelWrapper.style.display = 'none';
  }


  function filterApplication(evt) {
    activeFilter = evt.target.value;
    if (evt.target.value === 'none') {
      resetFilter();
    } else {
      photo.classList.add(`effects__preview--${activeFilter}`);
      effectLevelWrapper.style.display = 'block';
      effectLevelPin.addEventListener('mousedown', effectLevelPinMove);
      inputEffectLevelValue.setAttribute('value', '100');
      effectLevelDepth.style.width = '100%';
      effectLevelPin.style.left = `${widthFilterLine}px`;
    }
  }


  function closeEditor(evt) {
    if (evt.target === textHashtags || evt.target === textDescription) {
      return false;
    } else {
      editor.classList.add('hidden');
      document.body.classList.remove('modal-open');
      uploadFile.addEventListener('change', openEditor, {once: true});
      controlValue.setAttribute('value', '100%');
      photo.style.transform = 'none';
      uploadFile.value = '';
      resetFilter();
      form.reset();

      buttonCloseEditor.removeEventListener('click', closeEditor);
      document.body.removeEventListener('keydown', bodyKeydownCloseEditorHandler);
      controlSize.forEach(item => {
        item.removeEventListener('click', imageResizeHandler);
      });

      buttonsEffects.forEach(item => {
        item.removeEventListener('click', filterApplication);
      });
    }
    return true;
  }

  function bodyKeydownCloseEditorHandler(evt) {
    if (evt.key === 'Escape') {
      closeEditor(evt);
    }
  }

  function imageResizeHandler(evt) {
    let valueNow = parseInt(controlValue.getAttribute('value'), 10);
    if ((evt.target === controlSmaller && valueNow <= stepResizePhoto) || (evt.target === controlBigger && valueNow >= 100)) {
      return false;
    } else {
      let newValue = (evt.target === controlSmaller) ? (valueNow - stepResizePhoto) : (valueNow + stepResizePhoto);
      controlValue.setAttribute('value', (newValue + '%'));
      photo.style.transform = `scale(${newValue / 100})`;
    }
    return true;
  }

  function openEditor() {
    effectLevelWrapper.style.display = 'none';
    pullPhoto(uploadFile, photo);
    editor.classList.remove('hidden');
    document.body.classList.add('modal-open');

    buttonCloseEditor.addEventListener('click', closeEditor);
    document.body.addEventListener('keydown', bodyKeydownCloseEditorHandler);

    controlSize.forEach(item => {
      item.addEventListener('click', imageResizeHandler);
    });

    buttonsEffects.forEach(item => {
      item.addEventListener('click', filterApplication);
    });
  }


  uploadFile.addEventListener('change', openEditor, {once: true});

  window.photo = {
    closeEditor: closeEditor
  };

})();
