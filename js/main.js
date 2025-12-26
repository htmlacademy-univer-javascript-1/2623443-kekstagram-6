import { loadPhotos } from './data/api.js';
import { renderThumbnails } from './thumbnails.js';
import { initEditor } from './editor.js';
import './form.js';

export let photos = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    photos = await loadPhotos();
    renderThumbnails();
    initEditor();
    // Показать блок фильтров
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  } catch {
    // Показать окно ошибки
    const errorTemplate = document.querySelector('#error').content.cloneNode(true);
    document.body.appendChild(errorTemplate.querySelector('.error'));

    const close = () => {
      document.querySelector('.error')?.remove();
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('click', onOutsideClick);
    };

    const onEsc = (evt) => { if (evt.key === 'Escape') close(); };
    const onOutsideClick = (evt) => { if (evt.target.matches('.error')) close(); };

    document.querySelector('.error__button').addEventListener('click', close);
    document.addEventListener('keydown', onEsc);
    document.addEventListener('click', onOutsideClick);
  }
});
