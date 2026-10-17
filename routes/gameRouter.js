const { Router } = require("express");
const gameController = require("../controllers/gameController");

const router = Router();

router.get("/:id/edit", gameController.getEditGameForm);
router.post("/:id/edit", gameController.updateGame);
router.get("/new", gameController.getNewGameForm);
router.post("/new", gameController.createGame);
router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);

module.exports = router;
