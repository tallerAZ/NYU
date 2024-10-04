window.onscroll = function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
    // Invertir el cálculo del porcentaje de scroll
    let scrollPercentage = 1 - (scrollTop / maxScroll);
  
    // Calcular qué dos colores usar para la transición
    let colorIndex = Math.floor(scrollPercentage * (colors.length - 1));
    let nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  
    let startColor = colors[colorIndex];
    let endColor = colors[nextColorIndex];
  
    // Calcular el porcentaje local de scroll entre los dos colores
    let localPercentage = (scrollPercentage * (colors.length - 1)) % 1;
  
    // Interpolar entre los dos colores
    let currentColor = {
      r: Math.floor(startColor.r + (endColor.r - startColor.r) * localPercentage),
      g: Math.floor(startColor.g + (endColor.g - startColor.g) * localPercentage),
      b: Math.floor(startColor.b + (endColor.b - startColor.b) * localPercentage)
    };
  
    // Establecer el color de fondo del cuerpo
    document.body.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
  
    // Verificar si el fondo es marrón oscuro (segmento inicial)
    if (currentColor.r === 101 && currentColor.g === 55 && currentColor.b === 15) {
      // Mostrar la información de geolocalización en el footer
      const geoInfo = document.getElementById('geo-info');
      if (geolocationData.country_name && geolocationData.city) {
        geoInfo.innerText = `You are browsing from: ${geolocationData.country_name}, ${geolocationData.city}`;
        geoInfo.style.display = 'block';
      }
      // Mostrar la imagen de la carta estelar en el segmento marrón oscuro
      displayStarChart();
    } else {
      // Ocultar la información de geolocalización y la carta estelar cuando no esté en el segmento marrón oscuro
      document.getElementById('geo-info').style.display = 'none';
      document.getElementById("star-chart").style.display = "none";
    }
  };