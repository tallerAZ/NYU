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