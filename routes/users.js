const express = require("express");
const router = express.Router();
const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// ROUTE SIGNUP
router.post("/signup", (req, res) => {
  const { firstname, username, password } = req.body;

  if (!firstname || !username || !password) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  User.findOne({ username: { $regex: new RegExp(username, "i") } }).then(
    (data) => {
      if (data) {
        res.json({ result: false, error: "User already exists" });
      } else {
        const hash = bcrypt.hashSync(password, 10);

        const newUser = new User({
          firstname,
          username,
          password: hash,
          token: uid2(32),
        });

        newUser
          .save()
          .then((newSavedUser) => {
            res.json({
              result: true,
              token: newSavedUser.token,
              user: newSavedUser,
            });
          })
          .catch((err) => {
            console.error(err); // Affiche l'erreur dans le terminal
            res.json({ result: false, error: "Database error check logs" });
          });
      }
    }
  );
});

// ROUTE SIGNIN
router.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  User.findOne({ username: { $regex: new RegExp(username, "i") } }).then(
    (data) => {
      // 2. On vérifie si user existe ET si le hash correspond
      if (data && bcrypt.compareSync(password, data.password)) {
        res.json({
          result: true,
          token: data.token,
          user: {
            username: data.username,
            firstname: data.firstname,
            avatar: data.avatar,
          }, //
        });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    }
  );
});

module.exports = router;
