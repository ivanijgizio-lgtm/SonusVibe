import json
import re

# ---------- Словари с артистами, структурой и промтами ----------
# (для каждого жанра задаём свои значения, ориентируясь на id)

ARTISTS_MAP = {
    'house': ["Frankie Knuckles", "Larry Heard", "Kerri Chandler"],
    'deep-house': ["Miguel Migs", "Lars Behrenroth", "Osunlade"],
    'tech-house': ["Hot Since 82", "Patrick Topping", "Solardo"],
    'progressive-house': ["Sasha", "John Digweed", "Hernan Cattaneo"],
    'future-house': ["Don Diablo", "Oliver Heldens", "Tchami"],
    'tropical-house': ["Kygo", "Thomas Jack", "Matoma"],
    'slap-house': ["Alok", "Vintage Culture", "Cat Dealers"],
    'electro-house': ["Deadmau5", "Feed Me", "Wolfgang Gartner"],
    'big-room': ["Hardwell", "W&W", "Dimitri Vegas & Like Mike"],
    'acid-house': ["Phuture", "808 State", "A Guy Called Gerald"],
    'techno': ["Jeff Mills", "Richie Hawtin", "Carl Cox"],
    'minimal-techno': ["Ricardo Villalobos", "Magda", "Richie Hawtin"],
    'melodic-techno': ["Tale Of Us", "Adriatique", "Stephan Bodzin"],
    'hard-techno': ["Paula Temple", "Perc", "I Hate Models"],
    'industrial-techno': ["Ancient Methods", "Adam X", "Paula Temple"],
    'trance': ["Armin van Buuren", "Paul van Dyk", "Tiësto"],
    'progressive-trance': ["Above & Beyond", "Gabriel & Dresden", "Oliver Smith"],
    'uplifting-trance': ["Aly & Fila", "Sean Tyas", "John O'Callaghan"],
    'psytrance': ["Infected Mushroom", "Astrix", "Simon Patterson"],
    'goa-trance': ["Hallucinogen", "Juno Reactor", "Man With No Name"],
    'drum-and-bass': ["Goldie", "Roni Size", "Andy C"],
    'liquid-dnb': ["High Contrast", "Calibre", "Lenzman"],
    'neurofunk': ["Noisia", "Spor", "Black Sun Empire"],
    'jump-up': ["Hazard", "Macky Gee", "Sub Zero"],
    'jungle': ["Rebel MC", "Congo Natty", "Shy FX"],
    'breakbeat': ["The Chemical Brothers", "The Prodigy", "Fatboy Slim"],
    'uk-garage': ["MJ Cole", "Wookie", "Disclosure"],
    'grime': ["Wiley", "Skepta", "Stormzy"],
    'dubstep': ["Skream", "Bengala", "Mala"],
    'riddim': ["Virtual Riot", "Chibs", "Boogie T"],
    'tearout': ["Marauda", "Svdden Death", "Ubur"],
    'future-bass': ["Flume", "San Holo", "Illenium"],
    'trap': ["TNGHT", "Baauer", "RL Grime"],
    'phonk': ["DJ Yung Vamp", "Soudiere", "Ryan Celsius"],
    'lo-fi': ["J Dilla", "Nujabes", "bsd.u"],
    'chillhop': ["Jinsang", "Saib", "IAMNOBODY"],
    'ambient': ["Brian Eno", "Aphex Twin", "Stars of the Lid"],
    'dark-ambient': ["Lustmord", "Atrium Carceri", "Robert Rich"],
    'drone': ["Tim Hecker", "Sunn O)))", "Earth"],
    'downtempo': ["Kruder & Dorfmeister", "Tosca", "Thievery Corporation"],
    'trip-hop': ["Massive Attack", "Portishead", "Tricky"],
    'idm': ["Aphex Twin", "Autechre", "Squarepusher"],
    'glitch': ["Alva Noto", "Ryoji Ikeda", "Xanopticon"],
    'synthwave': ["Kavinsky", "Carpenter Brut", "Perturbator"],
    'vaporwave': ["Macintosh Plus", "Luxury Elite", "Blank Banshee"],
    'chiptune': ["Anamanaguchi", "Chipzel", "Sabrepulse"],
    'electro': ["Kraftwerk", "Afrika Bambaataa", "Drexciya"],
    'garage-house': ["Masters At Work", "Todd Terry", "Erick Morillo"],
    'amapiano': ["DJ Maphorisa", "Kabza De Small", "Focalistic"],
    'gqom': ["DJ Lag", "Distruction Boyz", "Tribal X"],
    'afro-house': ["Black Coffee", "DJ Angelo", "Culoe De Song"],
    'afrobeats': ["Burna Boy", "Wizkid", "Davido"],
    'dancehall': ["Sean Paul", "Shabba Ranks", "Beenie Man"],
    'reggae': ["Bob Marley", "Peter Tosh", "Jimmy Cliff"],
    'reggaeton': ["Daddy Yankee", "Bad Bunny", "J Balvin"],
    'salsa': ["Celia Cruz", "Marc Anthony", "Tito Puente"],
    'bachata': ["Aventura", "Romeo Santos", "Monchy & Alexandra"],
    'cumbia': ["Los Ángeles Azules", "Grupo Cañaveral", "Sonora Dinamita"],
    'bossa-nova': ["João Gilberto", "Antônio Carlos Jobim", "Astrud Gilberto"],
    'samba': ["Pixinguinha", "Zeca Pagodinho", "Paulinho da Viola"],
    'jazz': ["Miles Davis", "John Coltrane", "Charlie Parker"],
    'bebop': ["Dizzy Gillespie", "Charlie Parker", "Thelonious Monk"],
    'cool-jazz': ["Chet Baker", "Dave Brubeck", "Paul Desmond"],
    'swing': ["Duke Ellington", "Count Basie", "Benny Goodman"],
    'blues': ["B.B. King", "Muddy Waters", "Robert Johnson"],
    'rock': ["The Beatles", "Led Zeppelin", "The Rolling Stones"],
    'hard-rock': ["AC/DC", "Aerosmith", "Van Halen"],
    'punk-rock': ["Ramones", "Sex Pistols", "The Clash"],
    'post-punk': ["Joy Division", "The Cure", "Bauhaus"],
    'new-wave': ["Talking Heads", "Devo", "Blondie"],
    'grunge': ["Nirvana", "Pearl Jam", "Soundgarden"],
    'shoegaze': ["My Bloody Valentine", "Slowdive", "Ride"],
    'indie-rock': ["Arctic Monkeys", "The Strokes", "Radiohead"],
    'alternative-rock': ["R.E.M.", "Sonic Youth", "Pixies"],
    'metal': ["Black Sabbath", "Metallica", "Iron Maiden"],
    'heavy-metal': ["Judas Priest", "Motorhead", "Dio"],
    'thrash-metal': ["Slayer", "Megadeth", "Anthrax"],
    'death-metal': ["Death", "Cannibal Corpse", "Morbid Angel"],
    'black-metal': ["Burzum", "Mayhem", "Darkthrone"],
    'doom-metal': ["Candlemass", "Saint Vitus", "Pentagram"],
    'sludge-metal': ["Melvins", "Eyehategod", "Crowbar"],
    'metalcore': ["Killswitch Engage", "Parkway Drive", "August Burns Red"],
    'nu-metal': ["Korn", "Linkin Park", "Limp Bizkit"],
    'pop': ["Michael Jackson", "Madonna", "Taylor Swift"],
    'synthpop': ["Depeche Mode", "New Order", "Pet Shop Boys"],
    'hyperpop': ["100 Gecs", "SOPHIE", "Charli XCX"],
    'k-pop': ["BTS", "BLACKPINK", "EXO"],
    'j-pop': ["Hikaru Utada", "Arashi", "AKB48"],
    'r-b': ["Marvin Gaye", "Stevie Wonder", "Beyoncé"],
    'soul': ["Aretha Franklin", "Otis Redding", "James Brown"],
    'funk': ["George Clinton", "Sly Stone", "Parliament-Funkadelic"],
    'disco': ["Donna Summer", "Bee Gees", "Village People"],
    'classical': ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach"],
    'orchestral': ["John Williams", "Ennio Morricone", "Hans Zimmer"],
    'cinematic': ["Hans Zimmer", "Howard Shore", "John Williams"],
    'soundtrack': ["Ennio Morricone", "John Williams", "Hans Zimmer"],
    'folk': ["Bob Dylan", "Joan Baez", "Woody Guthrie"],
    'country': ["Johnny Cash", "Dolly Parton", "Willie Nelson"],
    'bluegrass': ["Bill Monroe", "Flatt & Scruggs", "Ricky Skaggs"],
    'singer-songwriter': ["Joni Mitchell", "James Taylor", "Carole King"],
}

