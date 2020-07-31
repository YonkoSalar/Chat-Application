/* Socket.io we have t0 use this since we need realtime communication*/
const express = require('express');
const socketio = require('socket.io');
const http = require('http');

//Gets access to the users.js file
const { addUser, removeUser, getUser, getUserInRoom, getUsersInRoom} = require('./users.js');


const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// This will open and close connection from the client
io.on('connection', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const { error, user} = addUser({id: socket.id, name, room});

        if(error){
            return callback(error);
        }

        //Message to new user has entered the room
        //With emit it will display it to the frontend
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room`});

        //This will alert everyone that a new user has joined
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`})

        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback();
    });

    //Expext the event from the backend
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { user: user.name, users: getUsersInRoom(user.room) });


        callback();

    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left..`})
        }
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));