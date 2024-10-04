window.onscroll = function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
    // Calcular el porcentaje de scroll en dirección inversa
    let scrollPercentage = (maxScroll - scrollTop) / maxScroll;
  
    // Calcular los dos colores entre los que se hará la transición
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
  
    // Comprobar si el color de fondo es negro (último segmento)
    if (currentColor.r === 0 && currentColor.g === 0 && currentColor.b === 0) {
      // Mostrar la información de geolocalización en el pie de página
      const geoInfo = document.getElementById('geo-info');
      if (geolocationData.country_name && geolocationData.city) {
        geoInfo.innerText = `You are browsing from: ${geolocationData.country_name}, ${geolocationData.city}`;
        geoInfo.style.display = 'block';
      }
      // Mostrar la imagen de la carta estelar en el segmento negro
      displayStarChart();
    } else {
      // Ocultar la información de geolocalización y la carta estelar cuando no esté en el segmento negro
      document.getElementById('geo-info').style.display = 'none';
      document.getElementById("star-chart").style.display = "none";
    }
  };