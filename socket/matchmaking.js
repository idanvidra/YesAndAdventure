// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/
module.exports = function (io, Player, _) {
    const playerData = new Player();

    // connection event is a global event
    io.on("connection", (socket) => {
        // listen for when user joins chat
        socket.on("ready_to_play", (params) => {
            console.log(
                params.nickname + " ready to play in room: " + params.room
            );
            socket.join(params.room);
            playerData.EnterRoom(socket.id, params.nickname, params.room);
            // get list of nicknames of all connected users
            const list = playerData.GetList(params.room);
            // emit the online event
            io.emit("playersReadyToPlay", _.uniq(list));
        });
    });
};
