let starName = 'your star';
let starSize = 10;
let starColor = 255;
let baseSize = 10; // The initial star size
let twinkleFactor = 2; // Controls how much the star pulses

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('canvas-container'); // Attach canvas to the specified div
    noStroke();

    document.getElementById('name-input').addEventListener('input', (event) => {
        starName = event.target.value || 'your star';
        document.getElementById('star-name').innerText = starName;
    });

    document.getElementById('color-slider').addEventListener('input', (event) => {
        starColor = event.target.value;
    });
    document.getElementById('size-slider').addEventListener('input', (event) => {
        baseSize = parseFloat(event.target.value);
    });
}

function draw() {
    background(0, 8, 45); // Matching #00082D in RGB
    fill(starColor, starColor, 0);
    
    // Calculate twinkling effect
    let twinklingSize = baseSize + sin(frameCount * 0.1) * twinkleFactor;

    push();
    translate(width / 2, height / 2);
    rotate(radians(baseSize * 2)); // Adjust rotation based on base size
    star(0, 0, twinklingSize / 2, twinklingSize, 5);
    pop();
}

// Function to draw the star shape
function star(x, y, radius1, radius2, npoints) {
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

// Store star data in localStorage and navigate to constellation page
function launchStar() {
    const creationDate = new Date();
    const starData = {
        name: starName,
        color: starColor,
        size: baseSize,
        createdAt: creationDate.toISOString()
    };

    // Store the star data in localStorage to access it on the second page
    localStorage.setItem('userStar', JSON.stringify(starData));

    // Redirect to the constellation page
    window.location.href = 'constellation.html';
}