let stars = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop(); // Solo dibujar las estrellas cuando se llegue al final del scroll
}

function draw() {
    background(0);
    for (let star of stars) {
        fill(255);
        ellipse(star.x, star.y, star.size, star.size);
    }
}

function addStars(data) {
    stars = [];
    for (let i = 0; i < data.length; i++) {
        stars.push({
            x: random(width),
            y: random(height),
            size: random(2, 5)
        });
    }
    redraw();
}

// Detectar cuando llegas al final del scroll y activar el dibujo de estrellas
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTop / docHeight > 0.9) {
        loadStars(); // Cargar datos de las estrellas
    }
});

// Cargar datos de estrellas desde un API basado en la ubicación IP
function loadStars() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            return fetch(`https://api.example.com/stars?ip=${ip}`);
        })
        .then(response => response.json())
        .then(starData => {
            addStars(starData);
        })
        .catch(error => console.error('Error fetching stars:', error));
}