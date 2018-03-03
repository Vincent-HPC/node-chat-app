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
    //Using jQuery to create an element, modify that element
    //and markup making it visible
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    //use a query to select that new element we created, append to the ID of "messages"
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    // target="_blank" -> tell the browser to open up to URL any new tab
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    // u can set and fetch attributes on jQuery selected elements
    a.attr('href', message.url); //<-- set the herf attr. of a
    // This way prevents any malicious behavior if someone tries to inject html
    // they shouldn't be injecting.

    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val(''); //clean up the message which has send
    });
});

var locationButton = jQuery('#send-location');

// same as jQuery('#send-location'), but above line save time!
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    } //  https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation/Using_geolocation

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    // It will actively get the coordinates for the user.
    // In this case it's going to find the coordinates based of the browser.
    // 1st: success func. ,get called within the location info.(postition)
    // 2nd: error func. ,error handler if something goes wrong
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        // if user denied for location request, reset and still want user try again
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    });
});
