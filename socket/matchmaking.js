// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/

const Mutex = require("await-semaphore");

module.exports = function (io, Player, _) {
    var mutex = new Mutex.Mutex();
    async function do_something() {
        console.log("do something");
        return new Promise((resolve) => {
            console.log("promise");
        });
    }

    const playerData = new Player();

    // connection event is a global event
    io.on("connection", (socket) => {
        // listen for when player is ready to play
        socket.on("ready_to_play", (params) => {
            socket.join(params.room);
            playerData.EnterRoom(socket.id, params.nickname, params.room);
            // get list of nicknames of all ready to play players
            const list = playerData.GetList(params.room);
            // emit the ready event
            io.emit("playersReadyToPlay", _.uniq(list));
            // check if there is more then one player ready
            if (_.uniq(list).length > 1) {
                const firstTwoPlayersInQueue = _.uniq(list).slice(0, 2);
                console.log(
                    firstTwoPlayersInQueue[0],
                    firstTwoPlayersInQueue[1]
                );
                // remove the matched players
                const player_1 = playerData.RemoveUserByNickname(
                    firstTwoPlayersInQueue[0]
                );
                const player_2 = playerData.RemoveUserByNickname(
                    firstTwoPlayersInQueue[0]
                );
                // console.log("two players 1");
                io.emit("matchmaking", firstTwoPlayersInQueue);
            }

            // function niceFetch(url) {
            //     if (_.uniq(list).length > 1) {
            //         const firstTwoPlayersInQueue = _.uniq(list).slice(0, 2);
            //         console.log(
            //             firstTwoPlayersInQueue[0],
            //             firstTwoPlayersInQueue[1]
            //         );
            //         // remove the matched players
            //         const player_1 = playerData.RemoveUserByNickname(
            //             firstTwoPlayersInQueue[0]
            //         );
            //         const player_2 = playerData.RemoveUserByNickname(
            //             firstTwoPlayersInQueue[0]
            //         );
            //         // console.log("two players 1");
            //         io.emit("matchmaking", firstTwoPlayersInQueue);
            //     }
            //     return mutex.use(() => do_something());
            // }
            // niceFetch();
        });

        // listen for when ready to play player has joined game
        socket.on("already_playing", (nickname) => {
            const player = playerData.RemoveUserByNickname(nickname);
            if (player) {
                const playerArray = playerData.GetList(player.room);
                const arr = _.uniq(playerArray);
                _.remove(arr, (n) => n === player.nickname);
                io.emit("playersReadyToPlay", arr);
            }
        });
    });
};
