import { loadPhotos } from './data/api.js';
import { renderThumbnails } from './thumbnails.js';
import { initEditor } from './editor.js';
import { initFilters } from './filter.js';
import { initForm } from './form.js';

export let photos = [];

const showDataError = () => {
  const existingError = document.querySelector('.data-error');
  if (existingError) {
    existingError.remove();
  }

  const errorTemplate = document.querySelector('#error');
  if (errorTemplate) {
    const errorElement = errorTemplate.content.cloneNode(true).children[0];

    errorElement.classList.add('data-error');

    // Меняем текст
    const errorTitle = errorElement.querySelector('.error__title');
    if (errorTitle) {
      errorTitle.textContent = 'Ошибка загрузки данных';
    }

    const errorButton = errorElement.querySelector('.error__button');
    if (errorButton) {
      errorButton.textContent = 'Попробовать снова';
      errorButton.addEventListener('click', () => {
        errorElement.remove();
        location.reload();
      });
    }

    document.body.appendChild(errorElement);

    // Закрытие по клику вне блока
    errorElement.addEventListener('click', (evt) => {
      if (evt.target === errorElement) {
        errorElement.remove();
      }
    });

    // Закрытие по Esc
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && document.querySelector('.data-error')) {
        document.querySelector('.data-error').remove();
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  initForm();
  try {
    photos = await loadPhotos();
    renderThumbnails(photos);
    initEditor();
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    initFilters(photos);
  } catch (error) {
    showDataError();
  }
});
