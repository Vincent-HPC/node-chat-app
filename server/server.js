const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// console.log(__dirname + '/../public');
// console.log(publicPath);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // // this is not a listener so not goning to provide a callback func.
    // socket.emit('newEmail', {
    //     from: 'mike@example.com',
    //     text: 'Hey. What is going on.',
    //     createAt: 123
    // });
    //
    // // we can use an arrow func cuz in our node code.
    // socket.on('createEmail', (newEmail) => {
    //     console.log('createEmail', newEmail);
    // });
    //
    // socket.emit('newMessage', {
    //     from: 'Jack',
    //     text: 'This message is sent from Server',
    //     createdAt: new Date().getTime()
    // });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
