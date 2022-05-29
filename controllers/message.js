const HttpStatus = require("http-status-codes");

const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

module.exports = {
    async GetAllMessages(req, res) {
        const { senderId, receiverId } = req.params;
        const conversation = await Conversation.findOne({
            $or: [
                {
                    $and: [
                        { "participants.senderId": senderId },
                        { "participants.receiverId": receiverId },
                    ],
                },
                {
                    $and: [
                        { "participants.senderId": receiverId },
                        { "participants.receiverId": senderId },
                    ],
                },
            ],
        }).select("_id");

        if (conversation) {
            const messages = await Message.findOne({
                conversationId: conversation._id,
            });
            res.status(HttpStatus.StatusCodes.OK).json({
                message: "Messages returned",
                messages,
            });
        }
    },

    SendMessage(req, res) {
        const senderId = req.params.senderId; // given from the route
        const receiverId = req.params.receiverId;
        // check if both users had a conversation before
        Conversation.find(
            {
                $or: [
                    // check if any of them sent a message to the other
                    {
                        participants: {
                            $elemMatch: {
                                senderId: senderId,
                                receiverId: receiverId,
                            },
                        },
                    },
                    {
                        participants: {
                            $elemMatch: {
                                senderId: receiverId,
                                receiverId: senderId,
                            },
                        },
                    },
                ],
            },
            async (err, result) => {
                if (result.length > 0) {
                    // they already talked
                    // update message array
                    await Message.updateOne(
                        {
                            // get document for those particular users convo
                            conversationId: result[0]._id,
                        },
                        {
                            $push: {
                                message: {
                                    senderId: senderId,
                                    receiverId: senderId,
                                    senderName: req.user.nickname,
                                    recieverName: req.body.receiverName,
                                    body: req.body.message,
                                    timeStamp: new Date().toLocaleString(),
                                },
                            },
                        }
                    )
                        .then(() =>
                            res.status(HttpStatus.StatusCodes.OK).json({
                                message: "message sent and added succesfully",
                            })
                        )
                        .catch((err) =>
                            res
                                .status(
                                    HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR
                                )
                                .json({ message: "failed to send message" })
                        );
                } else {
                    // first time they talked
                    const newConversation = new Conversation();
                    newConversation.participants.push({
                        senderId: senderId,
                        receiverId: receiverId,
                    });

                    const saveConversation = await newConversation.save();

                    const newMessage = new Message();
                    newMessage.conversationId = saveConversation._id;
                    newMessage.sender = req.user.nickname;
                    newMessage.receiver = req.body.receiverName;

                    newMessage.message.push({
                        senderId: senderId,
                        receiverId: senderId,
                        senderName: req.user.nickname,
                        recieverName: req.body.receiverName,
                        body: req.body.message,
                        timeStamp: new Date().toLocaleString(),
                    });

                    // update chat list array
                    // search by Id for the sender
                    await User.updateOne(
                        {
                            _id: req.user._id,
                        },
                        {
                            // push into the chat list the receiverId and msgId
                            $push: {
                                chatList: {
                                    $each: [
                                        {
                                            receiverId: req.params.receiverId,
                                            msgId: newMessage._id,
                                        },
                                    ],
                                    $position: 0,
                                },
                            },
                        }
                    );

                    // search by Id for the receiver
                    await User.updateOne(
                        {
                            _id: req.params.receiverId,
                        },
                        {
                            // push into the chat list the receiverId and msgId
                            $push: {
                                chatList: {
                                    $each: [
                                        {
                                            receiverId: req.user._id,
                                            msgId: newMessage._id,
                                        },
                                    ],
                                    $position: 0,
                                },
                            },
                        }
                    );

                    await newMessage
                        .save()
                        .then(() =>
                            res
                                .status(HttpStatus.StatusCodes.OK)
                                .json({ message: "message sent succesfully" })
                        )
                        .catch((err) =>
                            res
                                .status(
                                    HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR
                                )
                                .json({ message: "failed to send message" })
                        );
                }
            }
        );
    },
};
