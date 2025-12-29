import { renderFullscreen } from './fullscreen.js';

export const renderThumbnails = (photosToRender) => {
  if (!Array.isArray(photosToRender) || photosToRender.length === 0) {
    return;
  }

  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture');

  if (!picturesContainer || !pictureTemplate) {
    return;
  }

  const uploadSection = picturesContainer.querySelector('.img-upload');
  const titleElement = picturesContainer.querySelector('.pictures__title');

  const existingThumbnails = picturesContainer.querySelectorAll('.picture');
  existingThumbnails.forEach((thumb) => thumb.remove());

  const fragment = document.createDocumentFragment();

  photosToRender.forEach((photo) => {
    const thumbnailElement = pictureTemplate.content.cloneNode(true);
    const thumbnail = thumbnailElement.querySelector('.picture');
    const image = thumbnail.querySelector('.picture__img');
    const commentsElement = thumbnail.querySelector('.picture__comments');
    const likesElement = thumbnail.querySelector('.picture__likes');

    image.src = photo.url;
    image.onerror = () => {
      image.src = 'img/upload-default-image.jpg';
    };
    image.alt = photo.description || 'Фотография';
    commentsElement.textContent = photo.comments.length;
    likesElement.textContent = photo.likes;

    thumbnail.dataset.photoId = photo.id;

    thumbnail.addEventListener('click', (evt) => {
      evt.preventDefault();
      const photoId = parseInt(thumbnail.dataset.photoId, 10);
      renderFullscreen(photoId, photosToRender);
    });

    fragment.appendChild(thumbnailElement);
  });

  if (uploadSection) {
    picturesContainer.insertBefore(fragment, uploadSection);
  } else if (titleElement) {
    picturesContainer.insertBefore(fragment, titleElement.nextSibling);
  } else {
    picturesContainer.appendChild(fragment);
  }
};
