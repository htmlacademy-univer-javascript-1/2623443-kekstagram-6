// == Импорты ==
import { uploadPhoto } from './data/api.js';
import { resetEditor } from './editor.js';

// == Элементы DOM ==
const form = document.querySelector('#upload-select-image');
const uploadFileInput = form.querySelector('#upload-file');
const uploadOverlay = form.querySelector('.img-upload__overlay');
const uploadCancel = form.querySelector('#upload-cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const previewImg = form.querySelector('.img-upload__preview img');

// == Валидация хэштегов ==
const validateHashtagCount = (value) => {
  const hashtags = value.trim().split(' ').filter(tag => tag !== '');
  return hashtags.length <= 5;
};

const validateHashtagFormat = (value) => {
  const hashtags = value.trim().split(' ').filter(tag => tag !== '');
  if (hashtags.length === 0) return true;
  const hashtagRegex = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  return hashtags.every(tag => hashtagRegex.test(tag));
};

const validateHashtagUniqueness = (value) => {
  const hashtags = value.toLowerCase().split(' ').filter(tag => tag !== '');
  const uniqueHashtags = new Set(hashtags);
  return uniqueHashtags.size === hashtags.length;
};

// == Валидация комментария ==
const validateDescription = (value) => value.length <= 140;

// == Инициализация Pristine ==
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

pristine.addValidator(hashtagsInput, validateHashtagCount, 'Нельзя указать больше пяти хэш-тегов', 3, true);
pristine.addValidator(hashtagsInput, validateHashtagFormat, 'Хэш-тег должен начинаться с # и содержать только буквы и цифры (максимум 20 символов)', 2, true);
pristine.addValidator(hashtagsInput, validateHashtagUniqueness, 'Один и тот же хэш-тег не может быть использован дважды', 1, true);
pristine.addValidator(descriptionInput, validateDescription, 'Комментарий не должен превышать 140 символов', 1, true);

// == Открытие формы ==
const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  pristine.reset();
};

// == Закрытие и сброс формы ==
export const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  form.reset();
  pristine.reset();

  // Возвращаем изображение-затычку
  previewImg.src = 'img/upload-default-image.jpg';

  // Очищаем input файла (обязательно!)
  uploadFileInput.value = '';

  // Сбрасываем редактор (масштаб, эффекты)
  resetEditor();
};

// == Выбор файла ==
const onFileInputChange = () => {
  const file = uploadFileInput.files[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    // Показ ошибки можно реализовать, но по ТЗ не обязательно — просто сбросим
    uploadFileInput.value = '';
    return;
  }

  // Подставляем выбранное изображение в превью
  previewImg.src = URL.createObjectURL(file);
  openForm();
};

uploadFileInput.addEventListener('change', onFileInputChange);

// == Закрытие по кнопке "Отмена" ==
uploadCancel.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// == Закрытие по Esc ==
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
};

document.addEventListener('keydown', onDocumentKeydown);

// == Отправка формы ==
form.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  const submitButton = form.querySelector('.img-upload__submit');
  submitButton.disabled = true;

  const formData = new FormData(form);

  try {
    await uploadPhoto(formData);
    closeForm();

    // === Показ модального окна УСПЕХА ===
    const successTemplate = document.querySelector('#success').content;
    const successElement = successTemplate.cloneNode(true).children[0];
    document.body.appendChild(successElement);

    const closeSuccess = () => {
      successElement.remove();
      document.removeEventListener('keydown', onEscSuccess);
      document.removeEventListener('click', onOutsideClickSuccess);
    };

    const onEscSuccess = (e) => { if (e.key === 'Escape') closeSuccess(); };
    const onOutsideClickSuccess = (e) => { if (e.target === successElement) closeSuccess(); };

    successElement.querySelector('.success__button').addEventListener('click', closeSuccess);
    document.addEventListener('keydown', onEscSuccess);
    document.addEventListener('click', onOutsideClickSuccess);
  } catch {
    // === Показ модального окна ОШИБКИ ===
    const errorTemplate = document.querySelector('#error').content;
    const errorElement = errorTemplate.cloneNode(true).children[0];
    document.body.appendChild(errorElement);

    const closeError = () => {
      errorElement.remove();
      document.removeEventListener('keydown', onEscError);
      document.removeEventListener('click', onOutsideClickError);
    };

    const onEscError = (e) => { if (e.key === 'Escape') closeError(); };
    const onOutsideClickError = (e) => { if (e.target === errorElement) closeError(); };

    errorElement.querySelector('.error__button').addEventListener('click', closeError);
    document.addEventListener('keydown', onEscError);
    document.addEventListener('click', onOutsideClickError);
  } finally {
    submitButton.disabled = false;
  }
});

// == Блокировка Esc в полях ввода ==
const stopEscPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

hashtagsInput.addEventListener('keydown', stopEscPropagation);
descriptionInput.addEventListener('keydown', stopEscPropagation);
