// Define the color transitions in an array
const colors = [
  { r: 101, g: 55, b: 15 }, { r: 0, g: 128, b: 0 }, { r: 128, g: 128, b: 128 }, 
  { r: 135, g: 206, b: 235 }, { r: 255, g: 255, b: 255 }, { r: 135, g: 206, b: 250 }, 
  { r: 0, g: 0, b: 255 }, { r: 0, g: 0, b: 139 }, { r: 0, g: 0, b: 0 }
];

let geolocationData = {}, starChartUrl = "";

// Fetch geolocation data from the first API
const fetchGeolocationData = async () => {
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=bd5c877df0974c64ba4a6e0d47eb26a2`;
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      geolocationData = await response.json();
      await fetchStarChart(geolocationData.latitude, geolocationData.longitude);
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
    }
  } catch (error) {
    console.error("Star Chart Error:", error);
  }
};

// Display the star chart image
const displayStarChart = () => {
  const starChartImage = document.getElementById("star-chart");
  if (starChartUrl) starChartImage.src = starChartUrl, starChartImage.style.display = "block";
};

// Fade out the star chart image and show the p5.js canvas
const fadeOutAndShowP5 = () => {
  const starChartImage = document.getElementById("star-chart");
  let opacity = 1;
  const fadeOut = setInterval(() => {
    if (opacity <= 0) clearInterval(fadeOut), starChartImage.style.display = "none", document.getElementById("p5-container").style.display = "block";
    starChartImage.style.opacity = opacity;
    opacity -= 0.05;
  }, 100);
};

// Update background color based on scroll position
window.onscroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = 1 - scrollTop / maxScroll;

  const colorIndex = Math.floor(scrollPercentage * (colors.length - 1));
  const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);

  const startColor = colors[colorIndex];
  const endColor = colors[nextColorIndex];
  const localPercentage = (scrollPercentage * (colors.length - 1)) % 1;

  const currentColor = {
    r: Math.floor(startColor.r + (endColor.r - startColor.r) * localPercentage),
    g: Math.floor(startColor.g + (endColor.g - startColor.g) * localPercentage),
    b: Math.floor(startColor.b + (endColor.b - startColor.b) * localPercentage)
  };

  document.body.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;

  if (currentColor.r === 0 && currentColor.g === 0 && currentColor.b === 0) displayStarChart(), fadeOutAndShowP5();
};

// Create elements for displaying geolocation and star chart image
document.addEventListener("DOMContentLoaded", () => {
  const geoInfo = document.createElement("div");
  geoInfo.id = "geo-info";
  Object.assign(geoInfo.style, {
    position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff", padding: "10px", borderRadius: "5px", boxShadow: "0 0 10px rgba(255,255,255,0.2)", display: "none"
  });
  document.body.appendChild(geoInfo);

  const starChartImage = document.createElement("img");
  starChartImage.id = "star-chart";
  Object.assign(starChartImage.style, {
    position: "fixed", bottom: "50px", left: "50%", transform: "translateX(-50%)", display: "none", maxWidth: "400px", maxHeight: "400px"
  });
  document.body.appendChild(starChartImage);

  fetchGeolocationData();  // Fetch geolocation data when the DOM is ready
});