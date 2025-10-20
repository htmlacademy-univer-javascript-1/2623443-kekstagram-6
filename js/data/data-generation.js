import { DESCRIPTIONS, MESSAGES, NAMES } from './constants.js';
import { getRandomElement, getRandomInteger, generateUniqueId } from './utils.js';

const getUniqueCommentId = generateUniqueId();

const generateComment = () => {
  const messageCount = getRandomInteger(1, 2);
  let message = '';

  for (let i = 0; i < messageCount; i++) {
    if (i > 0) {
      message += ' ';
    }
    message += getRandomElement(MESSAGES);
  }

  return {
    id: getUniqueCommentId(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: message,
    name: getRandomElement(NAMES)
  };
};

const generatePhotosArray = () => {
  const photosArray = [];

  for (let i = 1; i <= 25; i++) {
    const commentsCount = getRandomInteger(0, 30);
    const comments = [];

    for (let j = 0; j < commentsCount; j++) {
      comments.push(generateComment());
    }

    photosArray.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: DESCRIPTIONS[i - 1],
      likes: getRandomInteger(15, 200),
      comments: comments
    });
  }

  return photosArray;
};

export { generatePhotosArray };
