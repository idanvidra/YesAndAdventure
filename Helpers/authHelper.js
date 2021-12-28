const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
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

// protect routes so only registered and logged in users
// are accessing the routes
module.exports = {
    VerifyToken: (req, res, next) => {
        // if (!req.headers.authorization) {
        //     return res
        //         .status(HttpStatus.StatusCodes.UNAUTHORIZED)
        //         .json({ message: "No authorization" });
        // }
        const token =
            req.cookies.auth || req.headers.authorization.split(" ")[1];

        // check if there is a token
        // if there is no token
        if (!token) {
            return res
                .status(HttpStatus.StatusCodes.FORBIDDEN)
                .json({ message: "No token provided - login for access" });
        }

        // if there is a token
        // verify the token
        return jwt.verify(
            token,
            dbConfig.secretForAuthToken,
            (err, decoded) => {
                if (err) {
                    if (err.expiredAt < new Date()) {
                        return res
                            .status(
                                HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR
                            )
                            .json({
                                message:
                                    "Token timed out - login again for access ",
                                token: null,
                            });
                    }
                    next();
                }
                // after validating that the token is valid
                // we get the user data (contains the user object)
                req.user = decoded.data;
                next();
            }
        );
    },
};
