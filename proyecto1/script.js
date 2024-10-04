// Define los colores en el orden inverso
const colors = [
    { r: 0, g: 0, b: 0 },        // Black (inicio)
    { r: 0, g: 0, b: 139 },      // Dark Blue
    { r: 0, g: 0, b: 255 },      // Blue
    { r: 135, g: 206, b: 250 },  // Light Blue (cerca del blanco)
    { r: 255, g: 255, b: 255 },  // White
    { r: 135, g: 206, b: 235 },  // Light Blue (Sky Blue)
    { r: 128, g: 128, b: 128 },  // Gray
    { r: 0, g: 128, b: 0 },      // Green
    { r: 101, g: 55, b: 15 }     // Dark Brown (final)
  ];
  
  // Variable para almacenar los datos de geolocalización
  let geolocationData = {};
  
  // Función para obtener los datos de geolocalización y la imagen de la carta estelar
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
  
      // Almacenar los datos de geolocalización
      geolocationData = data;
  
      // Llamar a la función para obtener la imagen de la carta estelar
      await fetchStarChart(data.latitude, data.longitude);
    } catch (error) {
      console.error("Failed to fetch geolocation data", error);
    }
  }
  
  // Función para obtener la carta estelar usando latitud y longitud
  async function fetchStarChart(latitude, longitude) {
    const corsProxy = "https://cors-anywhere.herokuapp.com/"; // Proxy para evitar CORS
    const url = `${corsProxy}https://api.astronomyapi.com/api/v2/studio/star-chart`;
  
    const apiKey = "3230dc54-3d55-4cca-b89a-977af275a135";
    const applicationSecret = "9ca57b04eb6b07e4bba637d0848560a612356930fa3f7f465800ab9208e960c1999aa16c5fc8de08c75b1a4ca1497dfbfa94bb7bb640bc9de6625d816d6f2a7c70693829b2077af8ad70e301f8fbe0bc0e1f613f95ed528c474d1f77f0986a1eb8122efa8debd2f40b94a22dbe61e3b1";
    const authHeader = `Basic ${btoa(`${apiKey}:${applicationSecret}`)}`;
  
    const data = JSON.stringify({
      style: "default",
      observer: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date: new Date().toISOString().split("T")[0]  // Fecha de hoy
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
  
      // Actualizar la imagen en el canvas de p5.js
      updateStarChartImage(result.data.imageUrl);
    } catch (error) {
      console.error("Failed to fetch star chart data", error);
    }
  }
  
  // Llamar a la función para obtener los datos iniciales
  fetchGeolocationData();
  
  // Función para manejar el scroll y cambiar los colores
  window.onscroll = function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
    // Invertir el cálculo del porcentaje de desplazamiento
    let scrollPercentage = 1 - (scrollTop / maxScroll); // Esto invierte el scroll de abajo hacia arriba
  
    // Obtener el índice de color y el siguiente índice para la transición
    let colorIndex = Math.floor(scrollPercentage * (colors.length - 1));
    let nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  
    let startColor = colors[colorIndex];
    let endColor = colors[nextColorIndex];
  
    // Calcular el porcentaje local de desplazamiento entre los dos colores
    let localPercentage = (scrollPercentage * (colors.length - 1)) % 1;
  
    // Interpolar entre los dos colores
    let currentColor = {
      r: Math.floor(startColor.r + (endColor.r - startColor.r) * localPercentage),
      g: Math.floor(startColor.g + (endColor.g - startColor.g) * localPercentage),
      b: Math.floor(startColor.b + (endColor.b - startColor.b) * localPercentage)
    };
  
    // Establecer el color de fondo del body
    document.body.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
  
    // Mostrar la imagen de la carta estelar y la geolocalización en el segmento negro
    if (currentColor.r === 0 && currentColor.g === 0 && currentColor.b === 0) {
      // Mostrar información de geolocalización
      const geoInfo = document.getElementById('geo-info');
      if (geolocationData.country_name && geolocationData.city) {
        geoInfo.innerText = `You are browsing from: ${geolocationData.country_name}, ${geolocationData.city}`;
        geoInfo.style.display = 'block';
      }
      // Mostrar la imagen de la carta estelar
      document.getElementById("star-chart").style.display = "block";
    } else {
      // Ocultar la información y la imagen cuando no está en el segmento negro
      document.getElementById('geo-info').style.display = 'none';
      document.getElementById("star-chart").style.display = "none";
    }
  };