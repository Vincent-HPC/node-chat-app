const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {
    generateMessage
} = require('./utils/message');
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


    // socket.emit from Admin text Welcome to the chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.emit from Admin text New user joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

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
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server.');

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });


    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
