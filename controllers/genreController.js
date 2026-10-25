const pool = require("../db/pool");

async function getAllGenres(req, res, next) {
  try {
    const results = await pool.query("SELECT * FROM genres ORDER BY genre_name");
    res.render("genres", {
      genres: results.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function getGenreById(req, res, next) {
  try {
    const { id } = req.params;

    const genreResult = await pool.query(
      "SELECT * FROM genres WHERE genre_id = $1",
      [id]
    );

    if (genreResult.rowCount === 0) {
      return res.status(404).send("Genre Not Found");
    }

    // A game can have several genres, so the games are found through the
    // game_genres junction table.
    const gamesResult = await pool.query(
      `SELECT g.* FROM games g
       JOIN game_genres gg ON gg.game_id = g.id
       WHERE gg.genre_id = $1
       ORDER BY g.title`,
      [id]
    );

    res.render("genre-details", {
      genre: genreResult.rows[0],
      games: gamesResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

function getNewGenreForm(req, res) {
  res.render("genre-form");
}

async function createGenre(req, res, next) {
  try {
    const { genre_name } = req.body;

    const result = await pool.query(
      "INSERT INTO genres (genre_name) VALUES ($1) RETURNING *",
      [genre_name]
    );

    res.redirect("/genres");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllGenres,
  getGenreById,
  getNewGenreForm,
  createGenre,
};
