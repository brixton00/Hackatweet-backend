const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        hashtags: [{ type: String }],
        tweet: { type: String, maxlength: 280 },
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    }
)

const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = Tweet;