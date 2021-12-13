const express = require("express");
const router = express.Router();

const GameCtrl = require("../controllers/games");
const AuthHelper = require("../Helpers/authHelper");

router.get("/games", AuthHelper.VerifyToken, GameCtrl.GetAllGames);
router.get("/game/:id", AuthHelper.VerifyToken, GameCtrl.GetGame);

router.post("/game/add-game", AuthHelper.VerifyToken, GameCtrl.AddGame);

module.exports = router;
