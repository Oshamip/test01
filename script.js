// Weather App JavaScript

// API Configuration
const API_KEY = ''; // You need to get a free API key from OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Weather display elements
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const cityName = document.getElementById('cityName');
const weatherDescription = document.getElementById('weatherDescription');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uvIndex');
const forecastContainer = document.getElementById('forecastContainer');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if API key is set
    if (!API_KEY) {
        showApiKeyError();
        return;
    }
    
    // Try to get user's current location on page load
    getCurrentLocationWeather();
});

searchBtn.addEventListener('click', handleSearch);
locationBtn.addEventListener('click', getCurrentLocationWeather);

// Handle Enter key in search input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Functions
function showApiKeyError() {
    errorText.textContent = 'API key is missing. Please get a free API key from OpenWeatherMap and add it to the script.js file.';
    errorMessage.classList.add('show');
}

function showLoading() {
    loading.classList.add('show');
    errorMessage.classList.remove('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
    hideLoading();
}

function hideError() {
    errorMessage.classList.remove('show');
}

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                hideLoading();
                let message = 'Unable to get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message += 'Location access denied.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        message += 'Location request timed out.';
                        break;
                    default:
                        message += 'An unknown error occurred.';
                }
                showError(message);
            }
        );
    } else {
        showError('Geolocation is not supported by this browser.');
    }
}

async function getWeatherByCity(city) {
    if (!API_KEY) {
        showApiKeyError();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API configuration.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        
        const data = await response.json();
        displayCurrentWeather(data);
        getForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}

async function getWeatherByCoords(lat, lon) {
    if (!API_KEY) {
        showApiKeyError();
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data for your location.');
        }
        
        const data = await response.json();
        displayCurrentWeather(data);
        getForecast(lat, lon);
    } catch (error) {
        showError(error.message);
    }
}

async function getForecast(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data.');
        }
        
        const data = await response.json();
        displayForecast(data);
        hideLoading();
    } catch (error) {
        console.error('Forecast error:', error);
        hideLoading();
        // Don't show error for forecast, just log it
    }
}

function displayCurrentWeather(data) {
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.className = getWeatherIcon(iconCode);
    
    // Update main weather info
    temperature.textContent = Math.round(data.main.temp);
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDescription.textContent = data.weather[0].description;
    
    // Update weather details
    visibility.textContent = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : '--';
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // UV Index would require an additional API call, so we'll show a placeholder
    uvIndex.textContent = '--';
    
    // Clear search input
    cityInput.value = '';
}

function displayForecast(data) {
    // Get daily forecasts (one per day for next 5 days)
    const dailyForecasts = getDailyForecasts(data.list);
    
    forecastContainer.innerHTML = '';
    
    dailyForecasts.forEach(forecast => {
        const forecastCard = createForecastCard(forecast);
        forecastContainer.appendChild(forecastCard);
    });
}

function getDailyForecasts(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                date: item.dt,
                temps: [],
                weather: item.weather[0],
                humidity: item.main.humidity,
                windSpeed: item.wind.speed
            };
        }
        dailyData[date].temps.push(item.main.temp);
    });
    
    // Convert to array and get first 5 days
    return Object.values(dailyData).slice(0, 5).map(day => ({
        ...day,
        tempMax: Math.round(Math.max(...day.temps)),
        tempMin: Math.round(Math.min(...day.temps))
    }));
}

function createForecastCard(forecast) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    const date = new Date(forecast.date * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-icon">
            <i class="${getWeatherIcon(forecast.weather.icon)}"></i>
        </div>
        <div class="forecast-temps">
            <span class="forecast-high">${forecast.tempMax}°</span>
            <span class="forecast-low">${forecast.tempMin}°</span>
        </div>
        <div class="forecast-desc">${forecast.weather.description}</div>
    `;
    
    return card;
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-clouds',
        '04n': 'fas fa-clouds',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    };
    
    return iconMap[iconCode] || 'fas fa-question';
}

// Utility function to format date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Demo mode for when API key is not set
function enableDemoMode() {
    console.log('Demo mode enabled - using sample data');
    
    // Sample weather data for demo
    const sampleData = {
        name: 'Demo City',
        sys: { country: 'XX' },
        main: {
            temp: 22,
            feels_like: 25,
            humidity: 65,
            pressure: 1013
        },
        weather: [{
            description: 'partly cloudy',
            icon: '02d'
        }],
        wind: { speed: 3.5 },
        visibility: 10000
    };
    
    displayCurrentWeather(sampleData);
    
    // Sample forecast data
    const sampleForecast = [];
    for (let i = 0; i < 5; i++) {
        sampleForecast.push({
            date: Date.now() / 1000 + (i * 24 * 60 * 60),
            tempMax: 20 + Math.random() * 10,
            tempMin: 15 + Math.random() * 5,
            weather: {
                description: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)],
                icon: ['01d', '02d', '10d', '04d'][Math.floor(Math.random() * 4)]
            }
        });
    }
    
    forecastContainer.innerHTML = '';
    sampleForecast.forEach(forecast => {
        const forecastCard = createForecastCard(forecast);
        forecastContainer.appendChild(forecastCard);
    });
    
    hideLoading();
}

// Initialize demo mode if no API key
if (!API_KEY) {
    setTimeout(() => {
        hideError();
        enableDemoMode();
    }, 3000);
}