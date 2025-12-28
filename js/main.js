import { loadPhotos } from './data/api.js';
import { renderThumbnails } from './thumbnails.js';
import { initEditor } from './editor.js';
import { initFilters } from './filter.js';
import './form.js';

export let photos = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    photos = await loadPhotos();
    renderThumbnails(photos);
    initEditor();
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    initFilters(photos);
  } catch (error) {
    const errorTemplate = document.querySelector('#error').content.cloneNode(true);
    const errorElement = errorTemplate.querySelector('.error');
    document.body.appendChild(errorElement);

    const closeError = () => {
      errorElement.remove();
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('click', onOutsideClick);
    };

    const onEsc = (evt) => {
      if (evt.key === 'Escape') {
        closeError();
      }
    };

    const onOutsideClick = (evt) => {
      if (evt.target === errorElement) {
        closeError();
      }
    };

    errorElement.querySelector('.error__button').addEventListener('click', closeError);
    document.addEventListener('keydown', onEsc);
    document.addEventListener('click', onOutsideClick);
  }
});
