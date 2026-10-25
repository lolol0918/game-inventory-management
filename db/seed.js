require("dotenv").config();

const pool = require("./pool");

// Requires Node 18+ (global fetch).
const LUTRIS_API = "https://lutris.net/api/games";
const LUTRIS_MEDIA = {
  coverart: (slug) => `https://lutris.net/games/cover/${slug}.jpg`,
  banner: (slug) => `https://lutris.net/games/banner/${slug}.jpg`,
};

// IMAGE_KIND=coverart (tall box art, default) | banner (wide)
const IMAGE_KIND = process.env.IMAGE_KIND === "banner" ? "banner" : "coverart";
const SKIP_IMAGES = process.env.SEED_SKIP_IMAGES === "1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop";

const publishers = [
  "Nintendo",
  "Sony Interactive Entertainment",
  "Microsoft Game Studios",
  "CD Projekt Red",
  "FromSoftware",
  "Rockstar Games",
  "Valve",
  "Bethesda Softworks",
  "Capcom",
  "Ubisoft",
  "Electronic Arts",
  "Square Enix",
  "Bandai Namco",
  "Larian Studios",
  "Team Cherry",
  "Supergiant Games",
  "Mojang",
  "Konami",
];

const genres = [
  "Action",
  "Adventure",
  "RPG",
  "Platformer",
  "Open World",
  "Shooter",
  "Horror",
  "Simulation",
  "Racing",
  "Puzzle",
  "Strategy",
  "Fighting",
  "Sports",
  "Roguelike",
  "Sandbox",
];

