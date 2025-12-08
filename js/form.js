const form = document.querySelector('#upload-select-image');
const uploadFileInput = form.querySelector('#upload-file');
const uploadOverlay = form.querySelector('.img-upload__overlay');
const uploadCancel = form.querySelector('#upload-cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const previewImg = form.querySelector('.img-upload__preview img');

// 1. Правила валидации хэш-тегов
const validateHashtagCount = (value) => {
  const hashtags = value.trim().split(' ').filter((tag) => tag !== '');
  return hashtags.length <= 5;
};

const validateHashtagFormat = (value) => {
  const hashtags = value.trim().split(' ').filter((tag) => tag !== '');

  if (hashtags.length === 0) {
    return true;
  }

  const hashtagRegex = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
  return hashtags.every((tag) => hashtagRegex.test(tag));
};

const validateHashtagUniqueness = (value) => {
  const hashtags = value.toLowerCase().split(' ').filter((tag) => tag !== '');
  const uniqueHashtags = new Set(hashtags);
  return uniqueHashtags.size === hashtags.length;
};

// 2. Правила валидации комментария
const validateDescription = (value) => value.length <= 140;

// 3. Создаём Pristine с кастомными классами
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

// 4. Добавляем валидаторы с разными сообщениями
pristine.addValidator(
  hashtagsInput,
  validateHashtagCount,
  'Нельзя указать больше пяти хэш-тегов',
  3,
  true
);

pristine.addValidator(
  hashtagsInput,
  validateHashtagFormat,
  'Хэш-тег должен начинаться с # и содержать только буквы и цифры (максимум 20 символов)',
  2,
  true
);

pristine.addValidator(
  hashtagsInput,
  validateHashtagUniqueness,
  'Один и тот же хэш-тег не может быть использован дважды',
  1,
  true
);

pristine.addValidator(
  descriptionInput,
  validateDescription,
  'Комментарий не должен превышать 140 символов',
  1,
  true
);

// Функция показа сообщения об ошибке
const showErrorMessage = (message) => {
  const errorMessage = document.createElement('div');
  errorMessage.textContent = message;
  errorMessage.classList.add('error-message');
  errorMessage.style.color = '#ff4e4e';
  errorMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  errorMessage.style.padding = '10px 20px';
  errorMessage.style.borderRadius = '5px';
  errorMessage.style.marginBottom = '10px';
  errorMessage.style.textAlign = 'center';
  errorMessage.style.fontWeight = 'bold';

  const wrapper = document.querySelector('.img-upload__wrapper');
  if (wrapper) {
    wrapper.insertBefore(errorMessage, wrapper.firstChild);

    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage);
      }
    }, 3000);
  }
};

// 5. Открытие формы
const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  pristine.reset();
};

// 6. Обработка выбора файла
const onFileInputChange = () => {
  const file = uploadFileInput.files[0];

  if (file) {
    // Проверяем, что это изображение
    if (!file.type.startsWith('image/')) {
      showErrorMessage('Пожалуйста, выберите файл изображения');
      uploadFileInput.value = '';
      return;
    }

    openForm();
  }
};

uploadFileInput.addEventListener('change', onFileInputChange);

// 7. Закрытие формы с сбросом
const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  form.reset();

  pristine.reset();

  previewImg.src = 'img/upload-default-image.jpg';
};

uploadCancel.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

// 8. Закрытие по Esc
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    // Не закрываем если фокус в полях ввода
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
};

document.addEventListener('keydown', onDocumentKeydown);

// 9. Обработка отправки формы
form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    // Форма валидна - можно отправлять
  }
});

// 10. Блокировка Esc в полях ввода
const stopEscPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

hashtagsInput.addEventListener('keydown', stopEscPropagation);
descriptionInput.addEventListener('keydown', stopEscPropagation);

// 11. Инициализация при загрузке DOM
const initForm = () => {
  if (!form || !uploadFileInput || !uploadOverlay || !uploadCancel) {
    return;
  }
};

// Запускаем инициализацию
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}

export { closeForm };
