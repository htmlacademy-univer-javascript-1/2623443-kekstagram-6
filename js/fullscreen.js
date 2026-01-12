import { isEscEvent } from './data/utils.js';

let domCache = null;

const COMMENTS_PER_PORTION = 5;
let currentComments = [];
let renderedCommentsCount = 0;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(img);
  commentElement.appendChild(text);

  return commentElement;
};

const renderCommentsPortion = () => {
  const dom = domCache;
  if (!dom) {
    return;
  }

  const commentsToRender = currentComments.slice(
    renderedCommentsCount,
    renderedCommentsCount + COMMENTS_PER_PORTION
  );

  commentsToRender.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    dom.socialCommentsElement.appendChild(commentElement);
  });

  renderedCommentsCount += commentsToRender.length;

  dom.commentCountBlock.innerHTML = `
    <span class="social__comment-shown-count">${renderedCommentsCount}</span>
    из
    <span class="social__comment-total-count">${currentComments.length}</span>
    комментариев
  `;

  if (renderedCommentsCount >= currentComments.length) {
    dom.commentsLoader.classList.add('hidden');
  } else {
    dom.commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

const closeFullPicture = () => {
  const dom = domCache;
  if (!dom || dom.bigPictureElement.classList.contains('hidden')) {
    return;
  }

  dom.bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  dom.commentsLoader.removeEventListener('click', onCommentsLoaderClick);
};

const getDom = () => {
  if (domCache) {
    return domCache;
  }

  const bigPictureElement = document.querySelector('.big-picture');
  if (!bigPictureElement) {
    return null;
  }

  const bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
  const likesCountElement = bigPictureElement.querySelector('.likes-count');
  const commentsCountElement = bigPictureElement.querySelector('.comments-count');
  const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
  const commentCountBlock = bigPictureElement.querySelector('.social__comment-count');
  const commentsLoader = bigPictureElement.querySelector('.comments-loader');
  const closeButton = bigPictureElement.querySelector('.big-picture__cancel');

  // Проверка, что все элементы найдены
  if (
    !bigPictureImage ||
    !likesCountElement ||
    !commentsCountElement ||
    !socialCommentsElement ||
    !socialCaptionElement ||
    !commentCountBlock ||
    !commentsLoader ||
    !closeButton
  ) {
    return null;
  }

  domCache = {
    bigPictureElement,
    bigPictureImage,
    likesCountElement,
    commentsCountElement,
    socialCommentsElement,
    socialCaptionElement,
    commentCountBlock,
    commentsLoader,
    closeButton
  };

  // Навешиваем обработчики один раз
  closeButton.addEventListener('click', closeFullPicture);

  document.addEventListener('keydown', (evt) => {
    if (isEscEvent(evt) && !bigPictureElement.classList.contains('hidden')) {
      closeFullPicture();
    }
  });

  return domCache;
};

const renderComments = (comments) => {
  const dom = domCache;
  if (!dom) {
    return;
  }
  dom.socialCommentsElement.innerHTML = '';
  currentComments = comments;
  renderedCommentsCount = 0;
  renderCommentsPortion();

  if (currentComments.length <= COMMENTS_PER_PORTION) {
    dom.commentsLoader.classList.add('hidden');
  } else {
    dom.commentsLoader.classList.remove('hidden');
    dom.commentsLoader.addEventListener('click', onCommentsLoaderClick);
  }
};

export const renderFullscreen = (photoId, photosArray) => {
  const dom = getDom();
  if (!dom || !photosArray || photosArray.length === 0) {
    return;
  }

  const pictureData = photosArray.find((item) => item.id === photoId);
  if (!pictureData) {
    return;
  }

  dom.bigPictureImage.src = pictureData.url;
  dom.bigPictureImage.alt = pictureData.description;
  dom.likesCountElement.textContent = pictureData.likes;
  dom.commentsCountElement.textContent = pictureData.comments.length;
  dom.socialCaptionElement.textContent = pictureData.description;

  renderComments(pictureData.comments);

  dom.commentCountBlock.classList.remove('hidden');
  dom.bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
};