# Шаблоны структур (ключ – группа, можно привязывать к id)
STRUCTURE_TEMPLATES = {
    'house': "Intro (16) → Bassline entry (8) → Verse (16) → Chorus (16) → Breakdown (8) → Build-up (8) → Drop (16) → Outro (8)",
    'techno': "Intro (16) → Percussive layer (16) → Main groove (32) → Breakdown (16) → Build (8) → Drop (32) → Outro (16)",
    'trance': "Intro (32) → Atmospheric pad (16) → Melodic build (16) → Drop (32) → Breakdown (16) → Second drop (32) → Outro (16)",
    'drum-and-bass': "Intro (16) → Amen break (16) → Verse (16) → Chorus (16) → Breakdown (8) → Build (8) → Drop (32) → Outro (16)",
    'dubstep': "Intro (16) → Half-time groove (16) → Build (8) → Drop (32) → Breakdown (16) → Second drop (32) → Outro (16)",
    'trap': "Intro (8) → Verse (16) → Chorus (16) → Verse (16) → Bridge (8) → Chorus (16) → Outro (8)",
    'hip-hop': "Intro (8) → Verse (16) → Chorus (16) → Verse (16) → Bridge (8) → Chorus (16) → Outro (8)",
    'pop': "Intro (8) → Verse (16) → Chorus (16) → Verse (16) → Chorus (16) → Bridge (8) → Chorus (16) → Outro (8)",
    'rock': "Intro (8) → Verse (16) → Chorus (16) → Verse (16) → Chorus (16) → Bridge (8) → Solo (16) → Chorus (16) → Outro (8)",
    'metal': "Intro (8) → Verse (16) → Chorus (16) → Verse (16) → Chorus (16) → Bridge (8) → Solo (16) → Chorus (16) → Outro (8)",
    'classical': "Exposition → Development → Recapitulation → Coda",
    'ambient': "Atmosphere (long) → Theme → Development → Resolution",
    'jazz': "Intro → Head → Solos → Head → Outro",
    'reggae': "Intro (8) → Verse (16) → Chorus (16) → Verse (16) → Chorus (16) → Instrumental (8) → Outro (8)",
    'amapiano': "Intro (8) → Piano riff (16) → Verse (16) → Chorus (16) → Breakdown (8) → Drop (32) → Outro (8)",
}

