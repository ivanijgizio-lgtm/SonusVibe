import { getBpmType } from './bpm.js';

export function applyFilters(genres, activeFilters, searchTerm = '') {
  let result = [...genres];

  // Поиск
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(g =>
      g.name.toLowerCase().includes(term) ||
      (g.description && g.description.toLowerCase().includes(term))
    );
  }

  // Фильтры
  if (activeFilters.trend !== 'all') {
    result = result.filter(g => g.tier === activeFilters.trend);
  }
  if (activeFilters.bpm !== 'all') {
    result = result.filter(g => getBpmType(g.bpm) === activeFilters.bpm);
  }
  if (activeFilters.mood !== 'all') {
    result = result.filter(g => g.mood === activeFilters.mood);
  }
  if (activeFilters.decade !== 'all') {
    result = result.filter(g => g.decade === activeFilters.decade);
  }

  return result;
}
