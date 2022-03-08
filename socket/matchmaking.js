// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/
module.exports = function (io, Player, _) {
    const playerData = new Player();

    // connection event is a global event
    io.on("connection", (socket) => {
        // listen for when player is ready to play
        socket.on("ready_to_play", (params) => {
            // console.log(
            //     params.nickname + " ready to play in room: " + params.room
            // );
            socket.join(params.room);
            playerData.EnterRoom(socket.id, params.nickname, params.room);
            // get list of nicknames of all ready to play players
            const list = playerData.GetList(params.room);
            // emit the ready event
            io.emit("playersReadyToPlay", _.uniq(list));
            // console.log(_.uniq(list));
        });

        // listen for when ready to play player has joined game
        socket.on("already_playing", () => {
            const player = playerData.RemoveUser(socket.id);
            console.log(playerData.GetUserId(socket.id));
            console.log(player);
            if (player) {
                const playerArray = playerData.GetList(player.room);
                const arr = _.uniq(playerArray);
                _.remove(arr, (n) => n === player.nickname);
                console.log("here");
                io.emit("playersReadyToPlay", arr);
            }
        });
    });
};
