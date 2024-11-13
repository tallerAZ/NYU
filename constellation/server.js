const express = require('express');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

app.use(express.static('public'));

let stars = []; // Store stars data in memory

// Load initial stars from a JSON file (optional)
fs.readFile('stars.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading stars.json:', err);
    } else {
        stars = JSON.parse(data);
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current constellation data to the new user
    socket.emit('initialize', stars);

    // Listen for a new star creation
    socket.on('createStar', (newStar) => {
        stars.push(newStar); // Add new star to the server's star list
        io.emit('updateConstellation', newStar); // Broadcast to all clients
    });

    // Listen for star movement
    socket.on('moveStar', (updatedStar) => {
        const starIndex = stars.findIndex(star => star.id === updatedStar.id);
        if (starIndex !== -1) {
            stars[starIndex] = updatedStar;
            io.emit('moveStar', updatedStar); // Broadcast updated position to all clients
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});