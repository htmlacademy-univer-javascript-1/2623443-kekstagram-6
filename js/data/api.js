const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

// Функция для получения данных с сервера
const loadPhotos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/data`);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось загрузить данные с сервера: ${error.message}`);
  }
};

// Функция для отправки данных на сервер
const uploadPhoto = async (formData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка отправки данных: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось отправить данные на сервер: ${error.message}`);
  }
};

export { loadPhotos, uploadPhoto };
