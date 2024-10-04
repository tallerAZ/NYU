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