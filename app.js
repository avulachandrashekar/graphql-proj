const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3030;

app.get("/home", (req, res) => {
  res.statusCode = 200;
  res.send("Hello boy!!");
});

app.listen(port, () => {
  console.log(`application started on ${port}`);
});
