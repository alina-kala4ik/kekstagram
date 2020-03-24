'use strict';

(function () {

  let form = document.querySelector('.img-upload__form');
  let textHashtags = document.querySelector('.text__hashtags');
  let sussesTemplate = document.querySelector('#success').content.querySelector('.success');
  let errorTemplate = document.querySelector('#error').content.querySelector('.error');
  let main = document.querySelector('main');
  let uploadFile = document.querySelector('#upload-file');

  let regHashtags = /#[а-яА-ЯёЁa-zA-Z0-9]+$/;
  let arrHashtags = [];

  function hashtagsStartValidation(arrHashtags) {
    return arrHashtags.every(item => item.startsWith('#'));
  };


  function hashtagsLetterValidation(arrHashtags) {
    return arrHashtags.every(item => regHashtags.test(item));
  }


  function hashtagsLengthValidation(arrHashtags) {
    return arrHashtags.every(item => item.length <= 20);
  }


  function hashtagsRepeatValidation(arrHashtags) {
    let copy = arrHashtags.map(item => item.toLowerCase())
    return copy.some( (item, i) => copy.includes(item, i+1) );
  };


  function hashtagsAllValidations(arrHashtags) {
    if ( !hashtagsStartValidation(arrHashtags)) {
      textHashtags.setCustomValidity('хэштег должен начинаться с #');
    } else if ( !hashtagsLetterValidation(arrHashtags)) {
      textHashtags.setCustomValidity('хэштег не должен содержать спецсимволы и быть пустым');
    } else if ( !hashtagsLengthValidation(arrHashtags)) {
      textHashtags.setCustomValidity('максимальная длина одного хэш-тега 20 символов');
    } else if (arrHashtags.length > 5) {
      textHashtags.setCustomValidity('нельзя указать больше пяти хэш-тегов');
    } else if (hashtagsRepeatValidation(arrHashtags)) {
      textHashtags.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
    } else {
      textHashtags.setCustomValidity('');
    }
  };


  function closeSend(template) {
    template.parentNode.removeChild(template);
  };


  function sussesSend() {
    uploadFile.value = '';
    main.appendChild(sussesTemplate);

    function bodyKeydownCloseSussesSendHandler(evt) {
      if (evt.key === 'Escape') {
        closeSend(sussesTemplate);
      }
      document.body.removeEventListener('click', bodyClickCloseSussesSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseSussesSendHandler);
    };

    function bodyClickCloseSussesSendHandler() {
      closeSend(sussesTemplate);
      document.body.removeEventListener('click', bodyClickCloseSussesSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseSussesSendHandler);
    };

    document.body.addEventListener('keydown', bodyKeydownCloseSussesSendHandler);
    document.body.addEventListener('click', bodyClickCloseSussesSendHandler);
  };


  function errorSend() {
    uploadFile.value = '';
    main.appendChild(errorTemplate);

    function bodyKeydownCloseErrorSendHandler(evt) {
      if (evt.key === 'Escape') {
        closeSend(errorTemplate);
      }
      document.body.removeEventListener('click', bodyClickCloseErrorSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseErrorSendHandler);
    };

    function bodyClickCloseErrorSendHandler() {
      closeSend(errorTemplate);
      document.body.removeEventListener('click', bodyClickCloseErrorSendHandler);
      document.body.removeEventListener('keydown', bodyKeydownCloseErrorSendHandler);
    };

    document.body.addEventListener('keydown', bodyKeydownCloseErrorSendHandler);
    document.body.addEventListener('click', bodyClickCloseErrorSendHandler);
  };


  form.addEventListener('submit', evt => {
    evt.preventDefault();
    if (arrHashtags.length > 0) {
      hashtagsAllValidations(arrHashtags);
    }
    window.photo.closeEditor(evt);
    window.backend.send(sussesSend, errorSend, new FormData(form));
  })


  textHashtags.addEventListener('input', evt => {
    arrHashtags = textHashtags.value.split(' ');
    hashtagsAllValidations(arrHashtags);
  })

})();
