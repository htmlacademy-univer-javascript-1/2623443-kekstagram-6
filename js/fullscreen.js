import { photos } from './main.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(avatar);
  commentElement.appendChild(text);

  return commentElement;
};

const renderFullscreen = (photoId) => {
  const photo = photos.find((item) => item.id === photoId);

  if (!photo) {
    return;
  }

  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  // Очищаем старые комментарии
  socialComments.innerHTML = '';

  // Добавляем новые комментарии
  photo.comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialComments.appendChild(commentElement);
  });

  // Скрываем счётчик комментариев и кнопку загрузки
  commentCountElement.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // Показываем окно
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeFullscreen = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Закрытие по клику на крестик
closeButton.addEventListener('click', () => {
  closeFullscreen();
});

// Закрытие по Esc
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    closeFullscreen();
  }
});

export { renderFullscreen };
