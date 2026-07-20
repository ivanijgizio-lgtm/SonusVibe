const CACHE_KEY = 'sonusvibe_genres';
const CACHE_TTL = 3600000; // 1 час

export default {
  async loadGenres() {
    // Проверяем кэш
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    // Загружаем свежие данные
    const response = await fetch('/data/genres.json');
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();

    // Сохраняем в кэш
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  }
};
