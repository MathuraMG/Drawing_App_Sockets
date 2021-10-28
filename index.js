//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 5000;

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);


io.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });

    socket.on('mousePosition', (data) => {
      io.emit('mousePosition', data);
    })

    //EXTRA - maintain a list of all people who joined
    socket.on('userJoined', (data) => {
      console.log('user joined ', data.user, ' main room ');
      io.emit('userJoined', data);
    })

});

// PRIVATE NAMESPACE
//
let private = io.of('/private');
private.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });

    //EXTRA - maintain a list of all people who joined
    socket.on('userJoined', (data) => {
      console.log('user joined ', data.user, ' main room ');
      private.emit('userJoined', data);
    })

    socket.on('room', function(data){
        let roomName = data.room;
        console.log("Create/Join Room: " + roomName);
        //Add this socket to the room
        socket.join(roomName);
        //Add a room property to the individual socket
        socket.room = roomName;
    });

    socket.on('mousePosition', (data) => {
      let roomName = socket.room;
      private.to(roomName).emit('mousePosition', data);
    })
});

server.listen(port, () => {
    console.log("Server listening at port: " + port);
});
