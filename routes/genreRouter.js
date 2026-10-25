const { Router } = require("express");
const genreController = require("../controllers/genreController");

const router = Router();

// router.get("/new", genreController.getNewGenreForm);
router.post("/new", genreController.createGenre);

router.post("/:id/edit", genreController.editGenre);
router.post("/:id/delete", genreController.deleteGenre);


router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);



module.exports = router;
