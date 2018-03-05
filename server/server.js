const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');
const {
    isRealString
} = require('./utils/validation');
const {
    Users
} = require('./utils/users');
// console.log(__dirname + '/../public');
// console.log(publicPath);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room); //have to join by string value
        // socket.leave('The Office Fans');
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        // TWO way to specific room
        // io.emit -> io.to('The Office Fans').emit // chain on a call to emit, will send an event to everybody connected to a room
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit

        // socket.emit
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    // ************************************************ //
    // https://socket.io/docs/#sending-and-getting-data-(acknowledgements)
    //
    //
    // socket.on('formData',
    //               function(data, fn){
    //                       // data is your form data from the client side
    //                       // we are here so we got it successfully so call client callback
    //                       // incidentally(not needed in this case) send back data value true
    //                       fn(true);
    //               }
    //              );
    //
    // ************************************************ //



    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left. `));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
