'use strict';

(function () {

  // const URL_GET_DATA = 'https://js.dump.academy/kekstagram/data';
  const URL_GET_DATA = './../data.json';
  const URL_POST_DATA = 'https://js.dump.academy/kekstagram';
  const CODE_SUCCESS = 200;

  function getData(onLoad) {
    let xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      switch (xhr.status) {
        case CODE_SUCCESS: onLoad(xhr.response); break;
        default: throw new Error('Ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('GET', URL_GET_DATA);
    xhr.send();
  }

  function loadData(onLoad, onError, data) {
    let xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      switch (xhr.status) {
        case CODE_SUCCESS: onLoad(xhr.response); break;
        default: onError();
      }
    });

    xhr.addEventListener('error', () => {
      onError();
    });

    xhr.open('POST', URL_POST_DATA);
    xhr.send(data);
  }

  window.backend = {
    load: getData,
    send: loadData
  };

})();