// `lutris_slug` is optional: set it when the title search picks the wrong game.
const games = [
  {
    title: "The Legend of Zelda: Breath of the Wild",
    description: "An open-air adventure that redefines exploration in the vast lands of Hyrule.",
    price: 59.99, stock: 25, publisher: "Nintendo", year: 2017, rating: 9.7,
    genres: ["Action", "Adventure", "Open World"],
  },
  {
    title: "Super Mario Odyssey",
    description: "Join Mario on a massive, globe-trotting 3D adventure.",
    price: 59.99, stock: 32, publisher: "Nintendo", year: 2017, rating: 9.9,
    genres: ["Action", "Platformer", "Adventure"],
  },
  {
    title: "God of War",
    description: "A new beginning for Kratos in the Norse realms.",
    price: 49.99, stock: 18, publisher: "Sony Interactive Entertainment", year: 2018, rating: 9.8,
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    title: "The Witcher 3: Wild Hunt",
    description: "A story-driven open world RPG set in a war-torn fantasy universe.",
    price: 39.99, stock: 21, publisher: "CD Projekt Red", year: 2015, rating: 9.9,
    genres: ["RPG", "Open World", "Adventure"],
  },
  {
    title: "Cyberpunk 2077",
    description: "An open-world action RPG set in the dangerous megalopolis of Night City.",
    price: 39.99, stock: 28, publisher: "CD Projekt Red", year: 2020, rating: 8.6,
    genres: ["RPG", "Open World", "Shooter"],
  },
  {
    title: "Elden Ring",
    description: "A vast world of open fields, dungeons, and formidable foes by FromSoftware.",
    price: 59.99, stock: 16, publisher: "FromSoftware", year: 2022, rating: 9.6,
    genres: ["RPG", "Action", "Open World"],
  },
  {
    title: "Dark Souls III",
    description: "An action RPG set in a dark fantasy world of ruin.",
    price: 59.99, stock: 12, publisher: "FromSoftware", year: 2016, rating: 9.5,
    genres: ["RPG", "Action"],
  },
  {
    title: "Sekiro: Shadows Die Twice",
    description: "Carve your own clever path to vengeance in Sengoku-era Japan.",
    price: 59.99, stock: 15, publisher: "FromSoftware", year: 2019, rating: 9.4,
    genres: ["Action", "Adventure"],
  },
  {
    title: "Red Dead Redemption 2",
    description: "An epic tale of life in America's unforgiving heartland.",
    price: 59.99, stock: 14, publisher: "Rockstar Games", year: 2018, rating: 9.8,
    genres: ["Action", "Adventure", "Open World"],
  },
  {
    title: "Grand Theft Auto V",
    description: "Three criminals, one city, and a series of high-stakes heists in Los Santos.",
    price: 29.99, stock: 45, publisher: "Rockstar Games", year: 2013, rating: 9.6,
    genres: ["Action", "Open World", "Racing"],
  },
  {
    title: "Halo Infinite",
    description: "Master Chief returns for a heroic adventure across a vast ringworld.",
    price: 59.99, stock: 22, publisher: "Microsoft Game Studios", year: 2021, rating: 8.9,
    genres: ["Action", "Shooter"],
  },
  {
    title: "Forza Horizon 5",
    description: "Your ultimate horizon adventure awaits in beautiful Mexico.",
    price: 59.99, stock: 26, publisher: "Microsoft Game Studios", year: 2021, rating: 9.6,
    genres: ["Racing", "Simulation", "Open World"],
  },
  {
    title: "Portal 2",
    description: "A mind-bending puzzle adventure with dark humor.",
    price: 19.99, stock: 40, publisher: "Valve", year: 2011, rating: 9.9,
    genres: ["Puzzle", "Adventure"],
  },
  {
    title: "Half-Life 2",
    description: "Gordon Freeman returns to fight the Combine in City 17.",
    price: 9.99, stock: 50, publisher: "Valve", year: 2004, rating: 9.8,
    genres: ["Shooter", "Action", "Adventure"],
  },
  {
    title: "Counter-Strike 2",
    description: "The legendary competitive tactical shooter, rebuilt on Source 2.",
    price: 0, stock: 99, publisher: "Valve", year: 2023, rating: 8.7,
    genres: ["Shooter", "Action"],
  },
  {
    title: "The Elder Scrolls V: Skyrim",
    description: "Become the Dragonborn and explore the frozen north of Tamriel.",
    price: 39.99, stock: 30, publisher: "Bethesda Softworks", year: 2011, rating: 9.4,
    genres: ["RPG", "Open World", "Adventure"],
  },
  {
    title: "DOOM Eternal",
    description: "Rip and tear through the hordes of Hell in this relentless FPS.",
    price: 39.99, stock: 24, publisher: "Bethesda Softworks", year: 2020, rating: 9.0,
    genres: ["Shooter", "Action"],
  },
  {
    title: "Resident Evil 4",
    description: "Leon Kennedy faces a terrifying rural conspiracy in this reimagined classic.",
    price: 59.99, stock: 19, publisher: "Capcom", year: 2023, rating: 9.3,
    genres: ["Horror", "Action", "Shooter"],
  },
  {
    title: "Monster Hunter: World",
    description: "Hunt colossal monsters in living, breathing ecosystems.",
    price: 29.99, stock: 27, publisher: "Capcom", year: 2018, rating: 9.0,
    genres: ["Action", "RPG"],
  },
  {
    title: "Street Fighter 6",
    description: "The next generation of the iconic fighting franchise.",
    price: 59.99, stock: 20, publisher: "Capcom", year: 2023, rating: 9.2,
    genres: ["Fighting", "Action"],
  },
  {
    title: "Assassin's Creed Odyssey",
    description: "Choose your fate in a Greek epic spanning the Peloponnesian War.",
    price: 29.99, stock: 33, publisher: "Ubisoft", year: 2018, rating: 8.7,
    genres: ["Action", "RPG", "Open World"],
  },
  {
    title: "It Takes Two",
    description: "A co-op-only adventure about a couple turned into dolls by a magic spell.",
    price: 39.99, stock: 23, publisher: "Electronic Arts", year: 2021, rating: 9.2,
    genres: ["Adventure", "Platformer", "Puzzle"],
  },
  {
    title: "Final Fantasy VII Remake",
    description: "Cloud Strife joins the eco-terrorist group AVALANCHE in Midgar.",
    price: 49.99, stock: 17, publisher: "Square Enix", year: 2020, rating: 9.0,
    genres: ["RPG", "Action"],
  },
  {
    title: "Elden Ring: Nightreign",
    description: "A standalone cooperative survival adventure in the Elden Ring universe.",
    price: 39.99, stock: 20, publisher: "FromSoftware", year: 2025, rating: 8.5,
    genres: ["Action", "RPG", "Roguelike"],
  },
  {
    title: "Baldur's Gate 3",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal.",
    price: 59.99, stock: 30, publisher: "Larian Studios", year: 2023, rating: 9.8,
    genres: ["RPG", "Strategy", "Adventure"],
  },
  {
    title: "Hollow Knight",
    description: "Explore a vast, ruined kingdom of insects and heroes in this hand-drawn action adventure.",
    price: 14.99, stock: 60, publisher: "Team Cherry", year: 2017, rating: 9.4,
    genres: ["Action", "Platformer", "Adventure"],
  },
  {
    title: "Hades",
    description: "Defy the god of the dead as you hack and slash out of the Underworld.",
    price: 24.99, stock: 42, publisher: "Supergiant Games", year: 2020, rating: 9.5,
    genres: ["Action", "Roguelike", "RPG"],
  },
  {
    title: "Minecraft",
    description: "Build, explore and survive in an infinite blocky world.",
    price: 29.99, stock: 80, publisher: "Mojang", year: 2011, rating: 9.3,
    genres: ["Sandbox", "Adventure", "Simulation"],
  },
  {
    title: "Metal Gear Solid V: The Phantom Pain",
    description: "Snake returns for tactical espionage action in Afghanistan and Africa.",
    price: 19.99, stock: 18, publisher: "Konami", year: 2015, rating: 9.1,
    genres: ["Action", "Open World", "Shooter"],
  },
];

