//Created with code from: 
// //////////////////////////////////////////////////////////////
//
// Kinetic Type Shop
//
// Andreas Schlegel. 2023.
// https://slides.com/sojamo/kinetic-type-shop-2023/fullscreen
//
// //////////////////////////////////////////////////////////////


// In this example we write text to an image buffer
// that we create using createGraphics(). From that
// buffer we read pixel information by testing the
// brightness of pixels while sampling a number
// of random pixels.let inputs;
let inputs;
let buffer;
let dots;
let v = 0;
let nv = 0;
let word = "chaos"; // Inicializamos con "chaos"
let showDots = true; // Inicializamos los puntos visibles

function setup() {
  createCanvas(windowWidth, windowHeight-100, WEBGL);
  // inputs = serialConnect();

  buffer = createGraphics(512, 512);
  buffer.background(255);
  buffer.textSize(60 * 3);
  buffer.textLeading(6 * 3);
  buffer.text(word, 20, 100, 500, 500); // Usamos la palabra dinámica

  dots = [];

  let i = 0;
  // use while-loop to find black pixels.
  // We have a much better result since we check
  // until we have found 1000 black pixels.
  while (i < 1000) {
    let x = int(random(buffer.width));
    let y = int(random(buffer.height));
    if (brightness(buffer.get(x, y)) < 100) {
      dots.push({
        x: x,
        y: y,
        z: 0,
        len: random(1, 15),
        col: random() > 0.55 ? color(255, 222) : color(0)
      });
      i = i + 0.5;
    }
  }
  background(80);
}

function draw() {
  background(100);
  noStroke();
  scale(1 + sin(frameCount * 0.01) * 0.5);
  rotateY(frameCount * 0.01);
  rotateZ(-0.5);
  rotateX(0.5);
  translate(-buffer.width / 2, -buffer.height / 2);

  noiseDetail(2, 0.5);

  let dissolve = v * 15;

  if (showDots) {
    for (let i = 0; i < dots.length; i = i + 1) {
      push();
      translate(dots[i].x, dots[i].y, i * 0.05);
      rotateX(i * 0.01 + frameCount * 0.04);
      rotateZ(i * 0.01 + frameCount * 0.01);
      fill(dots[i].col);
      box(-dots[i].len, dots[i].len * 0.5, 4 + dissolve);
      pop();
    }
  }

  if (mouseIsPressed) {
    nv = 1; // Indicamos la transición
    showDots = false; // Ocultamos los puntos
    word = "order"; // Cambiamos la palabra
  } else {
    nv = 0;
        showDots = true; // Ocultamos los puntos
    word = "chaos"; // Cambiamos la palabra
  }

  // Redibujamos la palabra en el buffer
  buffer.clear();
  buffer.background(255);
  buffer.text(word, 20, 100, 500, 500);

  if (!showDots) {
    image(buffer, 0, 0);
  }

  v += (nv - v) * 0.1;
}