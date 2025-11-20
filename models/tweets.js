const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        hashtags: [{ type: String }],
        tweet: { type: String, maxlength: 280 },
        createdAt: { type: Date, default: Date.now },
    }
)

const Tweet = mongoose.model('user', tweetSchema);

module.exports = Tweet;