require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tweetsRouter = require("./routes/tweets");

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("--- REQUÊTE REÇUE ---");
  console.log("URL:", req.url);
  console.log("Headers:", req.headers["content-type"]); // Doit afficher 'application/json'
  console.log("Body:", req.body); // Si undefined, le format est mauvais
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tweets", tweetsRouter);

module.exports = app;
