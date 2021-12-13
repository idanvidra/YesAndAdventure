const Joi = require("joi");
const httpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const Helpers = require("../Helpers/helpers");
// link to database
let dbConfig = null;
if (process.env.DB) {
    dbConfig = {
        urlForDB: process.env.DB,
        secretForAuthToken: process.env.SECRET,
    };
} else {
    dbConfig = require("../config/secrets");
}

module.exports = {
    // function for signing up
    async createUser(req, res) {
        // schema for the authentication form
        // Joi checks if the form was filled out correctly
        const schema = Joi.object().keys({
            nickname: Joi.string().alphanum().min(3).max(30).required(),
        });

        // display error if the form was not filled out correctly
        const { error, value } = schema.validate(req.body);
        if (error && error.details) {
            return res
                .status(httpStatus.StatusCodes.BAD_REQUEST)
                .json({ msg: error.details });
        }

        // check nickname for bad words
        const isDirty = Helpers.checkForBadWords(req.body.nickname);

        // if the nickname contains bad words
        if (isDirty) {
            return res
                .status(httpStatus.StatusCodes.BAD_REQUEST)
                .json({ message: "nickname contains bad words" });
        }

        // check if nickname exists
        const nickname = await User.findOne({
            // curently we are using the nickname as given
            // we can check for all lower case or first letter uppercase
            nickname: req.body.nickname,
        });
        if (nickname) {
            return res
                .status(httpStatus.StatusCodes.CONFLICT)
                .json({ message: "nickname already exists" });
        }

        // seed for hashing - not relevant untill we choose to use passwords
        const seed = "123456";

        // hashing
        return bcrypt.hash(seed, 10, (err, hash) => {
            if (err) {
                return res
                    .status(httpStatus.StatusCodes.BAD_REQUEST)
                    .json({ message: "Error hashing nothing" });
            }
            const body = {
                nickname: value.nickname,
            };
            // save to database
            User.create(body)
                .then((user) => {
                    // generate sign token for the user using jwt
                    // allows checking if user is connected to limit access to app/website
                    // https://jwt.io/
                    const token = jwt.sign(
                        { data: user },
                        dbConfig.secretForAuthToken,
                        {
                            expiresIn: "120h",
                        }
                    );
                    // save token to cookie
                    res.cookie("auth", token);
                    res.status(httpStatus.StatusCodes.CREATED).json({
                        message: "User created successfuly",
                        user,
                        token,
                    });
                })
                .catch((err) => {
                    res.status(
                        httpStatus.StatusCodes.INTERNAL_SERVER_ERROR
                    ).json({ message: "error occured user creation" });
                });
        });
    },

    // function for signing in
    async loginUser(req, res) {
        // check to see if the login nickname is empty
        // send error if so
        if (!req.body.nickname) {
            return res
                .status(httpStatus.StatusCodes.LENGTH_REQUIRED)
                .json({ message: "no empty nickname allowed" });
        }

        await User.findOne({ nickname: req.body.nickname })
            .then((user) => {
                // if the user was not found
                if (!user) {
                    return res.status(httpStatus.StatusCodes.NOT_FOUND).json({
                        message: "nickname not found",
                    });
                }
                // if loging in is successful create a token
                // token expires in 10 seconds
                const token = jwt.sign(
                    { data: user },
                    dbConfig.secretForAuthToken,
                    {
                        expiresIn: "120h",
                        // expiresIn: "10000",
                    }
                );
                // add the token as a cookie
                res.cookie("auth", token);
                return res
                    .status(httpStatus.StatusCodes.OK)
                    .json({ message: "login successful", user, token });
            })
            // if there is an error while loging in
            .catch((err) => {
                return res
                    .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "error occured while loging in" });
            });
    },
};
