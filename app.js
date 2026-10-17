require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Game Inventory");
});

app.use("/games", require("./routes/gameRouter.js"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
