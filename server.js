require('dotenv').config(); // Load environment variables
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // Serve static files

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('ambulance-location', (location) => {
        console.log('Ambulance location received:', location);
        io.emit('ambulance-location', location); // Broadcast to all connected clients
    });

    socket.on('stop-ambulance', () => {
        console.log('Ambulance stopped sharing location.');
        io.emit('stop-ambulance'); // Notify all clients to stop tracking
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
