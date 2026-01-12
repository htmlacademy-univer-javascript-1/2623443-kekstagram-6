import { uploadPhoto } from './data/api.js';
import { initEditor, resetEditor } from './editor.js';
import { isEscEvent } from './data/utils.js';

// Элементы DOM (инициализируются в initForm)
let form = null;
let uploadFileInput = null;
let uploadOverlay = null;
let uploadCancel = null;
let hashtagsInput = null;
let descriptionInput = null;
let previewImg = null;
let submitButton = null;

// Константы
const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

let pristine = null;

// Валидация хэштегов
const validateHashtagCount = (value) => {
  const hashtags = value.trim().split(' ').filter((tag) => tag !== '');
  return hashtags.length <= MAX_HASHTAG_COUNT;
};

const validateHashtagFormat = (value) => {
  const hashtags = value.trim().split(' ').filter((tag) => tag !== '');
  if (hashtags.length === 0) {
    return true;
  }
  return hashtags.every((tag) => HASHTAG_REGEX.test(tag));
};

const validateHashtagUniqueness = (value) => {
  const hashtags = value.toLowerCase().split(' ').filter((tag) => tag !== '');
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

// Показ сообщений
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    return;
  }

  const successElement = successTemplate.content.cloneNode(true).children[0];
  successElement.style.zIndex = '3';
  document.body.appendChild(successElement);

  // Используем function declaration
  function onEscSuccess(e) {
    if (isEscEvent(e)) {
      closeSuccess();
    }
  }

  function onOutsideClickSuccess(e) {
    if (e.target === successElement) {
      closeSuccess();
    }
  }

  function closeSuccess() {
    successElement.remove();
    document.removeEventListener('keydown', onEscSuccess);
    document.removeEventListener('click', onOutsideClickSuccess);
  }

  const successButton = successElement.querySelector('.success__button');
  if (successButton) {
    successButton.addEventListener('click', closeSuccess);
  }

  document.addEventListener('keydown', onEscSuccess);
  document.addEventListener('click', onOutsideClickSuccess);
};

const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    return;
  }

  const errorElement = errorTemplate.content.cloneNode(true).children[0];
  errorElement.style.zIndex = '3';
  document.body.appendChild(errorElement);

  // Используем function declaration
  function onEscError(e) {
    if (isEscEvent(e)) {
      closeError();
    }
  }

  function onOutsideClickError(e) {
    if (e.target === errorElement) {
      closeError();
    }
  }

  function closeError() {
    errorElement.remove();
    document.removeEventListener('keydown', onEscError);
    document.removeEventListener('click', onOutsideClickError);
  }

  const errorButton = errorElement.querySelector('.error__button');
  if (errorButton) {
    errorButton.addEventListener('click', closeError);
  }

  document.addEventListener('keydown', onEscError);
  document.addEventListener('click', onOutsideClickError);
};

// Управление кнопкой отправки
const toggleSubmitButton = (isDisabled) => {
  if (submitButton) {
    submitButton.disabled = isDisabled;
    submitButton.textContent = isDisabled ? 'Отправка...' : 'Опубликовать';
  }
};

// Закрытие формы
export const closeForm = () => {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  if (form) {
    form.reset();
  }

  if (pristine) {
    pristine.reset();
  }

  if (previewImg && previewImg.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImg.src);
  }

  if (previewImg) {
    previewImg.src = 'img/upload-default-image.jpg';
  }

  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });

  if (uploadFileInput) {
    uploadFileInput.value = '';
  }

  resetEditor();
};

// Выбор файла
const onFileInputChange = () => {
  if (!uploadFileInput || !uploadFileInput.files || uploadFileInput.files.length === 0) {
    return;
  }

  const file = uploadFileInput.files[0];

  if (!file.type.startsWith('image/')) {
    if (uploadFileInput) {
      uploadFileInput.value = '';
    }
    return;
  }

  const imageUrl = URL.createObjectURL(file);
  if (previewImg) {
    previewImg.src = imageUrl;
  }

  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageUrl})`;
  });

  if (uploadOverlay) {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  // Инициализация валидации при первом открытии
  if (!pristine && form) {
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
  }

  initEditor();
};

// Отправка формы
const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!pristine || !form) {
    return;
  }

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  toggleSubmitButton(true);

  try {
    const formData = new FormData(form);

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

// Блокировка Esc в полях ввода
const stopPropagation = (evt) => {
  if (isEscEvent(evt)) {
    evt.stopPropagation();
  }
};

// Инициализация формы
export const initForm = () => {
  form = document.querySelector('#upload-select-image');
  if (!form) {
    return;
  }

  uploadFileInput = form.querySelector('#upload-file');
  uploadOverlay = form.querySelector('.img-upload__overlay');
  uploadCancel = form.querySelector('#upload-cancel');
  hashtagsInput = form.querySelector('.text__hashtags');
  descriptionInput = form.querySelector('.text__description');
  previewImg = document.querySelector('.img-upload__preview img');
  submitButton = form.querySelector('.img-upload__submit');

  if (
    !uploadFileInput ||
    !uploadOverlay ||
    !uploadCancel ||
    !hashtagsInput ||
    !descriptionInput ||
    !previewImg ||
    !submitButton
  ) {
    return;
  }

  uploadFileInput.addEventListener('change', onFileInputChange);
  uploadCancel.addEventListener('click', (evt) => {
    evt.preventDefault();
    closeForm();
  });
  form.addEventListener('submit', onFormSubmit);

  hashtagsInput.addEventListener('keydown', stopPropagation);
  descriptionInput.addEventListener('keydown', stopPropagation);

  // Закрытие по Esc
  document.addEventListener('keydown', (evt) => {
    if (
      isEscEvent(evt) &&
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
};

// Состояние формы
export const getFormState = () => {
  const scaleElement = document.querySelector('.scale__control--value');
  const effectElement = document.querySelector('input[name="effect"]:checked');

  return {
    isButtonDisabled: submitButton ? submitButton.disabled : false,
    isValid: pristine ? pristine.validate() : false,
    values: {
      scale: scaleElement ? scaleElement.value : '',
      effect: effectElement ? effectElement.value : '',
      hashtags: hashtagsInput ? hashtagsInput.value : '',
      description: descriptionInput ? descriptionInput.value : ''
    }
  };
};
