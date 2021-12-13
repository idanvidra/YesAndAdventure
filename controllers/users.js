const httpStatus = require("http-status-codes");
const User = require("../models/userModel");

module.exports = {
    async GetAllUsers(req, res) {
        await User.find({})
            .populate("games.gameId")
            .then((result) => {
                res.status(httpStatus.StatusCodes.OK).json({
                    message: "Got all users successfully",
                    result,
                });
            })
            .catch((err) => {
                res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Couldn't return all users",
                    err,
                });
            });
    },

    async GetUserById(req, res) {
        await User.findOne({ _id: req.params.id })
            .populate("games.gameId")
            .then((result) => {
                res.status(httpStatus.StatusCodes.OK).json({
                    message: "Got user by id successfully",
                    result,
                });
            })
            .catch((err) => {
                res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Couldn't return user by id",
                    err,
                });
            });
    },

    async GetUserByNickname(req, res) {
        await User.findOne({ nickname: req.params.nickname })
            .populate("games.gameId")
            .then((result) => {
                res.status(httpStatus.StatusCodes.OK).json({
                    message: "Got user by nickname successfully",
                    result,
                });
            })
            .catch((err) => {
                res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Couldn't return user by nickname",
                    err,
                });
            });
    },
};
