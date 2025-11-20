const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Tweet = require("../models/tweets");

//GET /tweets
router.get("/", (req, res) => {
  Tweet.find()
    .populate("user")
    .sort({ createdAt: -1 })
    .then((tweets) => {
      res.json({ result: true, tweets });
    });
});

//POST /tweet
router.post("/", (req, res) => {
  const { token, tweet, hashtags } = req.body;

  if (!token || !tweet) {
    return res.json({ result: false, error: "Missing fields" });
  }

  User.findOne({ token }).then((user) => {
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    if (tweet.length > 280) {
      return res.json({ result: false, error: "Tweet too long" });
    }

    const newTweet = new Tweet({
      user: user._id,
      tweet,
      hashtags: hashtags || [],
    });

    newTweet.save().then((savedTweet) => {
      res.json({ result: true, tweet: savedTweet });
    });
  });
});

//DELETE /tweet/:id
router.delete("/:id", (req, res) => {
  const tweetId = req.params.id;
  const token = req.body.token;

  if (!token) {
    return res.json({ result: false, error: "Missing token" });
  }

  User.findOne({ token: token }).then((user) => {
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    return Tweet.findById(tweetId).then((tweet) => {
      if (!tweet) {
        return res.json({ result: false, error: "Tweet not found" });
      }

      if (tweet.user.toString() !== user._id.toString()) {
        return res.json({ result: false, error: "Not allowed" });
      }

      return Tweet.deleteOne({ _id: tweetId }).then(() => {
        res.json({ result: true });
      });
    });
  });
});

//GET /hashtags/:tag
router.get("/hashtags/:tag", (req, res) => {
  const hashtag = req.params.tag;

  Tweet.find({ hashtags: hashtag })
    .populate("user")
    .sort({ createdAt: -1 })
    .then((tweets) => {
      res.json({ result: true, tweets });
    });
});

//POST /tweet/:id/like
router.post("/:id/like", (req, res) => {
  const tweetId = req.params.id;
  const token = req.body.token;

  if (!token) {
    return res.json({ result: false, error: "Missing token" });
  }

  User.findOne({ token: token }).then((user) => {
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    Tweet.findById(tweetId).then((tweet) => {
      if (!tweet) {
        return res.json({ result: false, error: "Tweet not found" });
      }

      const userId = user._id.toString();
      const alreadyLiked = tweet.likes
        .map((id) => id.toString())
        .includes(userId);

      if (alreadyLiked) {
        tweet.likes = tweet.likes.filter((id) => id.toString() !== userId);
      } else {
        tweet.likes.push(user._id);
      }

      tweet.save().then((updatedTweet) => {
        res.json({ result: true, tweet: updatedTweet });
      });
    });
  });
});

module.exports = router;
