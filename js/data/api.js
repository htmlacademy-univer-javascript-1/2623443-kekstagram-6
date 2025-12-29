const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/';

export const loadPhotos = () =>
  fetch(`${BASE_URL}data`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Не удалось загрузить фотографии');
      }
      return res.json();
    });

export const uploadPhoto = (formData) =>
  fetch(BASE_URL, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось отправить форму. Попробуйте ещё раз');
    }
    return response.json();
  });
