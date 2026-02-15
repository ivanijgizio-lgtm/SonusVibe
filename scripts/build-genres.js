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

base.forEach(name => list.push(name));
modifiers.forEach(mod => {
  base.forEach(name => list.push(`${mod} ${name}`));
});

const unique = [...new Set(list)];
const finalList = unique.slice(0, 3000);

const images = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=60"
];

// безопасные бесплатные демо‑аудио
const audios = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
];

// бесплатное демо‑видео
const videos = [
  "https://www.w3schools.com/html/mov_bbb.mp4"
];

const genres = finalList.map((name, i) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  bpm: "unknown",
  tier: "all",
  bpmRange: "all",
  subgenres: [],
  description: `${name} — жанр, сочетающий атмосферу, ритм и эмоциональную подачу. Используется в клубах, видео и стриминге.`,
  image: images[i % images.length],
  audio: audios[i % audios.length],
  video: videos[i % videos.length]
}));

fs.writeFileSync('data/genres.json', JSON.stringify(genres, null, 2));
console.log("✅ Готово! Создан data/genres.json");
