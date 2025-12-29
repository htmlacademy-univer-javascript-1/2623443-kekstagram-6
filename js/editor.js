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

let currentEffect = 'none';

// 1. Функции для эффектов
const updateEffect = (effect, value) => {
  if (effect === 'none') {
    imagePreview.style.filter = 'none';
    return;
  }

  const { filter, unit } = EFFECTS[effect];
  imagePreview.style.filter = `${filter}(${value}${unit})`;
};

const hideSlider = () => {
  if (effectLevel) {
    effectLevel.classList.add('hidden');
  }
};

const showSlider = () => {
  if (effectLevel) {
    effectLevel.classList.remove('hidden');
  }
};

const updateSlider = (effect) => {
  showSlider();

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: EFFECTS[effect].min,
      max: EFFECTS[effect].max
    },
    start: EFFECTS[effect].max,
    step: EFFECTS[effect].step,
    connect: 'lower',
    behaviour: 'snap',
    format: {
      to: function(value) {
        return value;
      },
      from: function(value) {
        return parseFloat(value);
      }
    }
  });

  effectLevelSlider.noUiSlider.on('update', (values, sliderHandle) => {
    const value = values[sliderHandle];

    let formattedValue;
    if (effect === 'chrome' || effect === 'sepia') {
      formattedValue = parseFloat(value.toFixed(1));
    } else if (effect === 'marvin') {
      formattedValue = Math.round(value);
    } else if (effect === 'phobos' || effect === 'heat') {
      formattedValue = parseFloat(value.toFixed(1));
    } else {
      formattedValue = value;
    }

    effectLevelValue.value = formattedValue;
    updateEffect(effect, formattedValue);
  });

  const initialValue = EFFECTS[effect].max;
  effectLevelValue.value = initialValue;
  updateEffect(effect, initialValue);

  const handle = effectLevelSlider.querySelector('.noUi-handle');
  if (handle) {
    handle.setAttribute('tabindex', '0');
  }
};

const onEffectChange = (evt) => {
  if (evt.target.type !== 'radio') {
    return;
  }

  const newEffect = evt.target.value;
  currentEffect = newEffect;

  if (newEffect === 'none') {
    hideSlider();
    updateEffect('none', 0);
  } else {
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
    currentEffect = 'none';
  }

  hideSlider();
  imagePreview.style.filter = 'none';

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }

  if (effectLevelValue) {
    effectLevelValue.value = '';
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

    const initialEffectRadio = document.querySelector('input[name="effect"]:checked');
    const initialEffect = initialEffectRadio ? initialEffectRadio.value : 'none';
    currentEffect = initialEffect;

    if (initialEffect !== 'none') {
      updateSlider(initialEffect);
    } else {
      hideSlider();
    }
  }

  // Обработчики для превью эффектов
  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.addEventListener('click', () => {
      const input = preview.closest('.effects__item').querySelector('input[type="radio"]');
      if (input) {
        input.click();
      }
    });
  });

  // Скрываем слайдер по умолчанию
  if (currentEffect === 'none') {
    hideSlider();
  }

  // Обработчик закрытия формы
  const closeButton = document.querySelector('#upload-cancel');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      resetEditor();
    });
  }
};

export { initEditor, resetEditor };

export const destroyEditor = () => {
  if (scaleSmaller) {
    scaleSmaller.removeEventListener('click', onScaleSmallerClick);
  }
  if (scaleBigger) {
    scaleBigger.removeEventListener('click', onScaleBiggerClick);
  }
  if (effectsList) {
    effectsList.removeEventListener('change', onEffectChange);
  }

  if (effectLevelSlider && effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }
};
