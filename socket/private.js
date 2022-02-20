// to learn more about socket.io emits:
// https://socket.io/docs/v3/emit-cheatsheet/
module.exports = function (io) {
    // connection event is a global event
    io.on("connection", (socket) => {
        // listen for when user joins chat
        socket.on("join chat", (params) => {
            socket.join(params.room1);
            socket.join(params.room2);
        });

        // listen for typing in chat
        // only data.receiver user will be able to hear this event
        socket.on("start_typing", (data) => {
            io.to(data.reciever).emit("is_typing", data);
        });

        socket.on("stop_typing", (data) => {
            io.to(data.reciever).emit("has_stopped_typing", data);
        });
    });
};
