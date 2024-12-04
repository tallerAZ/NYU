const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Ruta de piezas
app.get('/pieces', (req, res) => {
  const pieces = JSON.parse(fs.readFileSync('./data/pieces.json', 'utf-8'));
  res.json(pieces);
});

// Ruta para detalles de una pieza
app.get('/pieces/:id', (req, res) => {
  const pieces = JSON.parse(fs.readFileSync('./data/pieces.json', 'utf-8'));
  const piece = pieces.find(p => p.id === req.params.id);
  if (piece) {
    res.json(piece);
  } else {
    res.status(404).send('Pieza no encontrada');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});