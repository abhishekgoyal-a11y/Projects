// Open-Meteo — free weather API, no API key needed
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weatherBox");
const errorMsg = document.getElementById("errorMsg");
const loader = document.getElementById("loader");
const body = document.body;

const cityNameEl = document.getElementById("cityName");
const dateTimeEl = document.getElementById("dateTime");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("weatherCondition");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const visibilityEl = document.getElementById("visibility");
const feelsLikeEl = document.getElementById("feelsLike");
const tempMinEl = document.getElementById("tempMin");
const tempMaxEl = document.getElementById("tempMax");
const pressureEl = document.getElementById("pressure");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  }
});

document.querySelectorAll(".quick-city").forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.dataset.city;
    cityInput.value = city;
    getWeather(city);
  });
});

async function getWeather(city) {
  showLoader(true);
  hideWeatherBox();
  hideError();

  try {
    const location = await fetchCity(city);
    const weather = await fetchForecast(location.latitude, location.longitude);
    displayWeather(location, weather);
  } catch {
    showError();
  } finally {
    showLoader(false);
  }
}

async function fetchCity(city) {
  const url = `${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  return data.results[0];
}

async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "pressure_msl",
      "visibility",
      "is_day",
    ].join(","),
    daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  if (!response.ok) throw new Error("Weather fetch failed");
  return response.json();
}

function displayWeather(location, data) {
  const current = data.current;
  const daily = data.daily;
  const info = getWeatherInfo(current.weather_code, current.is_day === 1);

  cityNameEl.textContent = `${location.name}, ${location.country}`;
  dateTimeEl.textContent = getCurrentDateTime();
  temperatureEl.textContent = Math.round(current.temperature_2m);
  conditionEl.textContent = info.label;
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  windSpeedEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  visibilityEl.textContent =
    current.visibility != null
      ? `${(current.visibility / 1000).toFixed(1)} km`
      : "N/A";

  feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
  tempMinEl.textContent = `${Math.round(daily.temperature_2m_min[0])}°`;
  tempMaxEl.textContent = `${Math.round(daily.temperature_2m_max[0])}°`;
  pressureEl.textContent = `${Math.round(current.pressure_msl)} hPa`;
  sunriseEl.textContent = formatTime(daily.sunrise[0]);
  sunsetEl.textContent = formatTime(daily.sunset[0]);

  weatherIconEl.textContent = info.emoji;
  weatherIconEl.setAttribute("aria-label", info.label);

  setTheme(info.theme, current.is_day !== 1);
  weatherBox.classList.remove("hidden");
}

function getWeatherInfo(code, isDay) {
  const conditions = {
    0: { label: "Clear sky", emoji: isDay ? "☀️" : "🌙", theme: "clear" },
    1: { label: "Mainly clear", emoji: isDay ? "🌤️" : "🌙", theme: "clear" },
    2: { label: "Partly cloudy", emoji: "⛅", theme: "clouds" },
    3: { label: "Overcast", emoji: "☁️", theme: "clouds" },
    45: { label: "Foggy", emoji: "🌫️", theme: "mist" },
    48: { label: "Foggy", emoji: "🌫️", theme: "mist" },
    51: { label: "Light drizzle", emoji: "🌦️", theme: "rain" },
    53: { label: "Drizzle", emoji: "🌦️", theme: "rain" },
    55: { label: "Heavy drizzle", emoji: "🌧️", theme: "rain" },
    61: { label: "Light rain", emoji: "🌧️", theme: "rain" },
    63: { label: "Rain", emoji: "🌧️", theme: "rain" },
    65: { label: "Heavy rain", emoji: "🌧️", theme: "rain" },
    71: { label: "Light snow", emoji: "🌨️", theme: "snow" },
    73: { label: "Snow", emoji: "❄️", theme: "snow" },
    75: { label: "Heavy snow", emoji: "❄️", theme: "snow" },
    77: { label: "Snow grains", emoji: "❄️", theme: "snow" },
    80: { label: "Rain showers", emoji: "🌦️", theme: "rain" },
    81: { label: "Rain showers", emoji: "🌧️", theme: "rain" },
    82: { label: "Heavy showers", emoji: "🌧️", theme: "rain" },
    85: { label: "Snow showers", emoji: "🌨️", theme: "snow" },
    86: { label: "Heavy snow showers", emoji: "❄️", theme: "snow" },
    95: { label: "Thunderstorm", emoji: "⛈️", theme: "thunder" },
    96: { label: "Thunderstorm with hail", emoji: "⛈️", theme: "thunder" },
    99: { label: "Thunderstorm with hail", emoji: "⛈️", theme: "thunder" },
  };

  return (
    conditions[code] || {
      label: "Cloudy",
      emoji: "☁️",
      theme: "clouds",
    }
  );
}

function setTheme(theme, isNight) {
  body.classList.remove(
    "theme-clear",
    "theme-clouds",
    "theme-rain",
    "theme-snow",
    "theme-thunder",
    "theme-mist",
    "theme-night"
  );
  body.classList.add(isNight ? "theme-night" : `theme-${theme}`);
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCurrentDateTime() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showLoader(visible) {
  loader.classList.toggle("hidden", !visible);
}

function hideWeatherBox() {
  weatherBox.classList.add("hidden");
}

function showError() {
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
}

// Load London weather on first visit
getWeather("London");
