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

module.exports = {
  getAllGames,
  getGameById,
};
