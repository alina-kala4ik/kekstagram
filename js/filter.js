'use strict';

(function () {

  const DEBOUNCE_INTERVAL = 500;

  let imgFilters = document.querySelector('.img-filters');
  let buttonsFilters = document.querySelectorAll('.img-filters__button');
  let buttonFilterDefault = document.querySelector('#filter-default');
  let buttonFilterRandom = document.querySelector('#filter-random');
  let buttonFilterDiscussed = document.querySelector('#filter-discussed');

  let lastTimeout;

  let arrayPicture;

  function copyData(backendDate) {
    arrayPicture = backendDate;
    window.picture.return(arrayPicture);
    showFilters(arrayPicture);
  }

  window.backend.load(copyData);

  function filtered(evt, array) {
    buttonsFilters.forEach(item => item.classList.remove('img-filters__button--active'));
    evt.target.classList.add('img-filters__button--active');
    let oldPictures = document.querySelectorAll('.picture');
    oldPictures.forEach(item => {
      item.parentNode.removeChild(item);
    });

    let filteredArray;
    let copyArray = array.map(item => item);
    switch (evt.target) {
      case buttonFilterDefault:
        filteredArray = array;
        break;
      case buttonFilterDiscussed:
        filteredArray = copyArray.sort((left, right) => {
          return right.comments.length - left.comments.length;
        });
        break;
      case buttonFilterRandom:
        for (let i = copyArray.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
        }
        filteredArray = copyArray;
        break;
    }
    setTimeout(window.picture.return, DEBOUNCE_INTERVAL, filteredArray);
  }


  function showFilters(array) {
    imgFilters.classList.remove('img-filters--inactive');

    buttonsFilters.forEach(item => {
      item.addEventListener('click', evt => {
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(filtered, DEBOUNCE_INTERVAL, evt, array);
      });
    });
  }

  window.filter = {
    start: showFilters
  };
})();
