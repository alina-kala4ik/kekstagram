'use strict';

(function () {

  let editor = document.querySelector('.img-upload__overlay');
  let textHashtags = editor.querySelector('.text__hashtags');
  let textDescription = editor.querySelector('.text__description');
  let buttonCloseEditor = editor.querySelector('#upload-cancel');

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


  function hashtagsAllValidations(array) {
    if (!hashtagsStartValidation(array)) {
      textHashtags.setCustomValidity('хэштег должен начинаться с #');
    } else if (!hashtagsLetterValidation(array)) {
      textHashtags.setCustomValidity('хэштег не должен содержать спецсимволы и быть пустым');
    } else if (!hashtagsLengthValidation(array)) {
      textHashtags.setCustomValidity('максимальная длина одного хэш-тега 20 символов');
    } else if (array.length > 5) {
      textHashtags.setCustomValidity('нельзя указать больше пяти хэш-тегов');
    } else if (hashtagsRepeatValidation(array)) {
      textHashtags.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
    } else {
      textHashtags.setCustomValidity('');
    }
  }


  function closeSend(template) {
    template.parentNode.removeChild(template);
  }


  function sussesSend() {
    uploadFile.value = '';
    main.appendChild(sussesTemplate);

    function bodyKeydownCloseSussesSendHandler(evt) {
      if (evt.key === 'Escape') {
        closeSend(sussesTemplate);
      }
      document.body.removeEventListener('click', bodyClickCloseSussesSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseSussesSendHandler);
    }

    function bodyClickCloseSussesSendHandler() {
      closeSend(sussesTemplate);
      document.body.removeEventListener('click', bodyClickCloseSussesSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseSussesSendHandler);
    }

    document.body.addEventListener('keydown', bodyKeydownCloseSussesSendHandler);
    document.body.addEventListener('click', bodyClickCloseSussesSendHandler);
  }


  function errorSend() {
    uploadFile.value = '';
    main.appendChild(errorTemplate);

    function bodyKeydownCloseErrorSendHandler(evt) {
      if (evt.key === 'Escape') {
        closeSend(errorTemplate);
      }
      document.body.removeEventListener('click', bodyClickCloseErrorSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseErrorSendHandler);
    }

    function bodyClickCloseErrorSendHandler() {
      closeSend(errorTemplate);
      document.body.removeEventListener('click', bodyClickCloseErrorSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseErrorSendHandler);
    }

    document.body.addEventListener('keydown', bodyKeydownCloseErrorSendHandler);
    document.body.addEventListener('click', bodyClickCloseErrorSendHandler);
  }


  function submitFormHandler(evt) {
    evt.preventDefault();
    if (arrHashtags.length > 0) {
      hashtagsAllValidations(arrHashtags);
    }
    window.photo.closeEditor(evt);
    window.backend.send(sussesSend, errorSend, new FormData(form));
  }


  function inputFormHandler() {
    arrHashtags = textHashtags.value.split(' ');
    hashtagsAllValidations(arrHashtags);
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
      editor.classList.add('hidden');
      document.body.classList.remove('modal-open');
      uploadFile.addEventListener('change', openEditor, {once: true});
      form.removeEventListener('submit', submitFormHandler);
      textHashtags.removeEventListener('input', inputFormHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseEditorHandler);
    }
    return true;
  }


  function openEditor() {
    form.addEventListener('submit', submitFormHandler);
    textHashtags.addEventListener('input', inputFormHandler);

    buttonCloseEditor.addEventListener('click', closeEditor);
    document.body.addEventListener('keydown', bodyKeydownCloseEditorHandler);
  }

  uploadFile.addEventListener('change', openEditor, {once: true});

})();
