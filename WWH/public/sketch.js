let mapImage;
let journeyPoints = []; // Lista de puntos del recorrido (incluyendo entrada y salida)

function preload() {
    mapImage = loadImage(
        'assets/map.png',
        () => console.log('Image loaded successfully'),
        () => console.log('Failed to load image')
    );
}

function setup() {
    const canvas = createCanvas(400, 400); // Tamaño del canvas
    canvas.parent('p5-container');
    noLoop(); // Redibujar solo cuando sea necesario
}

function draw() {
    background(255); // Fondo blanco

    // Dibuja la imagen del mapa ajustada al canvas
    if (mapImage) {
        image(mapImage, 0, 0, width, height);
    } else {
        fill(255, 0, 0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text('Image not loaded', width / 2, height / 2);
    }

    if (journeyPoints.length > 0) {
        // Dibuja las líneas que conectan los puntos en orden
        stroke(0, 0, 255); // Azul
        strokeWeight(2); // Grosor de las líneas
        noFill();
        for (let i = 0; i < journeyPoints.length - 1; i++) {
            const currentPoint = journeyPoints[i];
            const nextPoint = journeyPoints[i + 1];
            line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
        }

        // Dibuja los puntos
        noStroke();
        journeyPoints.forEach((point) => {
            fill(0, 0, 255); // Azul para el círculo
            ellipse(point.x, point.y, 20, 20); // Círculo azul

            fill(255); // Blanco para los números
            textSize(12);
            textAlign(CENTER, CENTER);
            text(point.number, point.x, point.y); // Número centrado dentro del círculo
        });
    }
}

// Función para actualizar los puntos del recorrido y redibujar el canvas
function updateJourneyPoints(points) {
    journeyPoints = [
        { x: 213.3125, y: 83.046875, number: 'IN' }, // Punto de entrada
        ...points.map((point, index) => ({
            x: point[0],
            y: point[1],
            number: index + 1 // Números secuenciales
        })),
        { x: 171.8125, y: 80.046875, number: 'OUT' } // Punto de salida
    ];
    redraw();
}