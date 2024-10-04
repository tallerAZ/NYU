let starChartImg; // Variable para almacenar la imagen de la carta estelar
let starChartUrl = ""; // Variable para almacenar la URL de la imagen

function preload() {
  // Precargar la imagen usando la URL si ya está disponible
  if (starChartUrl) {
    starChartImg = loadImage(starChartUrl);
  }
}

function setup() {
  // Crear el canvas para que ocupe todo el tamaño del contenedor
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-container"); // Asociar el canvas al contenedor
  noLoop(); // No redibujar constantemente
}

function draw() {
  // Si la imagen de la carta estelar está disponible, dibujarla
  if (starChartImg) {
    image(starChartImg, 0, 0, windowWidth, windowHeight); // Dibujar la imagen en el canvas
  }
}

// Función para actualizar la imagen una vez que se obtenga la URL del API
function updateStarChartImage(url) {
  starChartUrl = url;
  // Precargar la imagen y volver a dibujar el canvas
  starChartImg = loadImage(starChartUrl, () => {
    redraw(); // Redibujar el canvas con la nueva imagen
  });
}

// Función para manejar cambios de tamaño de la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Ajustar el tamaño del canvas
  if (starChartImg) {
    image(starChartImg, 0, 0, windowWidth, windowHeight); // Redibujar la imagen en el nuevo tamaño
  }
}