def get_structure_for_genre(genre_id):
    # сначала точное совпадение, затем общие шаблоны по ключевым словам
    if genre_id in STRUCTURE_TEMPLATES:
        return STRUCTURE_TEMPLATES[genre_id]
    for key in STRUCTURE_TEMPLATES:
        if key in genre_id:
            return STRUCTURE_TEMPLATES[key]
    return "Intro → Build → Drop → Breakdown → Drop → Outro"  # fallback

def get_prompts_for_genre(genre_id, name, bpm):
    # генерируем 3-4 промта на основе жанра и темпа
    base_prompts = [
        f"Create a {name} track at {bpm} BPM with authentic groove, modern mix, and clear arrangement. Structure: intro, verse, chorus, breakdown, drop, outro.",
        f"Write {name} with a memorable main theme, punchy drums, and rich harmonic content. Aim for a polished streaming-ready sound.",
        f"Produce {name} focusing on atmosphere, space, and texture. Use genre-typical sound design (e.g., synths, bass, percussion).",
        f"Compose {name} with evolving layers, a strong build, and a satisfying drop. Keep the energy curve smooth and engaging."
    ]
    # можно добавить специфичные для некоторых жанров
    if 'house' in genre_id:
        base_prompts.insert(1, f"Create {name} with a classic 4/4 kick, funky bassline, and soulful vocal chops. Tempo {bpm} BPM.")
    if 'techno' in genre_id:
        base_prompts.insert(1, f"Produce {name} with a hypnotic drum machine groove, industrial textures, and minimal but effective changes.")
    if 'trance' in genre_id:
        base_prompts.insert(1, f"Make {name} with epic synth arpeggios, emotional chord progressions, and a massive breakdown.")
    if 'drum' in genre_id and 'bass' in genre_id:
        base_prompts.insert(1, f"Create {name} with fast breakbeats, heavy sub-bass, and atmospheric pads. Tempo {bpm} BPM.")
    if 'dubstep' in genre_id:
        base_prompts.insert(1, f"Write {name} with half-time drums, wobble bass, and deep sub-bass. Build tension with risers.")
    if 'trap' in genre_id:
        base_prompts.insert(1, f"Make {name} with 808 bass, hi-hat rolls, and hard-hitting drums. Use dark melodies and vocal chops.")
    return base_prompts[:5]  # максимум 5

# ---------- Основной скрипт ----------
def update_genres(input_file='data/genres.json', output_file='data/genres_updated.json'):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        genre_id = item.get('id', '').lower()
        name = item.get('name', genre_id)
        bpm = item.get('bpm', '120')
        
        # Добавляем артистов
        if genre_id in ARTISTS_MAP:
            item['artists'] = ARTISTS_MAP[genre_id]
        else:
            # если нет в списке – ставим пустой массив (можно потом заполнить вручную)
            item['artists'] = []
        
        # Обновляем структуру
        item['structure'] = get_structure_for_genre(genre_id)
        
        # Обновляем промты (заменяем массив на новый)
        item['prompts'] = get_prompts_for_genre(genre_id, name, bpm)
        
        # (оставляем description и history как есть – вы можете заменить их позже)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Обновлённый JSON сохранён как {output_file}")

if __name__ == '__main__':
    update_genres()
