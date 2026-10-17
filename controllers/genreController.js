const pool = require("../db/pool");

async function getAllGenres(req, res, next) {
  try {
    const results = await pool.query("SELECT * FROM genres");
    res.json(results.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllGenres,
};
