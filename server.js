const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();
const _ = require("lodash");

// CORS is a node.js package for providing a Connect/Express middleware
// that can be used to enable CORS with various options.
app.use(cors());

// link to database
let dbConfig = null;
if (process.env.DB) {
    dbConfig = {
        urlForDB: process.env.DB,
        secretForAuthToken: process.env.SECRET,
    };
} else {
    dbConfig = require("./config/secrets");
}

// init socket.io server instance
// used to get live feedback from the nodejs server
const server = require("http").createServer(app);
// const io = require("socket.io")(server).listen(server);
const io = require("socket.io")(server);

// express middleware that passes url encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// use cookie-parser and loger
app.use(cookieParser());
app.use(logger("dev"));

// connect to DB
mongoose.Promise = global.Promise;

if (dbConfig && dbConfig.urlForDB) {
    mongoose.connect(dbConfig.urlForDB);
}

const { User } = require("./Helpers/UserClass");
const { Player } = require("./Helpers/PlayerClass");

// pass socket.io const to socket/streams.js
require("./socket/streams")(io, User, _);

// pass socket.io const to socket/private.js
require("./socket/private")(io);

const async = require("async");

const queue = async.queue((task, completed) => {
    const remaining = queue.length();
    completed(null, { task, remaining });
}, 1); // The concurrency value is 1
queue.drain(function () {
    // pass
});

// pass socket.io const to socket/matchmaking.js
require("./socket/matchmaking")(io, Player, _, queue);

// route for authentication (middleware)
const auth = require("./routes/authRoutes");
app.use("/api/adventuretime", auth);

// route for game posting - temporary (middleware)
const games = require("./routes/gameRoutes");
app.use("/api/adventuretime", games);

// route for users (middleware)
const users = require("./routes/usersRoutes");
app.use("/api/adventuretime", users);

// route for message (middleware)
const message = require("./routes/messageRoutes");
const e = require("express");
const exp = require("constants");
app.use("/api/adventuretime", message);

// deployment
app.use(express.static(path.join(__dirname, "adventure-time/")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "adventure-time/index.html"));
});

// use express server to listen on port 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Running on port 3000");
});
