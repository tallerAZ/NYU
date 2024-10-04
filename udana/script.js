// Define the color transitions in an array
const colors = [
  { r: 101, g: 55, b: 15 },   // Dark Brown
  { r: 0, g: 128, b: 0 },     // Green
  { r: 128, g: 128, b: 128 }, // Gray
  { r: 135, g: 206, b: 235 }, // Light Blue
  { r: 255, g: 255, b: 255 }, // White
  { r: 135, g: 206, b: 250 }, // Light Blue (close to white)
  { r: 0, g: 0, b: 255 },     // Blue
  { r: 0, g: 0, b: 139 },     // Dark Blue
  { r: 0, g: 0, b: 0 }        // Black
];

let geolocationData = {}, starChartUrl = "";

// Fetch geolocation data from the first API
const fetchGeolocationData = async () => {
  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=bd5c877df0974c64ba4a6e0d47eb26a2`, { mode: 'cors' });
    if (response.ok) {
      geolocationData = await response.json();
      await fetchStarChart(geolocationData.latitude, geolocationData.longitude);
    } else {
      console.error(`Failed to fetch geolocation data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Geolocation Error:", error);
  }
};

// Fetch star chart data using latitude and longitude
const fetchStarChart = async (latitude, longitude) => {
  const authHeader = `Basic ${btoa("3230dc54-3d55-4cca-b89a-977af275a135:9ca57b04eb6b07e4bba637d0848560a612356930fa3f7f465800ab9208e960c1999aa16c5fc8de08c75b1a4ca1497dfbfa94bb7bb640bc9de6625d816d6f2a7c70693829b2077af8ad70e301f8fbe0bc0e1f613f95ed528c474d1f77f0986a1eb8122efa8debd2f40b94a22dbe61e3b1")}`;
  try {
    const response = await fetch("https://api.astronomyapi.com/api/v2/studio/star-chart", {
      method: "POST",
      headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      mode: 'cors',  // CORS mode
      body: JSON.stringify({
        style: "default",
        observer: { latitude: +latitude, longitude: +longitude, date: new Date().toISOString().split("T")[0] },
        view: { type: "area", parameters: { position: { equatorial: { rightAscension: 0, declination: 0 } }, zoom: 6 } }
      })
    });
    if (response.ok) {
      const result = await response.json();
      starChartUrl = result.data.imageUrl;
      displayStarChart();
    } else {
      console.error(`Failed to fetch star chart. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Star Chart Error:", error);
  }
};

// Create and display the star chart image
const displayStarChart = () => {
  const starChartImage = document.getElementById("star-chart");
  if (starChartUrl) {
    starChartImage.src = starChartUrl;
    starChartImage.style.display = "block";
  } else {
    console.error("Star Chart URL not set.");
  }
};

// Fetch geolocation data when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  fetchGeolocationData();
});