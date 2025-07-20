// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const loadingEl = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const errorEl = document.getElementById('error');

// Weather Elements
const cityEl = document.getElementById('city');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('description');
const weatherIconEl = document.getElementById('weather-icon');
const feelsLikeEl = document.getElementById('feels-like');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const sunriseEl = document.getElementById('sunrise');

// API Configuration
const API_KEY = 'ENTER YOUR API KEY FROM CURRENT WEATHER DATA IN OPENWEATHER API'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Event Listeners
searchBtn.addEventListener('click', getWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// Initialize with default city
window.addEventListener('load', () => {
    locationInput.value = 'London';
    getWeather();
});

// Get Weather Data
async function getWeather() {
    const location = locationInput.value.trim();
    
    if (!location) {
        showError('Please enter a city name');
        return;
    }

    // Show loading state
    loadingEl.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    errorEl.classList.add('hidden');

    try {
        const response = await fetch(`${BASE_URL}?q=${location}&units=metric&appid=${API_KEY}`);
        const data = await response.json();

        if (data.cod === 200) {
            displayWeather(data);
        } else {
            showError(data.message || 'City not found');
        }
    } catch (err) {
        showError('Failed to fetch weather data');
        console.error(err);
    } finally {
        loadingEl.classList.add('hidden');
    }
}

// Display Weather Data
function displayWeather(data) {
    // Set location
    cityEl.textContent = `${data.name}, ${data.sys.country}`;
    
    // Set current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    
    // Set temperature and description
    tempEl.textContent = Math.round(data.main.temp);
    descEl.textContent = data.weather[0].description;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIconEl.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
             alt="${data.weather[0].description}">
    `;
    
    // Set weather details
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    
    // Convert sunrise timestamp to time
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    sunriseEl.textContent = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Show weather display
    weatherDisplay.classList.remove('hidden');
}

// Show Error
function showError(message) {
    document.getElementById('error-message').textContent = message;
    errorEl.classList.remove('hidden');
}
