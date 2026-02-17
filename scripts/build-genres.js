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

// изображения по стилям
const imageMap = [
  {match:/black metal|death metal|thrash metal|metalcore|doom metal|sludge metal|heavy metal|metal/i, url:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=60"},
  {match:/house|techno|trance|electro|garage|big room|dubstep|dnb|drum and bass|breakbeat|riddim|future bass|grime/i, url:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=60"},
  {match:/jazz|blues|swing|bebop|soul|funk/i, url:"https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60"},
  {match:/classical|orchestral|cinematic|soundtrack/i, url:"https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=60"},
  {match:/reggae|dancehall|reggaeton|salsa|bachata|cumbia|samba|bossa|afro|amapiano|gqom/i, url:"https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=800&q=60"},
  {match:/ambient|drone|downtempo|trip hop|lo-fi|chillhop|vaporwave|synthwave|chiptune/i, url:"https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=60"},
  {match:/rock|punk|grunge|shoegaze|indie|alternative|post-punk|new wave/i, url:"https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=60"},
  {match:/pop|k-pop|j-pop|hyperpop|synthpop/i, url:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=60"}
];

const tierTop = new Set(["House","Techno","Trance","Drum and Bass","Dubstep","Trap","Pop","R&B","Rock","Metal","Afrobeats","Amapiano","Reggaeton","K-Pop","Jazz"]);
const tierGrowth = new Set(["Phonk","Hyperpop","Gqom","Slap House","Melodic Techno","Hard Techno"]);

const eraClassic = new Set(["Jazz","Bebop","Cool Jazz","Swing","Blues","Rock","Hard Rock","Folk","Country","Classical","Orchestral","Disco"]);
const eraEmerging = new Set(["Phonk","Hyperpop","Gqom","Amapiano","Slap House"]);

function pickImage(name){
  const hit = imageMap.find(x => x.match.test(name.toLowerCase()));
  return hit ? hit.url : "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=60";
}

function bpmInfo(name){
  const n = name.toLowerCase();
  if(/drum and bass|dnb|jungle|neurofunk|jump up/.test(n)) return {bpm:"160–180", bpmType:"b160"};
  if(/hard techno|psytrance|goa|metal|thrash|death|black|doom|sludge/.test(n)) return {bpm:"150–200", bpmType:"b160"};
  if(/dubstep|riddim|tearout/.test(n)) return {bpm:"140–150", bpmType:"b140"};
  if(/house|techno|trance|electro|garage|disco/.test(n)) return {bpm:"120–130", bpmType:"b120"};
  if(/trap|phonk|lo-fi|chillhop|r&b|soul|funk|reggae|dancehall/.test(n)) return {bpm:"70–100", bpmType:"b80"};
  if(/ambient|drone|downtempo|trip hop|classical|orchestral|cinematic|soundtrack|folk|country/.test(n)) return {bpm:"60–90", bpmType:"b50"};
  return {bpm:"100–120", bpmType:"b100"};
}

function pickTier(name){
  if(tierTop.has(name)) return "top";
  if(tierGrowth.has(name)) return "growth";
  return "all";
}

function pickEra(name){
  if(eraClassic.has(name)) return "classic";
  if(eraEmerging.has(name)) return "emerging";
  return "modern";
}

function pickRegion(name){
  const n = name.toLowerCase();
  if(/k-pop|j-pop/.test(n)) return "asia";
  if(/amapiano|gqom|afro/.test(n)) return "africa";
  if(/uk garage|grime|jungle/.test(n)) return "eu";
  return "global";
}

function pickStructure(name){
  const n = name.toLowerCase();
  if(/ambient|drone|cinematic|soundtrack|classical|orchestral/.test(n)) return "Intro → Atmosphere → Theme → Development → Outro";
  if(/metal|rock|punk|grunge/.test(n)) return "Intro → Verse → Chorus → Verse → Chorus → Bridge → Solo → Chorus → Outro";
  if(/house|techno|trance|dubstep|dnb|drum and bass|electro|garage/.test(n)) return "Intro → Build → Drop → Breakdown → Drop → Outro";
  return "Intro → Verse → Chorus → Verse → Chorus → Outro";
}

function prompts(name,bpm){
  return [
    `Create a ${name} track at ${bpm} BPM with clean modern mix and strong groove.`,
    `Generate ${name} with a cinematic intro and a memorable main theme.`,
    `Make a ${name} piece focused on atmosphere, space and texture.`,
    `Compose ${name} with tight drums, punchy bass and crisp top end.`,
    `Produce ${name} suitable for streaming playlists, with clear hook.`,
    `Create ${name} with evolving layers and a smooth energy curve.`,
    `Write ${name} using modern sound design and clean stereo image.`,
    `Make ${name} with a strong build and a satisfying drop.`,
    `Generate ${name} with warm chords and emotional melodic line.`,
    `Compose ${name} with rhythmic accents and tight arrangement.`,
    `Produce ${name} with intro → main section → variation → outro.`,
    `Create ${name} that sounds authentic, genre‑accurate and polished.`
  ];
}

const result = genres.map(name=>{
  const {bpm,bpmType} = bpmInfo(name);
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    bpm,
    bpmType,
    tier: pickTier(name),
    era: pickEra(name),
    region: pickRegion(name),
    image: pickImage(name),
    description: `${name} — жанр, ориентированный на настроение, ритмику и характерное звучание. Подходит для создания аутентичных треков под SUNO AI.`,
    history: `${name} сформировался как стиль, объединяющий культурные влияния и современные продакшн‑подходы. Сегодня активно развивается в цифровых платформах.`,
    structure: pickStructure(name),
    prompts: prompts(name,bpm),
    subgenres: []
  };
});

fs.writeFileSync('data/genres.json', JSON.stringify(result, null, 2));
console.log("✅ Создано 100 жанров в data/genres.json");
