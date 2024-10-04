// Define the color transitions in an array (declarado al inicio del archivo)
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
  
  // Variable para almacenar datos de geolocalización
  let geolocationData = {};
  let starChartUrl = "";
  
  // Funciones de geolocalización y carta estelar (mantén estas funciones tal como las tenías)
  
  // ... Aquí van las funciones `fetchGeolocationData`, `fetchStarChart`, y `displayStarChart` ...
  
  // Llamar a la función para obtener los datos de geolocalización
  fetchGeolocationData();
  
  window.onscroll = function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
    // Invertir el porcentaje de scroll para que funcione al revés
    let scrollPercentage = 1 - (scrollTop / maxScroll);
  
    // Calcular los dos colores entre los que se hará la transición
    let colorIndex = Math.floor(scrollPercentage * (colors.length - 1));
    let nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  
    let startColor = colors[colorIndex];
    let endColor = colors[nextColorIndex];
  
    // Calcular el porcentaje local entre los dos colores
    let localPercentage = (scrollPercentage * (colors.length - 1)) % 1;
  
    // Interpolar entre los dos colores
    let currentColor = {
      r: Math.floor(startColor.r + (endColor.r - startColor.r) * localPercentage),
      g: Math.floor(startColor.g + (endColor.g - startColor.g) * localPercentage),
      b: Math.floor(startColor.b + (endColor.b - startColor.b) * localPercentage)
    };
  
    // Establecer el color de fondo del cuerpo
    document.body.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
  
    // Mostrar información y carta estelar cuando se alcanza el color negro
    if (currentColor.r === 0 && currentColor.g === 0 && currentColor.b === 0) {
      const geoInfo = document.getElementById('geo-info');
      if (geolocationData.country_name && geolocationData.city) {
        geoInfo.innerText = `You are browsing from: ${geolocationData.country_name}, ${geolocationData.city}`;
        geoInfo.style.display = 'block';
      }
      displayStarChart();
    } else {
      document.getElementById('geo-info').style.display = 'none';
      document.getElementById("star-chart").style.display = "none";
    }
  };
  
  // Agregar elementos de información de geolocalización y carta estelar
  document.addEventListener("DOMContentLoaded", () => {
    // Elemento para mostrar información de geolocalización
    const geoInfo = document.createElement("div");
    geoInfo.id = "geo-info";
    geoInfo.style.position = "fixed";
    geoInfo.style.bottom = "10px";
    geoInfo.style.left = "50%";
    geoInfo.style.transform = "translateX(-50%)";
    geoInfo.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    geoInfo.style.color = "#fff";
    geoInfo.style.padding = "10px";
    geoInfo.style.borderRadius = "5px";
    geoInfo.style.boxShadow = "0 0 10px rgba(255,255,255,0.2)";
    geoInfo.style.display = 'none'; // Inicialmente oculto
    document.body.appendChild(geoInfo);
  
    // Elemento para mostrar la imagen de la carta estelar
    const starChartImage = document.createElement("img");
    starChartImage.id = "star-chart";
    starChartImage.style.position = "fixed";
    starChartImage.style.bottom = "50px";
    starChartImage.style.left = "50%";
    starChartImage.style.transform = "translateX(-50%)";
    starChartImage.style.display = "none"; // Inicialmente oculto
    starChartImage.style.maxWidth = "400px"; // Definir ancho máximo de la imagen
    starChartImage.style.maxHeight = "400px"; // Definir altura máxima de la imagen
    document.body.appendChild(starChartImage);
  });