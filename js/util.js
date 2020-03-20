'use strict';

(function () {

  const ENTER_KEY = 'Enter';
  const ESC_KEY = 'Escape';

  let getSomethingIfEnterEvent = function (evt, action) {
    if (evt.key === ENTER_KEY) {
      action();
    }
  };

  let getSomethingIfEscEvent = function (evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  };


  window.util = {
    isEnterEvent: getSomethingIfEnterEvent,
    isEscEvent: getSomethingIfEscEvent,
  };

})();
