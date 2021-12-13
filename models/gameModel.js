const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nickname: { type: String, default: "" },
    game: { type: String, default: "" },
    created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Game", gameSchema);
