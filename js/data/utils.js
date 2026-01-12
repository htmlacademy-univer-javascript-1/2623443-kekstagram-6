<<<<<<< HEAD
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateUniqueId = () => {
  const usedIds = new Set();
=======
export function getRandomElement (array){
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInteger (min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateUniqueId = () => {
  const usedIds = new Set();

>>>>>>> ca8a5bd125e5cef00b4343d2d280576cba4403d5
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
<<<<<<< HEAD
=======

>>>>>>> ca8a5bd125e5cef00b4343d2d280576cba4403d5
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
};
<<<<<<< HEAD

export const isEscEvent = (evt) => evt.key === 'Escape';
=======
>>>>>>> ca8a5bd125e5cef00b4343d2d280576cba4403d5
