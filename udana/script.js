// Define the color transitions in an array
const colors = [
  { r: 101, g: 55, b: 15 },   // Dark Brown (adjusted to be darker)
  { r: 0, g: 128, b: 0 },     // Green
  { r: 128, g: 128, b: 128 }, // Gray
  { r: 135, g: 206, b: 235 }, // Light Blue (Sky Blue)
  { r: 255, g: 255, b: 255 }, // White
  { r: 135, g: 206, b: 250 }, // Light Blue (close to white, avoids purple)
  { r: 0, g: 0, b: 255 },     // Blue
  { r: 0, g: 0, b: 139 },     // Dark Blue
  { r: 0, g: 0, b: 0 }        // Black
];

// Variable to store fetched geolocation data
let geolocationData = {};
let starChartUrl = ""; // Variable para almacenar la URL del Star Chart

// Función para obtener datos de geolocalización de la primera API
async function fetchGeolocationData() {
  const apiKey = 'bd5c877df0974c64ba4a6e0d47eb26a2';
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log("Geolocation Data:", data);

    // Almacenar datos de geolocalización
    geolocationData = data;

    // Llamar a la función para obtener la imagen del Star Chart
    await fetchStarChart(data.latitude, data.longitude);
  } catch (error) {
    console.error("Failed to fetch geolocation data", error);
  }
}

// Función para obtener datos de la carta estelar de la segunda API usando latitud y longitud
async function fetchStarChart(latitude, longitude) {
  const url = "https://api.astronomyapi.com/api/v2/studio/star-chart";
  const apiKey = "3230dc54-3d55-4cca-b89a-977af275a135";
  const applicationSecret = "9ca57b04eb6b07e4bba637d0848560a612356930fa3f7f465800ab9208e960c1999aa16c5fc8de08c75b1a4ca1497dfbfa94bb7bb640bc9de6625d816d6f2a7c70693829b2077af8ad70e301f8fbe0bc0e1f613f95ed528c474d1f77f0986a1eb8122efa8debd2f40b94a22dbe61e3b1";
  const authHeader = `Basic ${btoa(`${apiKey}:${applicationSecret}`)}`;

  const data = JSON.stringify({
    style: "default",
    observer: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      date: new Date().toISOString().split("T")[0]  // Usa la fecha de hoy
    },
    view: {
      type: "area",
      parameters: {
        position: {
          equatorial: {
            rightAscension: 0,
            declination: 0
          }
        },
        zoom: 6
      }
    }
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: data
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    console.log("Star Chart Data:", result);

    // Almacenar la URL de la carta estelar
    starChartUrl = result.data.imageUrl;

    // Mostrar la imagen de la carta estelar en la página
    displayStarChart();
  } catch (error) {
    console.error("Failed to fetch star chart data", error);
  }
}

// Función para mostrar la imagen del Star Chart en el segmento negro
function displayStarChart() {
  if (starChartUrl) {
    const starChartImage = document.getElementById("star-chart");
    starChartImage.src = starChartUrl;
    starChartImage.style.display = "block"; // Mostrar la imagen
  }
}

// Función para realizar la transición de la imagen a p5.js
function fadeOutAndShowP5() {
  const starChartImage = document.getElementById("star-chart");
  let opacity = 1;

  // Disminuir gradualmente la opacidad
  const fadeOut = setInterval(() => {
    if (opacity <= 0) {
      clearInterval(fadeOut);
      starChartImage.style.display = "none"; // Ocultar la imagen
      document.getElementById("p5-container").style.display = "block"; // Mostrar el canvas de p5.js
    }
    starChartImage.style.opacity = opacity;
    opacity -= 0.05;
  }, 100);
}

// Llamar a la función para obtener datos de geolocalización
fetchGeolocationData();

window.onscroll = function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  // Calcular el porcentaje de scroll de arriba a abajo (inverso)
  let scrollPercentage = scrollTop / maxScroll;

  // Calcular los dos colores entre los que se hará la transición
  let colorIndex = Math.floor(scrollPercentage * (colors.length - 1));
  let nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);

  let startColor = colors[colorIndex];
  let endColor = colors[nextColorIndex];

  // Calcular el porcentaje local de scroll entre los dos colores
  let localPercentage = (scrollPercentage * (colors.length - 1)) % 1;

  // Interpolar entre los dos colores
  let currentColor = {
    r: Math.floor(startColor.r + (endColor