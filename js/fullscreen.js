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

const COMMENTS_PER_PORTION = 5;
let currentPhoto = null;
let shownComments = 0;

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

const renderComments = () => {
  const comments = currentPhoto.comments;
  const nextComments = comments.slice(shownComments, shownComments + COMMENTS_PER_PORTION);

  nextComments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialComments.appendChild(commentElement);
  });

  shownComments += nextComments.length;

  // Обновляем счётчик показанных комментариев
  commentCountElement.textContent = `${shownComments} из ${comments.length} комментариев`;

  // Прячем кнопку, если все комментарии показаны
  if (shownComments >= comments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const loadMoreComments = () => {
  renderComments();
};

const renderFullscreen = (photoId) => {
  currentPhoto = photos.find((item) => item.id === photoId);

  if (!currentPhoto) {
    return;
  }

  // Сбрасываем счётчик показанных комментариев
  shownComments = 0;
  socialComments.innerHTML = '';

  // Заполняем основные данные
  bigPictureImg.src = currentPhoto.url;
  bigPictureImg.alt = currentPhoto.description;
  likesCount.textContent = currentPhoto.likes;
  commentsCount.textContent = currentPhoto.comments.length;
  socialCaption.textContent = currentPhoto.description;

  // Показываем счётчик комментариев и кнопку загрузки
  commentCountElement.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderComments();

  // Показываем окно
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeFullscreen = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentPhoto = null;
  shownComments = 0;
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

// Загрузка дополнительных комментариев
commentsLoader.addEventListener('click', () => {
  loadMoreComments();
});

export { renderFullscreen };
