'use strict';

(function () {

  const numberDisplayedComments = 5;

  let pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  let picturesFragment = document.createDocumentFragment();
  let picturesWrapper = document.querySelector('.pictures');

  let bigPicture = document.querySelector('.big-picture');
  let bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  let bigPictureLikes = bigPicture.querySelector('.likes-count');
  let bigPictureComment = bigPicture.querySelector('.comments-count');
  let bigPictureCaption = bigPicture.querySelector('.social__caption');
  let bigPictureSocialComments = bigPicture.querySelector('.social__comments');
  let commentsFragment = document.createDocumentFragment();
  let buttonClose = bigPicture.querySelector('.big-picture__cancel');
  let commentsLoader = bigPicture.querySelector('.comments-loader');
  let inputComment = bigPicture.querySelector('.social__footer-text');


  function returnBigImg(item) {
    bigPictureImg.setAttribute('src', item.url);
    bigPictureLikes.textContent = item.likes;
    bigPictureComment.textContent = item.comments.length;
    bigPictureCaption.textContent = item.description;
  }


  function returnCommentsInBigImg(arrayComments) {
    bigPictureSocialComments.innerHTML = '';

    arrayComments.forEach(element => {
      let comment = document.createElement('li');
      comment.classList.add('social__comment');

      let img = document.createElement('img');
      img.setAttribute('src', element.avatar);
      img.classList.add('social__picture');
      img.setAttribute('width', '35');
      img.setAttribute('height', '35');
      img.setAttribute('alt', element.name);
      comment.appendChild(img);

      let text = document.createElement('p');
      text.classList.add('social__text');
      text.textContent = element.message;

      comment.appendChild(text);
      commentsFragment.appendChild(comment);
    });
    bigPictureSocialComments.appendChild(commentsFragment);
  }


  function closeBigImg() {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    bigPictureImg.setAttribute('src', '');
    inputComment.value = '';
  }


  function openBigImg(item) {
    document.body.classList.add('modal-open');
    bigPicture.classList.remove('hidden');
    returnBigImg(item);
    buttonClose.addEventListener('click', closeBigImg);

    if (item.comments.length <= numberDisplayedComments) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }

    document.body.addEventListener('keydown', evt => {
      if (evt.key === 'Enter') {
        closeBigImg();
      }
    });


    let count = 0;
    function showNewComments() {
      let shownComments = item.comments.slice(count, count + numberDisplayedComments);
      returnCommentsInBigImg(shownComments);

      if (item.comments.length > count + numberDisplayedComments) {
        commentsLoader.addEventListener('click', () => {
          count += numberDisplayedComments;
          showNewComments();
        }, {once: true});
      } else {
        commentsLoader.classList.add('hidden');
      }
    }
    showNewComments();
  }


  function returnPictures(arrayData) {
    arrayData.forEach(item => {
      let picture = pictureTemplate.cloneNode(true);
      picture.querySelector('.picture__img').setAttribute('src', item.url);
      picture.querySelector('.picture__likes').textContent = item.likes;
      picture.querySelector('.picture__comments').textContent = item.comments.length;

      picture.addEventListener('click', () => {
        openBigImg(item);
      });

      picture.addEventListener('keydown', evt => {
        if (evt.key === 'Enter') {
          openBigImg(item);
        }
      });

      picturesFragment.appendChild(picture);
    });
    picturesWrapper.appendChild(picturesFragment);
  }

  window.picture = {
    return: returnPictures
  };

})();
