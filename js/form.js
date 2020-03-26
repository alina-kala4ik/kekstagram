'use strict';

(function () {

  let editor = document.querySelector('.img-upload__overlay');
  let textHashtags = editor.querySelector('.text__hashtags');
  let textDescription = editor.querySelector('.text__description');
  let buttonCloseEditor = editor.querySelector('#upload-cancel');
  let buttonSubmit = editor.querySelector('#upload-submit');

  let form = document.querySelector('.img-upload__form');
  let sussesTemplate = document.querySelector('#success').content.querySelector('.success');
  let errorTemplate = document.querySelector('#error').content.querySelector('.error');
  let main = document.querySelector('main');
  let uploadFile = document.querySelector('#upload-file');

  let regHashtags = /#[а-яА-ЯёЁa-zA-Z0-9]+$/;
  let arrHashtags = [];

  function hashtagsStartValidation(array) {
    return array.every(item => item.startsWith('#'));
  }


  function hashtagsLetterValidation(array) {
    return array.every(item => regHashtags.test(item));
  }


  function hashtagsLengthValidation(array) {
    return array.every(item => item.length <= 20);
  }


  function hashtagsRepeatValidation(array) {
    let copy = array.map(item => item.toLowerCase());
    return copy.some((item, i) => copy.includes(item, i + 1));
  }


  function addErrorMessage(text) {
    textHashtags.setCustomValidity(text);
    textHashtags.style.border = '2px solid red';
  }


  function hashtagsAllValidations(array) {
    if (!hashtagsStartValidation(array)) {
      addErrorMessage('хэштег должен начинаться с #');
    } else if (!hashtagsLetterValidation(array)) {
      addErrorMessage('хэштег не должен содержать спецсимволы и быть пустым');
    } else if (!hashtagsLengthValidation(array)) {
      addErrorMessage('максимальная длина одного хэш-тега 20 символов');
    } else if (array.length > 5) {
      addErrorMessage('нельзя указать больше пяти хэш-тегов');
    } else if (hashtagsRepeatValidation(array)) {
      addErrorMessage('один и тот же хэш-тег не может быть использован дважды');
    } else {
      addErrorMessage('');
    }
  }


  function showSend(template) {
    main.appendChild(template);

    function bodyKeydownHandler(evt) {
      if (evt.key === 'Escape') {
        template.parentNode.removeChild(template);
      }
      document.body.removeEventListener('click', bodyAndButtonClickHandler);
      document.body.removeEventListener('keydown', bodyKeydownHandler);
    }

    function bodyAndButtonClickHandler(evt) {
      if (evt.target.tagName === 'SECTION' || evt.target.tagName === 'BUTTON') {
        template.parentNode.removeChild(template);
        document.body.removeEventListener('click', bodyAndButtonClickHandler);
        document.body.removeEventListener('keydown', bodyKeydownHandler);
      }
    }

    document.body.addEventListener('keydown', bodyKeydownHandler);
    document.body.addEventListener('click', bodyAndButtonClickHandler);
  }


  function sussesSend() {
    showSend(sussesTemplate);
  }


  function errorSend() {
    showSend(errorTemplate);
  }


  function submitFormHandler(evt) {
    evt.preventDefault();
    window.backend.send(sussesSend, errorSend, new FormData(form));
    window.photo.closeEditor(evt);
    closeEditor(evt);
  }


  function textHashtagsInputHandler() {
    textHashtags.style.border = 'none';
  }


  function buttonSubmitHandler() {
    arrHashtags = textHashtags.value.split(' ');
    if (arrHashtags.length > 1) {
      hashtagsAllValidations(arrHashtags);
    }
  }


  function bodyKeydownCloseEditorHandler(evt) {
    if (evt.key === 'Escape') {
      closeEditor(evt);
    }
  }


  function closeEditor(evt) {
    if (evt.target === textHashtags || evt.target === textDescription) {
      return false;
    } else {
      uploadFile.addEventListener('change', openEditor, {once: true});
      form.removeEventListener('submit', submitFormHandler);
      textHashtags.removeEventListener('input', textHashtagsInputHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseEditorHandler);
      buttonSubmit.removeEventListener('click', buttonSubmitHandler);
    }
    return true;
  }


  function openEditor() {
    form.addEventListener('submit', submitFormHandler);
    textHashtags.addEventListener('input', textHashtagsInputHandler);
    buttonSubmit.addEventListener('click', buttonSubmitHandler);

    buttonCloseEditor.addEventListener('click', closeEditor);
    document.body.addEventListener('keydown', bodyKeydownCloseEditorHandler);
  }

  uploadFile.addEventListener('change', openEditor, {once: true});

})();
