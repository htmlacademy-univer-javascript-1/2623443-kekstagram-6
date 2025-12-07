import { generatePhotosArray } from './data/data-generation.js';
import { renderThumbnails } from './thumbnails.js';

const photos = generatePhotosArray();

document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});

export { photos };
