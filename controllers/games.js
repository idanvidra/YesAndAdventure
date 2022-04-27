const Joi = require("joi");
const httpStatus = require("http-status-codes");
const Game = require("../models/gameModel");
const User = require("../models/userModel");

module.exports = {
    // function for saving game
    AddGame(req, res) {
        // schema for the saving game
        // Joi checks if the form was filled out correctly
        const schema = Joi.object().keys({
            game: Joi.string().required(),
        });

        // display error if the form was not filled out correctly
        const { error } = schema.validate(req.body);
        if (error && error.details) {
            return res
                .status(httpStatus.StatusCodes.BAD_REQUEST)
                .json({ msg: error.details });
        }

        const body = {
            player: req.user._id,
            nickname: req.user.nickname,
            game: req.body.game,
            created: new Date(),
        };

        // add game to the DB
        Game.create(body)
            .then(async (game) => {
                // add game to player
                await User.updateOne(
                    {
                        _id: body.player,
                    },
                    {
                        $set: {
                            games: {
                                gameId: game._id,
                                game: body.game,
                                created: new Date(),
                            },
                        },
                    }
                );
                res.status(httpStatus.StatusCodes.OK).json({
                    message: "Game created",
                    game,
                });
            })
            .catch((err) => {
                res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Could not create game",
                });
            });
    },

    // get all the games saved by player
    async GetAllGames(req, res) {
        try {
            const games = await Game.find({})
                .populate("player") // return all the games by this player
                .sort({ created: -1 }); // sort by date created: newest -> oldest
            return res
                .status(httpStatus.StatusCodes.OK)
                .json({ message: "All games retrieved", games });
        } catch (err) {
            return res
                .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to retrieve all games", err });
        }
    },

    // get single game by ID
    async GetGame(req, res) {
        await Game.findOne({ _id: req.params.id })
            .populate("player")
            .then((game) => {
                res.status(httpStatus.StatusCodes.OK).json({
                    message: "Game found",
                    game,
                });
            })
            .catch((err) =>
                res
                    .status(httpStatus.StatusCodes.NOT_FOUND)
                    .json({ message: "Game not found", err })
            );
    },
};
