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
  let starChartUrl = ""; // Variable to store the star chart URL
  
  // Function to fetch geolocation data from the first API
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
  
      // Store geolocation data
      geolocationData = data;
  
      // Call the function to get the star chart image
      await fetchStarChart(data.latitude, data.longitude);
    } catch (error) {
      console.error("Failed to fetch geolocation data", error);
    }
  }
  
  // Function to fetch star chart data from the second API using latitude and longitude
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
        date: new Date().toISOString().split("T")[0]  // Use today's date
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
  
      // Store the star chart URL
      starChartUrl = result.data.imageUrl;
  
      // Update the star chart image on the page
      displayStarChart();
    } catch (error) {
      console.error("Failed to fetch star chart data", error);
    }
  }
  
  // Function to display the star chart image in the black segment
  function displayStarChart() {
    if (starChartUrl) {
      const starChartImage = document.getElementById("star-chart");
      starChartImage.src = starChartUrl;
      starChartImage.style.display = "block"; // Show the image
    }
  }
  
  // Call the function to fetch geolocation data
  fetchGeolocationData();
  
  window.onscroll = function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
    // Calculate the scroll percentage from top to bottom (inverse)
    let scrollPercentage = scrollTop / maxScroll;
  
    // Calculate which two colors to transition between
    let colorIndex = Math.floor(scrollPercentage * (colors.length - 1));
    let nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  
    let startColor = colors[colorIndex];
    let endColor = colors[nextColorIndex];
  
    // Calculate local scroll percentage between the two colors
    let localPercentage = (scrollPercentage * (colors.length - 1)) % 1;
  
    // Interpolate between the two colors
    let currentColor = {
      r: Math.floor(startColor.r + (endColor.r - startColor.r) * localPercentage),
      g: Math.floor(startColor.g + (endColor.g - startColor.g) * localPercentage),
      b: Math.floor(startColor.b + (endColor.b - startColor.b) * localPercentage)
    };
  
    // Set the background color of the body
    document.body.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
  
    // Check if background is black (final segment)
    if (currentColor.r === 0 && currentColor.g === 0 && currentColor.b === 0) {
      // Display the geolocation data in the footer
      const geoInfo = document.getElementById('geo-info');
      if (geolocationData.country_name && geolocationData.city) {
        geoInfo.innerText = `You are browsing from: ${geolocationData.country_name}, ${geolocationData.city}`;
        geoInfo.style.display = 'block';
      }
      // Display the star chart image in the black segment
      displayStarChart();
    } else {
      // Hide the geolocation info and star chart when not in the black segment
      document.getElementById('geo-info').style.display = 'none';
      document.getElementById("star-chart").style.display = "none";
    }
  };
  
  // Add elements to display geolocation information and star chart image
  document.addEventListener("DOMContentLoaded", () => {
    // Element to display geolocation information
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
    geoInfo.style.display = "none"; // Initially hidden
    document.body.appendChild(geoInfo);
  
    // Element to display the star chart image
    const starChartImage = document.createElement("img");
    starChartImage.id = "star-chart";
    starChartImage.style.position = "fixed";
    starChartImage.style.bottom = "50px";
    starChartImage.style.left = "50%";
    starChartImage.style.transform = "translateX(-50%)";
    starChartImage.style.display = "none"; // Initially hidden
    starChartImage.style.maxWidth = "400px"; // Set max width for image
    starChartImage.style.maxHeight = "400px"; // Set max height for image
    document.body.appendChild(starChartImage);
  });