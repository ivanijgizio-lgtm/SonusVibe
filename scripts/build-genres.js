const fs = require('fs');

const base = fs.readFileSync('sources/seed.txt', 'utf8')
  .split('\n')
  .map(x => x.trim())
  .filter(Boolean);

const modifiers = [
  "Deep", "Hard", "Progressive", "Melodic", "Dub", "Ambient",
  "Acid", "Future", "Classic", "Neo", "Organic", "Electro",
  "Hyper", "Lo-Fi", "Minimal", "Dark", "Uplifting", "Experimental",
  "Retro", "Modern", "Tech", "Vocal", "Instrumental"
];

let list = [];

// 1) базовые жанры
base.forEach(name => list.push(name));

// 2) добавляем комбинации (мод. + жанр)
modifiers.forEach(mod => {
  base.forEach(name => {
    list.push(`${mod} ${name}`);
  });
});

// 3) уникальные
const unique = [...new Set(list)];

// 4) ограничим до 3000 (можно поменять)
const finalList = unique.slice(0, 3000);

const genres = finalList.map(name => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  bpm: "unknown",
  tier: "all",
  bpmRange: "all",
  subgenres: [],
  description: "Описание добавим позже",
  image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=60"
}));

fs.writeFileSync('data/genres.json', JSON.stringify(genres, null, 2));
console.log("✅ Готово! Создан data/genres.json");
