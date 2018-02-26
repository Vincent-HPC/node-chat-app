var socket = io();

// same as in server.js
// () no socket arg. since we already have it above
// change arrow func to normal func form,deu to make sure
// it works on safari. firefox, mobile client
socket.on('connect', function() {
    console.log('Connected to server');

    // // call emit right here inside of connect callback func.
    // // cuz don't want emit the event until we are connected socket.
    // // Can pass any data in as the second argument.
    // socket.emit('createEmail', {
    //     to: 'jen@example.com',
    //     text: 'Hey. This is Andrew.'
    // });
    //
    // // When emmiting a custom events, 1st arg. is the event name, 2nd is the data
    // socket.emit('createMessage', {
    //     from: 'jen',
    //     text: 'This message is sent from cliet'
    // });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

// socket.on('newEmail', function(email) {
//     console.log('New email', email);
// });

socket.on('newMessage', function(message) {
    console.log('New message', message);
});
