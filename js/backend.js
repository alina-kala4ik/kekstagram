'use strict';

(function () {

  const URL_GET_DATA = 'https://js.dump.academy/kekstagram/data';
  const CODE_SUCCESS = 200;

  function getData(onLoad) {
    let xhr = new XMLHttpRequest;

    xhr.responseType = 'json';

    xhr.addEventListener('load', function(){
      switch(xhr.status) {
        case CODE_SUCCESS: onLoad(xhr.response); break;
        default: throw new Error('Ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    })

    xhr.open('GET', URL_GET_DATA);
    xhr.send();
  };

  window.backend = {
    load: getData,
  }

})();
