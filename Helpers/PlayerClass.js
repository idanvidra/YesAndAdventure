class Player {
    // whenever a user connects to a socket
    // an id is assigned to the particular user

    constructor() {
        this.globalArray = [];
    }

    // add user to globalArray when a user connects
    // input: socket id, user nickname and room user is connecting to
    // output: user object
    EnterRoom(id, nickname, room) {
        // shorthand user object creation
        const user = { id, nickname, room };
        this.globalArray.push(user);
        return user;
    }

    // input: user id
    // ouput: socket id for the user
    GetUserId(id) {
        // filter through array and return filter
        const socketId = this.globalArray.filter(
            (userId) => userId.id === id
        )[0];
        return socketId;
    }

    // remove user from globalArray when he disconnects
    RemoveUser(id) {
        // search for user in globalArray
        const user = this.GetUserId(id);
        // if he exists, filter him out of the array
        if (user) {
            this.globalArray = this.globalArray.filter(
                (userId) => userId.id !== id
            );
        }
        return user;
    }

    // return the names of all connected users to a certain room
    GetList(room) {
        const roomName = this.globalArray.filter((user) => user.room === room);
        const names = roomName.map((user) => user.nickname);
        return names;
    }
}

module.exports = { Player };
