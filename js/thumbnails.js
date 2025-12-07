import { photos } from './main.js';

const renderThumbnails = () => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture');

  if (!picturesContainer || !pictureTemplate) {
    return;
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnailElement = pictureTemplate.content.cloneNode(true);
    const thumbnail = thumbnailElement.querySelector('.picture');
    const image = thumbnail.querySelector('.picture__img');
    const commentsElement = thumbnail.querySelector('.picture__comments');
    const likesElement = thumbnail.querySelector('.picture__likes');

    image.src = photo.url;
    image.alt = photo.description;
    commentsElement.textContent = photo.comments.length;
    likesElement.textContent = photo.likes;

    thumbnail.dataset.photoId = photo.id;

    fragment.appendChild(thumbnailElement);
  });

  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => {
    picture.remove();
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
