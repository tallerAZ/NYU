let mapImage;
let points = []; // Almacena las coordenadas de los puntos creados

function preload() {
  // Intenta cargar la imagen map.png
  mapImage = loadImage(
    'assets/map.png',
    () => console.log('Image loaded successfully'), // Éxito
    () => console.log('Failed to load image') // Error
  );
}

function setup() {
  // Crea un canvas de 400x400 dentro de #p5-container
  const canvas = createCanvas(400, 400);
  canvas.parent('p5-container'); // Adjuntar el canvas al contenedor
}

function draw() {
  background(255); // Fondo blanco por defecto
  if (mapImage) {
    // Dibuja la imagen ajustada al canvas si está cargada
    image(mapImage, 0, 0, width, height);
  } else {
    // Muestra un mensaje si la imagen no se carga
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Image not loaded', width / 2, height / 2);
  }

  // Dibuja los puntos en las coordenadas almacenadas
  fill(255, 0, 0); // Color rojo
  noStroke(); // Sin borde
  for (let point of points) {
    ellipse(point.x, point.y, 5, 5); // Dibuja el círculo en cada coordenada
  }
}

function mousePressed() {
  // Verifica si el clic ocurrió dentro del canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // Agrega las coordenadas del clic al array de puntos
    points.push({ x: mouseX, y: mouseY });

    // Genera un log con las coordenadas exactas
    console.log(`Point added at (${mouseX}, ${mouseY})`);
  }
}