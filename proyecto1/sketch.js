let starChartImg; // Variable para almacenar la imagen de la carta estelar
let starChartUrl = ""; // Variable para almacenar la URL de la imagen
let alpha = 0; // Controlar la opacidad de la imagen
let scaleFactor = 0.5; // Factor de escalado inicial para la imagen

function preload() {
  // Precargar la imagen usando la URL si ya está disponible
  if (starChartUrl) {
    starChartImg = loadImage(starChartUrl);
  }
}

function setup() {
  // Crear el canvas para que ocupe todo el tamaño de la ventana del navegador
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-container"); // Asociar el canvas al contenedor
  noLoop(); // No redibujar constantemente
}

function draw() {
  background(0); // Fondo negro para hacer resaltar la imagen

  // Si la imagen de la carta estelar está disponible, dibujarla con disolvencia
  if (starChartImg) {
    // Aumentar la opacidad hasta 255 para la animación de disolvencia
    if (alpha < 255) {
      alpha += 5; // Velocidad de disolvencia (ajustar según sea necesario)
    }

    // Aumentar el factor de escala hasta 1 para agrandar la imagen
    if (scaleFactor < 1) {
      scaleFactor += 0.01; // Velocidad de escalado (ajustar según sea necesario)
    }

    // Ajustar la opacidad de la imagen
    tint(255, alpha); // Aplicar la opacidad

    // Dibujar la imagen escalada y centrada en el canvas
    const imgWidth = starChartImg.width * scaleFactor;
    const imgHeight = starChartImg.height * scaleFactor;
    image(starChartImg, (width - imgWidth) / 2, (height - imgHeight) / 2, imgWidth, imgHeight);

    // Redibujar para animar la disolvencia y el escalado
    if (alpha < 255 || scaleFactor < 1) {
      requestAnimationFrame(draw);
    }
  }
}

// Función para actualizar la imagen una vez que se obtenga la URL del API
function updateStarChartImage(url) {
  starChartUrl = url;

  // Precargar la imagen y volver a dibujar el canvas con la nueva imagen
  starChartImg = loadImage(starChartUrl, () => {
    alpha = 0; // Reiniciar opacidad
    scaleFactor = 0.5; // Reiniciar factor de escalado
    redraw(); // Redibujar el canvas con la nueva imagen
  });
}

// Función para manejar cambios de tamaño de la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Ajustar el tamaño del canvas al tamaño de la ventana
  if (starChartImg) {
    redraw(); // Redibujar la imagen en el nuevo tamaño
  }
}