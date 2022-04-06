// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/

// const Semaphore = require("semaphore-async-await").Lock;
// import { Lock } from "semaphore-async-await";

module.exports = function (io, Player, _) {
    const playerData = new Player();

    const async = require("async");

    const queue = async.queue((task, completed) => {
        console.log("Currently Busy Processing Task " + task);

        // Simulating a Complex task
        setTimeout(() => {
            // The number of tasks to be processed
            const remaining = queue.length();
            completed(null, { task, remaining });
        }, 500);
    }, 1); // The concurrency value is 1

    // async await
    // async function criticalFunc(socket, playerData, params, io) {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             socket.join(params.room);
    //             playerData.EnterRoom(socket.id, params.nickname, params.room);
    //             // get list of nicknames of all ready to play players
    //             const list = playerData.GetList(params.room);
    //             // emit the ready event
    //             io.emit("playersReadyToPlay", _.uniq(list));
    //             // check if there is more then one player ready
    //             if (_.uniq(list).length > 1) {
    //                 const firstTwoPlayersInQueue = _.uniq(list).slice(0, 2);
    //                 // console.log(firstTwoPlayersInQueue[0], firstTwoPlayersInQueue[1]);
    //                 // remove the matched players
    //                 const player_1 = playerData.RemoveUserByNickname(
    //                     firstTwoPlayersInQueue[0]
    //                 );
    //                 const player_2 = playerData.RemoveUserByNickname(
    //                     firstTwoPlayersInQueue[0]
    //                 );
    //                 // console.log("two players 1");
    //                 io.emit("matchmaking", firstTwoPlayersInQueue);
    //             }
    //             resolve("foo");
    //         }, 300);
    //     });
    // }
    // const lock = new Semaphore(1);

    // connection event is a global event
    io.on("connection", (socket) => {
        // listen for when player is ready to play
        socket.on("ready_to_play", (params) => {
            // socket.join(params.room);
            // playerData.EnterRoom(socket.id, params.nickname, params.room);
            // // get list of nicknames of all ready to play players
            // const list = playerData.GetList(params.room);
            // // emit the ready event
            // io.emit("playersReadyToPlay", _.uniq(list));
            // // check if there is more then one player ready
            // if (_.uniq(list).length > 1) {
            //     const firstTwoPlayersInQueue = _.uniq(list).slice(0, 2);
            //     console.log(
            //         firstTwoPlayersInQueue[0],
            //         firstTwoPlayersInQueue[1]
            //     );
            //     // remove the matched players
            //     const player_1 = playerData.RemoveUserByNickname(
            //         firstTwoPlayersInQueue[0]
            //     );
            //     const player_2 = playerData.RemoveUserByNickname(
            //         firstTwoPlayersInQueue[0]
            //     );
            //     // console.log("two players 1");
            //     io.emit("matchmaking", firstTwoPlayersInQueue);
            // }

            queue.push(params.nickname, (error, { task, remaining }) => {
                if (error) {
                    console.log(
                        `An error occurred while processing task ${task}`
                    );
                } else {
                    console.log(
                        `Finished processing task ${task}. ${remaining} tasks remaining`
                    );
                    socket.join(params.room);
                    playerData.EnterRoom(
                        socket.id,
                        params.nickname,
                        params.room
                    );
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
                }
            });

            // async await - look in server aswell
            // async function critical() {
            //     await lock.acquire();
            //     await criticalFunc(socket, playerData, params, io);
            //     lock.release();
            // }
            // critical();
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
