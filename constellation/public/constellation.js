const socket = io();
let stars = [];
let userStar;
let isDragging = true;
const dailyDecayRate = 0.995;
const twinkleFactor = 2;

// Handle initialization from the server
socket.on('initialize', (initialStars) => {
    stars = initialStars.map(starData => createStar(
        starData.x,
        starData.y,
        starData.size,
        starData.name,
        starData.transparency,
        starData.createdAt,
        starData.rotation,
        starData.id
    ));
    createInitialConnections();
});

// Handle new star creation updates from other users
socket.on('updateConstellation', (newStar) => {
    stars.push(createStar(
        newStar.x,
        newStar.y,
        newStar.size,
        newStar.name,
        newStar.transparency,
        newStar.createdAt,
        newStar.rotation,
        newStar.id
    ));
});

// Handle star movement updates from other users
socket.on('moveStar', (updatedStar) => {
    const starIndex = stars.findIndex(star => star.id === updatedStar.id);
    if (starIndex !== -1) {
        stars[starIndex].x = updatedStar.x;
        stars[starIndex].y = updatedStar.y;
    }
});

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    background('#00082D');

    // Create the user star with a unique ID and emit it to the server
    userStar = createStar(
        width / 2,
        height / 2,
        20, // Default size
        "My Star",
        255, // Default transparency
        new Date(),
        0,
        socket.id // Unique ID from the socket connection
    );
    socket.emit('createStar', userStar);
}

function draw() {
    background('#00082D');

    // Draw existing stars and check for hover
    for (let star of stars) {
        star.updateTransparency();
        star.twinkle();
        if (star.transparency > 0) {
            star.draw();

            // Check if the mouse is hovering over the star
            if (dist(mouseX, mouseY, star.x, star.y) < 15) {
                star.showInfo();
            }
        }
    }

    // Draw and move the user's star
    if (userStar) {
        userStar.updateTransparency();
        userStar.twinkle();
        if (isDragging) {
            userStar.x = mouseX;
            userStar.y = mouseY;
            socket.emit('moveStar', userStar); // Emit position update to server
        }
        userStar.draw();

        // Check proximity to other stars and draw lines
        for (let star of stars) {
            const distance = dist(userStar.x, userStar.y, star.x, star.y);
            if (distance < 180 && star.transparency > 0) { // 180px proximity threshold
                stroke(200, 200, 0, min(userStar.transparency, star.transparency));
                line(userStar.x, userStar.y, star.x, star.y);
            }
        }
    }

    // Draw lines between initially connected stars
    for (let star of stars) {
        for (let connectedStar of star.connectedStars) {
            if (star.transparency > 0 && connectedStar.transparency > 0) {
                stroke(200, 200, 0, min(star.transparency, connectedStar.transparency));
                line(star.x, star.y, connectedStar.x, connectedStar.y);
            }
        }
    }
}

// Function to create initial connections between stars within 180px of each other
function createInitialConnections() {
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const distance = dist(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
            if (distance < 180) { // 180px threshold
                stars[i].connectedStars.push(stars[j]);
                stars[j].connectedStars.push(stars[i]);
            }
        }
    }
}

// Function to create a star with specified properties, including a unique ID
function createStar(x, y, size, name, transparency, createdAt = new Date().toISOString(), rotation = 0, id = socket.id) {
    return {
        x,
        y,
        size,
        name,
        transparency,
        initialTransparency: transparency,
        createdAt: new Date(createdAt),
        rotation,
        id,
        connectedStars: [],
        draw() {
            noStroke();
            fill(255, 255, 0, this.transparency);
            push();
            translate(this.x, this.y);
            rotate(this.rotation);
            starShape(0, 0, this.twinklingSize / 2, this.twinklingSize, 5);
            pop();
        },
        updateTransparency() {
            const daysPassed = (new Date() - this.createdAt) / (1000 * 60 * 60 * 24);
            this.transparency = this.initialTransparency * Math.pow(dailyDecayRate, daysPassed);
            if (this.transparency < 0.5) this.transparency = 0;
        },
        twinkle() {
            this.twinklingSize = this.size + sin(frameCount * 0.1) * twinkleFactor;
        },
        showInfo() {
            const daysSinceCreation = Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
            fill(255);
            textSize(12);
            text(`${this.name} - ${daysSinceCreation} days`, this.x + 10, this.y - 10);
        }
    };
}

// Detach the user star when the space bar is pressed
function keyPressed() {
    if (key === ' ') {
        isDragging = !isDragging;
    }
}

// Function to draw a star shape
function starShape(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

// Clear stored star data when going back to the first page
function resetStar() {
    localStorage.removeItem('userStar');
}