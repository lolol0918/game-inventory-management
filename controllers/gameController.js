const pool = require("../db/pool");

// The genre checkboxes/select send us an array when more than one genre is
// picked, a single string when only one is, and nothing at all when the
// field is left empty.
function parseGenreIds(value) {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  const ids = Array.isArray(value) ? value : [value];

  return ids.filter(
    (genreId) => genreId !== undefined && genreId !== null && genreId !== ""
  );
}

// Groups the rows of game_genres by game so every game can be listed once
// with all of its genres.
function groupGenresByGame(rows) {
  const genresByGame = new Map();

  for (const row of rows) {
    const gameGenres = genresByGame.get(row.game_id) || [];

    gameGenres.push({
      genre_id: row.genre_id,
      genre_name: row.genre_name,
    });

    genresByGame.set(row.game_id, gameGenres);
  }

  return genresByGame;
}

async function getAllGames(req, res, next) {
  try {
    const gamesResult = await pool.query(
      `SELECT g.*, p.publisher_name
       FROM games g
       LEFT JOIN publishers p ON p.publisher_id = g.publisher_id
       ORDER BY g.id`
    );
    const genresResult = await pool.query(
      "SELECT * FROM genres ORDER BY genre_name"
    );
    const gameGenresResult = await pool.query(
      `SELECT gg.game_id, g.genre_id, g.genre_name
       FROM game_genres gg
       JOIN genres g ON g.genre_id = gg.genre_id
       ORDER BY g.genre_name`
    );

    const genresByGame = groupGenresByGame(gameGenresResult.rows);

    // Each game keeps its own row, so a game with several genres is still
    // only listed once.
    const games = gamesResult.rows.map((game) => ({
      ...game,
      genres: genresByGame.get(game.id) || [],
    }));

    res.render("games", { games, genres: genresResult.rows });
  } catch (err) {
    next(err);
  }
}

async function getGameById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT g.*, p.publisher_name
       FROM games g
       LEFT JOIN publishers p ON p.publisher_id = g.publisher_id
       WHERE g.id = $1`,
      [id]
    );

    if (result.rows.length == 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const genresResult = await pool.query(
      `SELECT g.genre_id, g.genre_name
       FROM game_genres gg
       JOIN genres g ON g.genre_id = gg.genre_id
       WHERE gg.game_id = $1
       ORDER BY g.genre_name`,
      [id]
    );

    res.render("game-details", {
      game: result.rows[0],
      genres: genresResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function getNewGameForm(req, res, next) {
  try {
    const genresResult = await pool.query(
      "SELECT * FROM genres ORDER BY genre_name"
    );
    const publishersResult = await pool.query(
      "SELECT * FROM publishers ORDER BY publisher_name"
    );

    res.render("game-form", {
      game: null,
      genres: genresResult.rows,
      publishers: publishersResult.rows,
      selectedGenreIds: [],
    });
  } catch (err) {
    next(err);
  }
}

async function createGame(req, res, next) {
  let client;

  try {
    const {
      title,
      description,
      price,
      stock,
      image_url,
      publisher_id,
      genre_ids,
      release_year,
      rating,
    } = req.body;

    const genreIds = parseGenreIds(genre_ids);
    const ratingValue =
      rating === undefined || rating === null || rating === "" ? null : rating;

    client = await pool.connect();

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO games (
        title,
        description,
        price,
        stock,
        image_url,
        publisher_id,
        release_year,
        rating
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [
        title,
        description || null,
        price,
        stock,
        image_url || null,
        publisher_id || null,
        release_year || null,
        ratingValue,
      ]
    );

    const newGameId = result.rows[0].id;

    for (const genreId of genreIds) {
      await client.query(
        `INSERT INTO game_genres (game_id, genre_id)
         VALUES ($1, $2)`,
        [newGameId, genreId]
      );
    }

    await client.query("COMMIT");

    res.redirect(`/games/${newGameId}`);
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }

    next(err);
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function getEditGameForm(req, res, next) {
  try {
    const { id } = req.params;

    const gameResult = await pool.query(
      "SELECT * FROM games WHERE id = $1",
      [id]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).send("Game not found");
    }

    const genresResult = await pool.query(
      "SELECT * FROM genres ORDER BY genre_name"
    );
    const publishersResult = await pool.query(
      "SELECT * FROM publishers ORDER BY publisher_name"
    );

    const selectedGenresResult = await pool.query(
      "SELECT genre_id FROM game_genres WHERE game_id = $1",
      [id]
    );

    const selectedGenreIds = selectedGenresResult.rows.map(
      (row) => row.genre_id
    );

    res.render("game-form", {
      game: gameResult.rows[0],
      genres: genresResult.rows,
      publishers: publishersResult.rows,
      selectedGenreIds,
    });
  } catch (err) {
    next(err);
  }
}

async function updateGame(req, res, next) {
  let client;

  try {
    const { id } = req.params;

    const {
      title,
      description,
      price,
      stock,
      image_url,
      publisher_id,
      genre_ids,
      release_year,
      rating,
    } = req.body;

    const genreIds = parseGenreIds(genre_ids);
    const ratingValue =
      rating === undefined || rating === null || rating === "" ? null : rating;

    client = await pool.connect();

    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE games SET
        title = $1,
        description = $2,
        price = $3,
        stock = $4,
        image_url = $5,
        publisher_id = $6,
        release_year = $7,
        rating = $8
      WHERE id = $9
      RETURNING id`,
      [
        title,
        description || null,
        price,
        stock,
        image_url || null,
        publisher_id || null,
        release_year || null,
        ratingValue,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).send("Game not found");
    }

    // Replace the old genre links with the ones that were submitted. When no
    // genre is selected this removes every link of the game.
    await client.query("DELETE FROM game_genres WHERE game_id = $1", [id]);

    for (const genreId of genreIds) {
      await client.query(
        `INSERT INTO game_genres (game_id, genre_id)
         VALUES ($1, $2)`,
        [id, genreId]
      );
    }

    await client.query("COMMIT");

    res.redirect(`/games/${result.rows[0].id}`);
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }

    next(err);
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function getHome(req, res, next) {
  try {
    const gamesResult = await pool.query(
      `SELECT g.*, p.publisher_name
       FROM games g
       LEFT JOIN publishers p ON p.publisher_id = g.publisher_id
       ORDER BY g.id
       LIMIT 12`
    );
    const gameGenresResult = await pool.query(
      `SELECT gg.game_id, g.genre_id, g.genre_name
       FROM game_genres gg
       JOIN genres g ON g.genre_id = gg.genre_id
       ORDER BY g.genre_name`
    );

    const genresByGame = groupGenresByGame(gameGenresResult.rows);

    const games = gamesResult.rows.map((game) => ({
      ...game,
      genres: genresByGame.get(game.id) || [],
    }));

    res.render("index", { games });
  } catch (err) {
    next(err);
  }
}

async function deleteGame(req, res, next) {
  let client;

  try {
    const { id } = req.params;

    client = await pool.connect();
    await client.query("BEGIN");
    await client.query("DELETE FROM game_genres WHERE game_id = $1", [id]);
    const result = await client.query("DELETE FROM games WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).send("Game not found");
    }

    await client.query("COMMIT");
    res.redirect("/games");
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    next(err);
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = {
  getAllGames,
  getGameById,
  getNewGameForm,
  createGame,
  getEditGameForm,
  updateGame,
  deleteGame,
  getHome,
};
