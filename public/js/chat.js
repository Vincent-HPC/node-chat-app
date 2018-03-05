var socket = io();

function scrollToBottom() {
    // Selectors
    var message = jQuery('#messages');
    var newMessage = message.children('li:last-child'); // let u write a selector specific to the children of the message
    // Heights
    var clientHeight = message.prop('clientHeight');
    // call a prop method whcih gives us a cross-browser way to fetch a property
    var scrollTop = message.prop('scrollTop');
    var scrollHeight = message.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight(); //this will calculate the height of the message taking into account the padding
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // scrollTop() is the jQuery method for setting that scroll top value
        message.scrollTop(scrollHeight); // move to the bottom of the msg area over inside of browser
    }
}

// same as in server.js
// () no socket arg. since we already have it above
// change arrow func to normal func form,deu to make sure
// it works on safari. firefox, mobile client
socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    })
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>'); //orderList

    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
})

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();


    // // Using jQuery to create an element, modify that element
    // // and markup making it visible
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // //use a query to select that new element we created, append to the ID of "messages"
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();


    // var li = jQuery('<li></li>');
    // // target="_blank" -> tell the browser to open up to URL any new tab
    // var a = jQuery('<a target="_blank">My current location</a>');
    //
    // li.text(`${message.from} ${formattedTime}: `);
    // // u can set and fetch attributes on jQuery selected elements
    // a.attr('href', message.url); //<-- set the herf attr. of a
    // // This way prevents any malicious behavior if someone tries to inject html
    // // they shouldn't be injecting.
    //
    // li.append(a);
    // jQuery('#messages').append(li);
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
