const { Router } = require("express");
const gameController = require("../controllers/gameController");

const router = Router();

router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);

module.exports = router;
