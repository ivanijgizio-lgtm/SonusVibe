const fs = require('fs');

const genres = [
  "House","Deep House","Tech House","Progressive House","Future House","Tropical House","Slap House","Electro House","Big Room","Acid House",
  "Techno","Minimal Techno","Melodic Techno","Hard Techno","Industrial Techno",
  "Trance","Progressive Trance","Uplifting Trance","Psytrance","Goa Trance",
  "Drum and Bass","Liquid DnB","Neurofunk","Jump Up","Jungle","Breakbeat","UK Garage","Grime",
  "Dubstep","Riddim","Tearout","Future Bass","Trap","Phonk","Lo-Fi","Chillhop",
  "Ambient","Dark Ambient","Drone","Downtempo","Trip Hop","IDM","Glitch",
  "Synthwave","Vaporwave","Chiptune","Electro",
  "Garage House","Amapiano","Gqom","Afro House","Afrobeats","Dancehall","Reggae","Reggaeton","Salsa","Bachata","Cumbia","Bossa Nova","Samba",
  "Jazz","Bebop","Cool Jazz","Swing","Blues",
  "Rock","Hard Rock","Punk Rock","Post-Punk","New Wave","Grunge","Shoegaze","Indie Rock","Alternative Rock",
  "Metal","Heavy Metal","Thrash Metal","Death Metal","Black Metal","Doom Metal","Sludge Metal","Metalcore","Nu Metal",
  "Pop","Synthpop","Hyperpop","K-Pop","J-Pop","R&B","Soul","Funk","Disco",
  "Classical","Orchestral","Cinematic","Soundtrack","Folk","Country","Bluegrass","Singer-Songwriter"
];

const wikiTitleMap = {
  "Drum and Bass": "Drum and bass",
  "Liquid DnB": "Liquid funk",
  "R&B": "Rhythm and blues",
  "Lo-Fi": "Lo-fi music",
  "Trip Hop": "Trip hop",
  "IDM": "Intelligent dance music",
  "Electro": "Electro (music)",
  "Big Room": "Big room house",
  "Riddim": "Riddim (genre)",
  "Trap": "Trap music",
  "K-Pop": "K-pop",
  "J-Pop": "J-pop",
  "Synthpop": "Synth-pop",
  "New Wave": "New wave music",
  "Post-Punk": "Post-punk",
  "Indie Rock": "Indie rock",
  "Alternative Rock": "Alternative rock",
  "Hard Rock": "Hard rock",
  "Heavy Metal": "Heavy metal music",
  "Nu Metal": "Nu metal",
  "Bossa Nova": "Bossa nova"
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function slugify(name){
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

async function fetchSummary(title){
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.extract ? data.extract.trim() : null;
}

async function run(){
  const out = {};

  for (const name of genres) {
    const id = slugify(name);
    const title = wikiTitleMap[name] || `${name} (music genre)`;

    let summary = await fetchSummary(title);

    if (!summary) summary = await fetchSummary(name);
    if (!summary) summary = await fetchSummary(`${name} music`);
    if (!summary) summary = `Описание для ${name} не найдено.`;

    out[id] = { name, summary };
    console.log(`✓ ${name}`);

    await sleep(250);
  }

  fs.writeFileSync('data/wiki.json', JSON.stringify(out, null, 2), 'utf-8');
  console.log("✅ wiki.json создан");
}

run();
