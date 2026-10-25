const { Router } = require("express");
const publisherController = require("../controllers/publisherController");

const router = Router();

router.post("/new", publisherController.createPublisher);
router.post("/:id/edit", publisherController.editPublisher);
router.post("/:id/delete", publisherController.deletePublisher);

router.get("/", publisherController.getAllPublishers);

module.exports = router;
