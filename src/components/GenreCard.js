export default class GenreCard {
  constructor(genre) {
    this.genre = genre;
  }

  render(container) {
    const card = document.createElement('div');
    card.className = 'genre-card';
    card.innerHTML = `
      <div class="card-cover" style="background-image:url('${this.genre.image || ''}')">
        <span class="tag">${this.genre.bpm || 'BPM'}</span>
      </div>
      <div class="genre-title">${this.genre.name}</div>
      <div class="meta">${this.genre.description || ''}</div>
    `;
    card.addEventListener('click', () => this.openModal());
    container.appendChild(card);
  }

  openModal() {
    // вызываем глобальный диспетчер модалок или используем EventBus
    const event = new CustomEvent('openModal', { detail: this.genre });
    document.dispatchEvent(event);
  }
}