// ---------------------------------------------------------------------------
// Lutris image lookup
// ---------------------------------------------------------------------------

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "game-store-seed/1.0" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(500 * (attempt + 1));
    }
  }
}

async function urlExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10_000) });
    return res.ok;
  } catch {
    return false;
  }
}

// Pick the best Lutris search result: exact name + year > exact name > year > first.
function pickBest(results, game) {
  const target = normalize(game.title);
  const score = (r) =>
    (normalize(r.name) === target ? 4 : 0) +
    (Number(r.year) === game.year ? 2 : 0) +
    (normalize(r.name).includes(target) || target.includes(normalize(r.name)) ? 1 : 0);

  return [...results].sort((a, b) => score(b) - score(a))[0];
}

async function getLutrisImage(game) {
  let slug = game.lutris_slug;
  let result = null;

  if (!slug) {
    const data = await fetchJson(`${LUTRIS_API}?search=${encodeURIComponent(game.title)}`);
    result = data.results?.length ? pickBest(data.results, game) : null;
    slug = result?.slug;
  }
  if (!slug) return null;

  // Prefer what the API returned; otherwise build the same URL Lutris itself uses.
  const fromApi =
    IMAGE_KIND === "banner" ? result?.banner_url : result?.coverart;
  const candidate = fromApi || LUTRIS_MEDIA[IMAGE_KIND](slug);

  return (await urlExists(candidate)) ? candidate : null;
}

async function resolveImages() {
  const images = new Map();
  if (SKIP_IMAGES) return images;

  console.log(`Fetching ${IMAGE_KIND} images from Lutris...`);
  for (const game of games) {
    try {
      const url = await getLutrisImage(game);
      if (url) {
        images.set(game.title, url);
        console.log(`  ✓ ${game.title}`);
      } else {
        console.warn(`  ✗ ${game.title} (no Lutris image, using fallback)`);
      }
    } catch (err) {
      console.warn(`  ✗ ${game.title} (${err.message}, using fallback)`);
    }
    await sleep(150); // be polite to lutris.net
  }
  return images;
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

async function upsertLookup(client, table, idCol, nameCol, names) {
  const map = new Map();
  for (const name of names) {
    await client.query(
      `INSERT INTO ${table} (${nameCol}) VALUES ($1) ON CONFLICT DO NOTHING`,
      [name]
    );
    const { rows } = await client.query(
      `SELECT ${idCol} AS id FROM ${table} WHERE ${nameCol} = $1 LIMIT 1`,
      [name]
    );
    if (rows[0]) map.set(name, rows[0].id);
  }
  return map;
}

async function seed() {
  // Do network work before opening the transaction.
  const images = await resolveImages();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const publisherMap = await upsertLookup(
      client, "publishers", "publisher_id", "publisher_name", publishers
    );
    const genreMap = await upsertLookup(
      client, "genres", "genre_id", "genre_name", genres
    );

    let inserted = 0;
    let updated = 0;

    for (const game of games) {
      const publisherId = publisherMap.get(game.publisher) ?? null;
      const imageUrl = images.get(game.title) || null;

      const existing = await client.query("SELECT id FROM games WHERE title = $1", [game.title]);
      let gameId;

      if (existing.rows.length > 0) {
        gameId = existing.rows[0].id;
        await client.query(
          `UPDATE games
              SET description = $2, price = $3, stock = $4,
                  image_url = COALESCE($5, image_url, $6),
                  publisher_id = $7, release_year = $8, rating = $9
            WHERE id = $1`,
          [gameId, game.description, game.price, game.stock, imageUrl,
            FALLBACK_IMAGE, publisherId, game.year, game.rating]
        );
        updated++;
      } else {
        const res = await client.query(
          `INSERT INTO games
             (title, description, price, stock, image_url, publisher_id, release_year, rating)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [game.title, game.description, game.price, game.stock,
          imageUrl || FALLBACK_IMAGE, publisherId, game.year, game.rating]
        );
        gameId = res.rows[0].id;
        inserted++;
      }

      // Reset genre links so edits to `genres` above are reflected on re-seed.
      await client.query("DELETE FROM game_genres WHERE game_id = $1", [gameId]);
      for (const genreName of game.genres) {
        const genreId = genreMap.get(genreName);
        if (!genreId) {
          console.warn(`Unknown genre "${genreName}" on ${game.title}`);
          continue;
        }
        await client.query(
          `INSERT INTO game_genres (game_id, genre_id)
           VALUES ($1, $2)
           ON CONFLICT (game_id, genre_id) DO NOTHING`,
          [gameId, genreId]
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      `Database seeded: ${inserted} inserted, ${updated} updated, ` +
      `${images.size}/${games.length} Lutris images.`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});