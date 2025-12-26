// модуль для редактирования изображения

// Константы
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

// Элементы масштаба
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

// Элементы эффектов
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');

// Настройки для эффектов
const EFFECTS = {
  none: {
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
};

// 1. Функции для эффектов
const updateEffect = (effect, value) => {
  imagePreview.style.filter = 'none';

  if (effect === 'none') {
    return;
  }

  const { filter, unit } = EFFECTS[effect];
  imagePreview.style.filter = `${filter}(${value}${unit})`;
};

const hideSlider = () => {
  effectLevel.classList.add('hidden');
};

const showSlider = () => {
  effectLevel.classList.remove('hidden');
};

const updateSlider = (effect) => {
  // Уничтожаем старый слайдер, если существует
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }

  // Создаём новый слайдер
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: EFFECTS[effect].min,
      max: EFFECTS[effect].max
    },
    start: EFFECTS[effect].max,
    step: EFFECTS[effect].step,
    connect: 'lower'
  });

  // Назначаем новый обработчик
  effectLevelSlider.noUiSlider.on('update', (values, handle) => {
    const value = values[handle];
    effectLevelValue.value = value;
    updateEffect(effect, value);
  });
};

const onEffectChange = (evt) => {
  if (evt.target.type !== 'radio') {
    return;
  }

  const newEffect = evt.target.value;

  if (newEffect === 'none') {
    hideSlider();
    updateEffect('none', 0);
  } else {
    showSlider();
    updateSlider(newEffect);
  }
};

// 2. Функции для масштаба
const updateScale = (value) => {
  scaleValue.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  const currentValue = parseInt(scaleValue.value, 10);
  const newValue = currentValue - SCALE_STEP;
  if (newValue >= SCALE_MIN) {
    updateScale(newValue);
  }
};

const onScaleBiggerClick = () => {
  const currentValue = parseInt(scaleValue.value, 10);
  const newValue = currentValue + SCALE_STEP;
  if (newValue <= SCALE_MAX) {
    updateScale(newValue);
  }
};

// 3. Сброс редактора
const resetEditor = () => {
  updateScale(SCALE_DEFAULT);

  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  hideSlider();
  imagePreview.style.filter = 'none';

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }
};

// 4. Инициализация
const initEditor = () => {
  if (!scaleSmaller || !scaleBigger || !scaleValue || !imagePreview) {
    return;
  }

  // Инициализация масштаба
  updateScale(SCALE_DEFAULT);
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);

  // Инициализация эффектов
  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  hideSlider();

  // Переопределяем closeForm для сброса редактора
  const closeButton = document.querySelector('#upload-cancel');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      resetEditor();
    });
  }
};

// Экспорт
export { initEditor, resetEditor };
