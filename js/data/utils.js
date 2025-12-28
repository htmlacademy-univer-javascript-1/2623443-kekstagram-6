export function getRandomElement (array){
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInteger (min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
