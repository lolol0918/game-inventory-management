const pool = require("../db/pool");

async function getAllGames(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM games");
    const genres = await pool.query("SELECT * FROM genres");

    res.render("games", { games: result.rows, genres: genres.rows });
  } catch (err) {
    next(err);
  }
}

async function getGameById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);

    if (result.rows.length == 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.render("game-details", { game: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function createGame(req, res, next) {
  try {
    const {
      title,
      description,
      price,
      stock,
      image_url,
      publisher_id,
      genre_id,
      release_year,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO games (
        title,
        description,
        price,
        stock,
        image_url,
        publisher_id,
        genre_id,
        release_year
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
        genre_id || null,
        release_year || null,
      ]
    );

    const newGameId = result.rows[0].id;

    res.redirect(`/games/${newGameId}`);
  } catch (err) {
    next(err);
  }
}

function getNewGameForm(req, res) {
  res.render("game-form");
}

async function getEditGameForm(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Game not found");
    }

    res.render("game-edit-form", {
      game: result.rows[0],
    });

  } catch (err) {
    next(err);
  }
}

async function updateGame(req, res, next) {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      price,
      stock,
      image_url,
      publisher_id,
      genre_id,
      release_year,
    } = req.body;

    const result = await pool.query(
      `UPDATE games SET
        title = $1,
        description = $2,
        price = $3,
        stock = $4,
        image_url = $5,
        publisher_id = $6,
        genre_id = $7,
        release_year = $8
      WHERE id = $9
      RETURNING id`,
      [
        title,
        description || null,
        price,
        stock,
        image_url || null,
        publisher_id || null,
        genre_id || null,
        release_year || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Game not found");
    }

    res.redirect(`/games/${result.rows[0].id}`);
  } catch (err) {
    next(err);
  }
}



module.exports = {
  getAllGames,
  getGameById,
  getNewGameForm,
  createGame,
  getEditGameForm,
  updateGame,
};
