export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateUniqueId = () => {
  const usedIds = new Set();
  return () => {
    let id;
    do {
      id = getRandomInteger(1, 1000);
    } while (usedIds.has(id));
    usedIds.add(id);
    return id;
  };
};

export const debounce = (callback, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
};

export const isEscEvent = (evt) => evt.key === 'Escape';
