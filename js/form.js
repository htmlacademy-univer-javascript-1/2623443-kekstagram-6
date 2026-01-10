import { uploadPhoto } from './data/api.js';
import { resetEditor } from './editor.js';

// Элементы DOM
const form = document.querySelector('#upload-select-image');
const uploadFileInput = form.querySelector('#upload-file');
const uploadOverlay = form.querySelector('.img-upload__overlay');
const uploadCancel = form.querySelector('#upload-cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const previewImg = document.querySelector('.img-upload__preview img');
const submitButton = form.querySelector('.img-upload__submit');

// Константы
const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

let pristine;

// Валидация хэштегов
const validateHashtagCount = (value) => {
  const hashtags = value.trim().split(' ').filter(tag => tag !== '');
  return hashtags.length <= MAX_HASHTAG_COUNT;
};

const validateHashtagFormat = (value) => {
  const hashtags = value.trim().split(' ').filter(tag => tag !== '');
  if (hashtags.length === 0) return true;
  return hashtags.every(tag => HASHTAG_REGEX.test(tag));
};

const validateHashtagUniqueness = (value) => {
  const hashtags = value.toLowerCase().split(' ').filter(tag => tag !== '');
  const uniqueHashtags = new Set(hashtags);
  return uniqueHashtags.size === hashtags.length;
};

// Валидация комментария
const validateDescription = (value) => value.length <= MAX_COMMENT_LENGTH;

// Сообщения об ошибках
const getHashtagCountError = () => `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`;
const getHashtagFormatError = () => 'Хэш-тег должен начинаться с # и содержать только буквы и цифры (максимум 20 символов)';
const getHashtagUniquenessError = () => 'Один и тот же хэш-тег не может быть использован дважды';
const getDescriptionError = () => `Комментарий не должен превышать ${MAX_COMMENT_LENGTH} символов`;

// Инициализация Pristine
const initValidation = () => {
  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'pristine-error'
  });

  pristine.addValidator(hashtagsInput, validateHashtagCount, getHashtagCountError, 2, true);
  pristine.addValidator(hashtagsInput, validateHashtagFormat, getHashtagFormatError, 1, true);
  pristine.addValidator(hashtagsInput, validateHashtagUniqueness, getHashtagUniquenessError, 3, true);
  pristine.addValidator(descriptionInput, validateDescription, getDescriptionError);
};

// Функции для сообщений
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (successTemplate) {
    const successElement = successTemplate.content.cloneNode(true).children[0];
    successElement.style.zIndex = '3';
    document.body.appendChild(successElement);

    const closeSuccess = () => {
      successElement.remove();
      document.removeEventListener('keydown', onEscSuccess);
      document.removeEventListener('click', onOutsideClickSuccess);
    };

    const onEscSuccess = (e) => {
      if (e.key === 'Escape') closeSuccess();
    };

    const onOutsideClickSuccess = (e) => {
      if (e.target === successElement) closeSuccess();
    };

    successElement.querySelector('.success__button').addEventListener('click', closeSuccess);
    document.addEventListener('keydown', onEscSuccess);
    document.addEventListener('click', onOutsideClickSuccess);
  }
};

const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error');
  if (errorTemplate) {
    const errorElement = errorTemplate.content.cloneNode(true).children[0];
    errorElement.style.zIndex = '3';
    document.body.appendChild(errorElement);


    const closeError = () => {
      errorElement.remove();
      document.removeEventListener('keydown', onEscError);
      document.removeEventListener('click', onOutsideClickError);
    };

    const onEscError = (e) => {
      if (e.key === 'Escape') closeError();
    };

    const onOutsideClickError = (e) => {
      if (e.target === errorElement) closeError();
    };

    errorElement.querySelector('.error__button').addEventListener('click', closeError);
    document.addEventListener('keydown', onEscError);
    document.addEventListener('click', onOutsideClickError);
  }
};

// Управление кнопкой
const toggleSubmitButton = (isDisabled) => {
  submitButton.disabled = isDisabled;
  submitButton.textContent = isDisabled ? 'Отправка...' : 'Опубликовать';
};

// Открытие формы
const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  initValidation();

  if (typeof initEditor === 'function') {
    initEditor();
  }
};

// Закрытие и сброс формы
export const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  form.reset();
  if (pristine) {
    pristine.reset();
  }

  if (previewImg.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImg.src);
  }
  previewImg.src = 'img/upload-default-image.jpg';

  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });

  uploadFileInput.value = '';

  resetEditor();
};

// Выбор файла
const onFileInputChange = () => {
  const file = uploadFileInput.files[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    uploadFileInput.value = '';
    return;
  }

  const imageUrl = URL.createObjectURL(file);
  previewImg.src = imageUrl;

  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageUrl})`;
  });

  openForm();
};

// Закрытие по кнопке "Отмена"
uploadCancel.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// Закрытие по Esc
document.addEventListener('keydown', (evt) => {
  if (
    evt.key === 'Escape' &&
    !uploadOverlay.classList.contains('hidden') &&
    !document.querySelector('.success') &&
    !document.querySelector('.error')
  ) {
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
});

// Обработчик отправки формы
const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) return;

  toggleSubmitButton(true);

  try {
    const formData = new FormData(evt.target);

    const scaleDisplay = document.querySelector('.scale__control--value');
    if (scaleDisplay) {
      formData.set('scale', scaleDisplay.value);
    }

    const checkedEffect = document.querySelector('input[name="effect"]:checked');
    if (checkedEffect) {
      formData.set('effect', checkedEffect.value);
    }

    await uploadPhoto(formData);

    showSuccessMessage();
    closeForm();
  } catch (err) {
    showErrorMessage();
  } finally {
    toggleSubmitButton(false);
  }
};

// Инициализация формы
const initForm = () => {
  if (!form || !uploadFileInput || !uploadOverlay) {
    return;
  }

  // Обработчики событий
  uploadFileInput.addEventListener('change', onFileInputChange);
  form.addEventListener('submit', onFormSubmit);

  // Блокировка Esc в полях ввода
  const stopPropagation = (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  };

  hashtagsInput.addEventListener('keydown', stopPropagation);
  descriptionInput.addEventListener('keydown', stopPropagation);
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initForm);


export const getFormState = () => ({
  isButtonDisabled: submitButton.disabled,
  isValid: pristine ? pristine.validate() : false,
  values: {
    scale: document.querySelector('.scale__control--value')?.value,
    effect: document.querySelector('input[name="effect"]:checked')?.value,
    hashtags: hashtagsInput.value,
    description: descriptionInput.value
  }
});
