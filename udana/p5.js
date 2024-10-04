let canvas;

// Configuración inicial de p5.js
function setup() {
  // Crear un canvas que se ajuste al contenedor "p5-container"
  canvas = createCanvas(800, 800);
  canvas.parent('p5-container');  // Vincular el canvas al contenedor específico
  noLoop();  // Dibujar una sola vez y detener el bucle para optimizar
}

// Dibujo inicial de la carta estelar (placeholder)
function draw() {
  // Fondo negro para simular el segmento negro del HTML
  background(0);

  // Configurar el color del texto y estilo
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);

  // Dibujar un título de referencia en el centro
  text("Carta Estelar Personalizada", width / 2, height / 2);

  // Dibujar algunas estrellas de ejemplo
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let starSize = random(2, 5);
    ellipse(x, y, starSize, starSize);
  }
}

// Función opcional para redibujar la carta estelar con información dinámica
function updateStarChart(data) {
  background(0);  // Limpiar el canvas con fondo negro
  fill(255);
  textSize(16);
  text(`Latitud: ${data.latitude}`, width / 2, height / 3);
  text(`Longitud: ${data.longitude}`, width / 2, height / 2);

  // Aquí se pueden añadir más detalles según la información disponible
  // También se podrían usar diferentes formas o gráficos según los datos
}