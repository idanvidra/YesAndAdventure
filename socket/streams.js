// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/
module.exports = function (io) {
    io.on("connection", (socket) => {
        socket.on("refresh", (data) => {
            io.emit("refreshPage", {});
        });
    });
};
