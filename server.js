const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIo(server);

// Serve static files from the "public" directory (i.e., admin.html and user.html)
app.use(express.static('public'));

// Listen for client connections via Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for ambulance location updates from the user
    socket.on('ambulance-location', (location) => {
        console.log('Received ambulance location:', location);
        // Broadcast the location to all connected clients (admin pages)
        io.emit('ambulance-location', location);
    });

    // Listen for stop ambulance signal from the user
    socket.on('stop-ambulance', () => {
        console.log('Ambulance tracking stopped');
        // Notify all connected clients (admin pages) to remove the marker
        io.emit('stop-ambulance');
    });

    // Handle client disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
