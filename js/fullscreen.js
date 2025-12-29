let bigPictureElement = null;
let bigPictureImage = null;
let likesCountElement = null;
let commentsCountElement = null;
let socialCommentsElement = null;
let socialCaptionElement = null;
let commentCountBlock = null;
let commentsLoader = null;
let closeButton = null;

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
  const commentsToRender = currentComments.slice(
    renderedCommentsCount,
    renderedCommentsCount + COMMENTS_PER_PORTION
  );

  commentsToRender.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialCommentsElement.appendChild(commentElement);
  });

  renderedCommentsCount += commentsToRender.length;

  commentCountBlock.innerHTML = `
    <span class="social__comment-shown-count">${renderedCommentsCount}</span>
    из
    <span class="social__comment-total-count">${currentComments.length}</span>
    комментариев
  `;

  if (renderedCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

const closeFullPicture = () => {
  if (!bigPictureElement || bigPictureElement.classList.contains('hidden')) {
    return;
  }

  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  if (commentsLoader) {
    commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  }
};

const initDomElements = () => {
  if (bigPictureElement) {
    return;
  }

  bigPictureElement = document.querySelector('.big-picture');

  if (!bigPictureElement) {
    return;
  }

  bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
  likesCountElement = bigPictureElement.querySelector('.likes-count');
  commentsCountElement = bigPictureElement.querySelector('.comments-count');
  socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  socialCaptionElement = bigPictureElement.querySelector('.social__caption');
  commentCountBlock = bigPictureElement.querySelector('.social__comment-count');
  commentsLoader = bigPictureElement.querySelector('.comments-loader');
  closeButton = bigPictureElement.querySelector('.big-picture__cancel');

  if (!closeButton || !bigPictureImage || !likesCountElement ||
      !commentsCountElement || !socialCommentsElement ||
      !socialCaptionElement || !commentCountBlock || !commentsLoader) {
    return;
  }

  closeButton.addEventListener('click', closeFullPicture);

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && !bigPictureElement.classList.contains('hidden')) {
      closeFullPicture();
    }
  });
};

const renderComments = (comments) => {
  socialCommentsElement.innerHTML = '';
  currentComments = comments;
  renderedCommentsCount = 0;
  renderCommentsPortion();

  if (currentComments.length <= COMMENTS_PER_PORTION) {
    commentsLoader.classList.add('hidden');
  }
};

const renderFullscreen = (photoId, photosArray) => {
  initDomElements();

  if (!photosArray || photosArray.length === 0) {
    return;
  }

  const pictureData = photosArray.find((item) => item.id === photoId);

  if (!pictureData) {
    return;
  }

  // Заполняем данные
  bigPictureImage.src = pictureData.url;
  bigPictureImage.alt = pictureData.description;
  likesCountElement.textContent = pictureData.likes;
  commentsCountElement.textContent = pictureData.comments.length;
  socialCaptionElement.textContent = pictureData.description;

  renderComments(pictureData.comments);

  // Показываем элементы
  commentCountBlock.classList.remove('hidden');
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

export { renderFullscreen };
