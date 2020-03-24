'use strict';

(function () {

  let form = document.querySelector('.img-upload__form');
  let textHashtags = document.querySelector('.text__hashtags');

  let regHashtags = /#[а-яА-ЯёЁa-zA-Z0-9]+$/;
  let arrHashtags;

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


  form.addEventListener('submit', evt => {
    evt.preventDefault();
    hashtagsAllValidations(arrHashtags);
  })

  textHashtags.addEventListener('input', evt => {
    arrHashtags = textHashtags.value.split(' ');
    hashtagsAllValidations(arrHashtags);
  })

})();
