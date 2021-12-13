const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    nickname: { type: String },
    games: [
        {
            gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
            game: { type: String },
            created: { type: Date, default: Date.now() },
        },
    ],
    notifications: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            message: { type: String },
            created: { type: Date, default: Date.now() },
            read: { type: Boolean, default: false },
            date: { type: String, default: "" },
        },
    ],
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            msgId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
