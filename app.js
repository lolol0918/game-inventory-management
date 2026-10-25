require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const gameController = require("./controllers/gameController");

// Home page shows a preview of the library
app.get("/", gameController.getHome);
// Routes
app.use("/games", require("./routes/gameRouter.js"));
app.use("/genres", require("./routes/genreRouter.js"));
app.use("/publishers", require("./routes/publisherRouter.js"));

// Error handling middleware: every error passed to next(err) ends up here.
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
