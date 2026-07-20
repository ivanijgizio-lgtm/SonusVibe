import dataService from '../services/dataService.js';
import Filters from './Filters.js';
import Search from './Search.js';
import GenreCard from './GenreCard.js';
import Modal from './Modal.js';

export default class App {
  constructor() {
    this.genres = [];
    this.filtered = [];
    this.filters = { trend: 'all', bpm: 'all', mood: 'all', decade: 'all' };
  }

  async init() {
    try {
      this.genres = await dataService.loadGenres();
      this.filtered = [...this.genres];
      this.render();
      this.bindEvents();
    } catch (err) {
      console.error('Ошибка загрузки данных', err);
      // показать сообщение пользователю
    }
  }

  render() {
    // Рендерим фильтры, поиск, список карточек
    // Здесь можно использовать компоненты, которые сами добавляют себя в DOM
    const container = document.getElementById('genresContainer');
    container.innerHTML = '';
    this.filtered.forEach(genre => {
      const card = new GenreCard(genre);
      card.render(container);
    });
  }

  bindEvents() {
    // Подписка на события от фильтров, поиска и т.д.
    // Используем кастомные события или колбэки
  }
}
