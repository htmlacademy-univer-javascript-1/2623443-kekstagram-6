import { generatePhotosArray } from './data/data-generation.js';
import { renderThumbnails } from './thumbnails.js';
import { initEditor } from './editor.js';
import './form.js';

const photos = generatePhotosArray();

document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
  initEditor();
});

export { photos };
