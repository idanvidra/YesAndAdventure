// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/
module.exports = function (io, User, _) {
    const userData = new User();

    // connection event is a global event
    io.on("connection", (socket) => {
        socket.on("refresh", (data) => {
            io.emit("refreshPage", {});
        });

        // listen to user online event
        socket.on("online", (data) => {
            socket.join(data.room);
            userData.EnterRoom(socket.id, data.nickname, data.room);
            // get list of nicknames of all connected users
            const list = userData.GetList(data.room);
            // emit the online event
            io.emit("usersOnline", _.uniq(list));
        });

        // listen to user disconnect event
        socket.on("disconnect", () => {
            const user = userData.RemoveUser(socket.id);
            if (user) {
                const userArray = userData.GetList(user.room);
                const arr = _.uniq(userArray);
                _.remove(arr, (n) => n === user.nickname);
                io.emit("usersOnline", arr);
            }
        });
    });
};
