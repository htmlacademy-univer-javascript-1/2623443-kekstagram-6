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

// Управление активным фильтром
const setActiveFilter = (filterId) => {
  const buttons = document.querySelectorAll('.img-filters__button');
  buttons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
  document.querySelector(`#${filterId}`).classList.add('img-filters__button--active');
};
const createRenderUpdater = (photos, filter) => () =>
  renderThumbnails(getFilteredPhotos(photos, filter));

// Обработчик клика по фильтру
const createFilterHandler = (photos, filter) => {
  const debouncedRender = debounce(createRenderUpdater(photos, filter), 500);

  return () => {
    setActiveFilter(filter);
    debouncedRender();
  };
};

// Инициализация
export const initFilters = (photos) => {
  document.querySelector(`#${FILTER_DEFAULT}`).addEventListener('click', createFilterHandler(photos, FILTER_DEFAULT));
  document.querySelector(`#${FILTER_RANDOM}`).addEventListener('click', createFilterHandler(photos, FILTER_RANDOM));
  document.querySelector(`#${FILTER_DISCUSSED}`).addEventListener('click', createFilterHandler(photos, FILTER_DISCUSSED));
};
