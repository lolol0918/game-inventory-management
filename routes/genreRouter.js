const { Router } = require("express");
const genreController = require("../controllers/genreController");

const router = Router();

router.get("/new", genreController.getNewGenreForm);
router.post("/new", genreController.createGenre);


router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);



module.exports = router;
