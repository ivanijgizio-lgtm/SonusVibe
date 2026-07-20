export default class Modal {
  constructor() {
    this.modal = document.getElementById('genreModal');
    this.closeBtn = document.getElementById('modalClose');
    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
    document.addEventListener('openModal', (e) => this.open(e.detail));
  }

  open(genre) {
    document.getElementById('modalImage').src = genre.image || '';
    document.getElementById('modalTitle').textContent = genre.name || '';
    document.getElementById('modalDescription').textContent = genre.description || 'Описание отсутствует.';
    document.getElementById('modalHistory').textContent = genre.history || 'История отсутствует.';
    document.getElementById('modalStructure').textContent = genre.structure || 'Структура не указана.';
    this.modal.classList.remove('hidden');
    this.modal.classList.add('show');
  }

  close() {
    this.modal.classList.remove('show');
    setTimeout(() => this.modal.classList.add('hidden'), 150);
  }
}
