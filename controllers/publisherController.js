const pool = require("../db/pool");

async function getAllPublishers(req, res, next) {
  try {
    const results = await pool.query(
      "SELECT * FROM publishers ORDER BY publisher_name"
    );
    res.render("publishers", {
      publishers: results.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function createPublisher(req, res, next) {
  try {
    const { publisher_name } = req.body;

    if (!publisher_name || publisher_name.trim() === "") {
      return res.redirect("/publishers");
    }

    await pool.query(
      "INSERT INTO publishers (publisher_name) VALUES ($1)",
      [publisher_name.trim()]
    );

    res.redirect("/publishers");
  } catch (err) {
    next(err);
  }
}

async function editPublisher(req, res, next) {
  try {
    const { id } = req.params;
    const { publisher_name } = req.body;

    if (!publisher_name || publisher_name.trim() === "") {
      return res.redirect("/publishers");
    }

    await pool.query(
      "UPDATE publishers SET publisher_name = $1 WHERE publisher_id = $2",
      [publisher_name.trim(), id]
    );

    res.redirect("/publishers");
  } catch (err) {
    next(err);
  }
}

async function deletePublisher(req, res, next) {
  try {
    const { id } = req.params;

    const gameCountResult = await pool.query(
      "SELECT COUNT(*)::int AS count FROM games WHERE publisher_id = $1",
      [id]
    );

    const gameCount = gameCountResult.rows[0]?.count || 0;

    if (gameCount > 0) {
      return res.status(400).send(
        "This publisher cannot be deleted because there are games assigned to it. Please reassign or update those games first."
      );
    }

    await pool.query("DELETE FROM publishers WHERE publisher_id = $1", [id]);
    res.redirect("/publishers");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllPublishers,
  createPublisher,
  editPublisher,
  deletePublisher,
};
