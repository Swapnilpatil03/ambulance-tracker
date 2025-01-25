const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public'))); // Assuming your HTML files are in 'public' directory
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve user.html
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Handle ambulance location updates
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for ambulance location from user
    socket.on('ambulance-location', (location) => {
        console.log('Ambulance location received:', location);
        // Broadcast the location to all connected clients (admins)
        io.emit('ambulance-location', location);
    });

    // Listen for stop ambulance signal
    socket.on('stop-ambulance', () => {
        console.log('Ambulance tracking stopped');
        // Notify all connected clients (admins) to remove the marker
        io.emit('stop-ambulance');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
