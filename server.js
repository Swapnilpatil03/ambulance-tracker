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

app.get('/admin.html', (req, res) => {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin: Ambulance Tracker</title>
            <script src="https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}"></script>
        </head>
        <body>
            <h1>Admin: Ambulance Tracker</h1>
            <div id="map" style="width: 100%; height: 500px;"></div>
            <script>
                // Map initialization code here
            </script>
        </body>
        </html>
    `);
});

