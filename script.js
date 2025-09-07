function getDateTime() {
  return new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
}

// Enable/disable button on input
const input = document.getElementById("in");
const searchBtn = document.getElementById("searchBtn");
const display = document.getElementById("display");
const loader = document.getElementById("loader");

input.addEventListener("input", () => {
  searchBtn.disabled = input.value.trim() === "";
});

// Allow search on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !searchBtn.disabled) {
    check();
  }
});

// Fetch weather data
const check = async () => {
  const cityName = input.value.trim();
  if (!cityName) return;

  // Show loading animation
  loader.style.display = "block";
  display.innerHTML = "";

  try {
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=5b4bee0ba241d092159faf007e166080&units=metric`
    );
    const data = await result.json();

    if (data.cod !== 200) {
      throw new Error("City not found");
    }

    const dateTime = getDateTime();

    display.innerHTML = `
<div class="weather-card">
  <div class="location-info">
    <div class="city-name">
      <i class="fas fa-map-marker-alt"></i> ${data.name}, ${data.sys.country}
    </div>
    <div class="date-time">
      <i class="fas fa-calendar-day"></i> ${dateTime}
    </div>
  </div>
  <div class="weather-data">
    <div class="weather-item">
      <i class="fas fa-cloud weather-icon"></i>
      <div class="weather-value">${data.weather[0].main}</div>
      <div class="weather-label">${data.weather[0].description}</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-thermometer-half weather-icon"></i>
      <div class="weather-value">${data.main.temp}&deg;C</div>
      <div class="weather-label">Temperature</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-temperature-low weather-icon"></i>
      <div class="weather-value">${data.main.feels_like}&deg;C</div>
      <div class="weather-label">Feels Like</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-tint weather-icon"></i>
      <div class="weather-value">${data.main.humidity}%</div>
      <div class="weather-label">Humidity</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-wind weather-icon"></i>
      <div class="weather-value">${data.wind.speed} m/s</div>
      <div class="weather-label">Wind Speed</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-cloud-sun weather-icon"></i>
      <div class="weather-value">${data.clouds.all}%</div>
      <div class="weather-label">Cloudiness</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-tachometer-alt weather-icon"></i>
      <div class="weather-value">${data.main.pressure} hPa</div>
      <div class="weather-label">Pressure</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-eye weather-icon"></i>
      <div class="weather-value">${data.visibility / 1000} km</div>
      <div class="weather-label">Visibility</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-sun weather-icon"></i>
      <div class="weather-value">${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</div>
      <div class="weather-label">Sunrise</div>
    </div>
    <div class="weather-item">
      <i class="fas fa-moon weather-icon"></i>
      <div class="weather-value">${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</div>
      <div class="weather-label">Sunset</div>
    </div>
  </div>
</div>`;

    document.title = `Weather - ${data.name}`;
    console.log("You have searched the city", data.name);
    
  } catch (error) {
    console.log(error);
    document.title = "Weather App - Error";
    display.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i> City not found. Try correcting the input...
      </div>`;
  } finally {
    loader.style.display = "none";
  }
};

// Attach the check function to the search button
searchBtn.addEventListener("click", check);
