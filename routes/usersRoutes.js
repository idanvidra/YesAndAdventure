const express = require("express");
const router = express.Router();
const UserCtrl = require("../controllers/users");
const AuthHelper = require("../Helpers/authHelper");

// route to get all users in the DB
router.get("/users", AuthHelper.VerifyToken, UserCtrl.GetAllUsers);
router.get("/user/:id", AuthHelper.VerifyToken, UserCtrl.GetUserById);
router.get(
    "/usernick/:nickname",
    AuthHelper.VerifyToken,
    UserCtrl.GetUserByNickname
);
// todo: add mark and delete notification when messaging is added
// video 155
// router.post('/marknotification/:id', AuthHelper.VerifyToken)

module.exports = router;
