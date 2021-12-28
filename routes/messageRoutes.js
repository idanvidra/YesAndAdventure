const express = require("express");
const router = express.Router();

const MessageCtrl = require("../controllers/message");
const AuthHelper = require("../Helpers/authHelper");

// send message
// router.post(
//     "/chat-message/:senderId/:receiverId",
//     AuthHelper.VerifyToken,
//     MessageCtrl.SendMessage
// );

// // get messages
// router.get(
//     "/chat-message/:senderId/:receiverId",
//     AuthHelper.VerifyToken,
//     MessageCtrl.GetAllMessages
// );

// send message
router.post("/chat-message/:senderId/:receiverId", MessageCtrl.SendMessage);

// get messages
router.get("/chat-message/:senderId/:receiverId", MessageCtrl.GetAllMessages);
module.exports = router;
