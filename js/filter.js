import { renderThumbnails } from './thumbnails.js';
import { debounce } from './data/utils.js';

const FILTER_DEFAULT = 'filter-default';
const FILTER_RANDOM = 'filter-random';
const FILTER_DISCUSSED = 'filter-discussed';

// Функция фильтрации
const getFilteredPhotos = (photos, filter) => {
  switch (filter) {
    case FILTER_RANDOM: {
      const shuffled = [...photos].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
    }
    case FILTER_DISCUSSED: {
      return [...photos].sort((a, b) => b.comments.length - a.comments.length);
    }
    case FILTER_DEFAULT:
    default: {
      return [...photos];
    }
  }
};

// Создаём обновлённую функцию рендеринга
const createUpdater = (photos, filter) => {
  return () => {
    const filtered = getFilteredPhotos(photos, filter);
    renderThumbnails(filtered);
    setActiveFilter(filter);
  };
};

// Управление активным фильтром
const setActiveFilter = (filterId) => {
  const buttons = document.querySelectorAll('.img-filters__button');
  buttons.forEach(btn => btn.classList.remove('img-filters__button--active'));
  document.querySelector(`#${filterId}`).classList.add('img-filters__button--active');
};

// Экспортируем функцию инициализации
export const initFilters = (photos) => {
  const debouncedDefault = debounce(createUpdater(photos, FILTER_DEFAULT), 500);
  const debouncedRandom = debounce(createUpdater(photos, FILTER_RANDOM), 500);
  const debouncedDiscussed = debounce(createUpdater(photos, FILTER_DISCUSSED), 500);

  document.querySelector(`#${FILTER_DEFAULT}`).addEventListener('click', debouncedDefault);
  document.querySelector(`#${FILTER_RANDOM}`).addEventListener('click', debouncedRandom);
  document.querySelector(`#${FILTER_DISCUSSED}`).addEventListener('click', debouncedDiscussed);
};
