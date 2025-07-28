// Weather App Configuration
const API_KEY = 'your_openweathermap_api_key_here'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const mainContainer = document.getElementById('mainContainer');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
const refreshWeatherBtn = document.getElementById('refreshWeather');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');

// Weather display elements
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const dateTime = document.getElementById('dateTime');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feelsLike');
const weatherMain = document.getElementById('weatherMain');
const weatherDescription = document.getElementById('weatherDescription');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uvIndex');
const cloudiness = document.getElementById('cloudiness');
const hourlyContainer = document.getElementById('hourlyContainer');
const forecastContainer = document.getElementById('forecastContainer');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const moonPhase = document.getElementById('moonPhase');
const windDirection = document.getElementById('windDirection');
const windGusts = document.getElementById('windGusts');
const compassNeedle = document.getElementById('compassNeedle');
const aqiValue = document.getElementById('aqiValue');
const aqiLabel = document.getElementById('aqiLabel');
const aqiProgress = document.getElementById('aqiProgress');
const pm25 = document.getElementById('pm25');
const pm10 = document.getElementById('pm10');
const recentCities = document.getElementById('recentCities');

// Settings elements
const tempUnit = document.getElementById('tempUnit');
const windUnit = document.getElementById('windUnit');
const timeFormat = document.getElementById('timeFormat');
const autoRefresh = document.getElementById('autoRefresh');

// App State
let currentWeatherData = null;
let currentLocation = { lat: 51.5074, lon: -0.1278 }; // Default to London
let searchTimeout = null;
let refreshInterval = null;
let settings = {
    tempUnit: 'metric',
    windUnit: 'kmh',
    timeFormat: '12',
    autoRefresh: true
};

// Initialize App
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    loadSettings();
    setupEventListeners();
    updateDateTime();
    
    // Try to get user's location, fallback to default
    try {
        await getCurrentLocation();
    } catch (error) {
        console.warn('Could not get location, using default');
        await getWeatherData(currentLocation.lat, currentLocation.lon);
    }
    
    hideLoadingScreen();
    loadRecentSearches();
    
    if (settings.autoRefresh) {
        startAutoRefresh();
    }
}

function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    cityInput.addEventListener('input', handleSearchInput);
    
    // Header controls
    getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
    refreshWeatherBtn.addEventListener('click', handleRefresh);
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    
    // Settings modal
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
    });
    
    // Settings inputs
    tempUnit.addEventListener('change', updateSettings);
    windUnit.addEventListener('change', updateSettings);
    timeFormat.addEventListener('change', updateSettings);
    autoRefresh.addEventListener('change', updateSettings);
    
    // Error handling
    retryBtn.addEventListener('click', () => {
        errorMessage.classList.remove('active');
        getCurrentLocation();
    });
    
    // Click outside suggestions to hide
    document.addEventListener('click', (e) => {
        if (!searchSuggestions.contains(e.target) && e.target !== cityInput) {
            searchSuggestions.style.display = 'none';
        }
    });
}

async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                await getWeatherData(currentLocation.lat, currentLocation.lon);
                resolve();
            },
            (error) => {
                console.error('Geolocation error:', error);
                reject(error);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    });
}

async function handleSearch() {
    const query = cityInput.value.trim();
    if (!query) return;
    
    try {
        showLoadingScreen();
        const locationData = await searchCity(query);
        if (locationData.length > 0) {
            const location = locationData[0];
            currentLocation = { lat: location.lat, lon: location.lon };
            await getWeatherData(location.lat, location.lon);
            saveRecentSearch(location.name, location.country);
            cityInput.value = '';
        } else {
            showError('City not found. Please try another search.');
        }
    } catch (error) {
        showError('Failed to search for city. Please try again.');
    } finally {
        hideLoadingScreen();
    }
}

async function handleSearchInput() {
    const query = cityInput.value.trim();
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        searchSuggestions.style.display = 'none';
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        try {
            const suggestions = await searchCity(query, 5);
            displaySearchSuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 300);
}

async function searchCity(query, limit = 1) {
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to search city');
    }
    
    return await response.json();
}

function displaySearchSuggestions(suggestions) {
    searchSuggestions.innerHTML = '';
    
    if (suggestions.length === 0) {
        searchSuggestions.style.display = 'none';
        return;
    }
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = `${suggestion.name}, ${suggestion.state ? suggestion.state + ', ' : ''}${suggestion.country}`;
        item.addEventListener('click', async () => {
            currentLocation = { lat: suggestion.lat, lon: suggestion.lon };
            cityInput.value = suggestion.name;
            searchSuggestions.style.display = 'none';
            showLoadingScreen();
            await getWeatherData(suggestion.lat, suggestion.lon);
            saveRecentSearch(suggestion.name, suggestion.country);
            hideLoadingScreen();
        });
        searchSuggestions.appendChild(item);
    });
    
    searchSuggestions.style.display = 'block';
}

async function getWeatherData(lat, lon) {
    try {
        // Get current weather
        const currentWeatherUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${settings.tempUnit}`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        
        if (!currentWeatherResponse.ok) {
            throw new Error('Failed to fetch current weather');
        }
        
        const currentWeather = await currentWeatherResponse.json();
        
        // Get forecast data (5-day forecast)
        const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${settings.tempUnit}`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Try to get One Call API data (requires subscription)
        let oneCallData = null;
        try {
            const oneCallUrl = `${ONE_CALL_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${settings.tempUnit}`;
            const oneCallResponse = await fetch(oneCallUrl);
            if (oneCallResponse.ok) {
                oneCallData = await oneCallResponse.json();
            }
        } catch (error) {
            console.warn('One Call API not available:', error);
        }
        
        // Update UI with weather data
        updateCurrentWeather(currentWeather);
        updateHourlyForecast(forecastData);
        updateWeeklyForecast(forecastData);
        
        if (oneCallData) {
            updateAdditionalInfo(oneCallData);
        } else {
            updateAdditionalInfoFallback(currentWeather);
        }
        
        currentWeatherData = currentWeather;
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please try again.');
    }
}

function updateCurrentWeather(data) {
    // Location info
    cityName.textContent = data.name;
    countryName.textContent = data.sys.country;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Temperature
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°${getTempSymbol()}`;
    
    // Weather description
    weatherMain.textContent = data.weather[0].main;
    weatherDescription.textContent = data.weather[0].description;
    
    // Weather details
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = convertWindSpeed(data.wind.speed);
    pressure.textContent = `${data.main.pressure} hPa`;
    cloudiness.textContent = `${data.clouds.all}%`;
    
    // UV Index (placeholder if not available)
    uvIndex.textContent = data.uvi ? Math.round(data.uvi) : '5';
    
    // Wind direction
    if (data.wind.deg !== undefined) {
        updateWindCompass(data.wind.deg);
        windDirection.textContent = getWindDirection(data.wind.deg);
    }
    
    windGusts.textContent = data.wind.gust ? convertWindSpeed(data.wind.gust) : 'N/A';
    
    // Sunrise/Sunset
    sunrise.textContent = formatTime(new Date(data.sys.sunrise * 1000));
    sunset.textContent = formatTime(new Date(data.sys.sunset * 1000));
}

function updateHourlyForecast(forecastData) {
    hourlyContainer.innerHTML = '';
    
    // Take first 24 hours (8 items * 3 hours each)
    const hourlyData = forecastData.list.slice(0, 8);
    
    hourlyData.forEach(item => {
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        
        const time = new Date(item.dt * 1000);
        const iconCode = item.weather[0].icon;
        
        hourlyItem.innerHTML = `
            <div class="hourly-time">${formatTime(time)}</div>
            <img class="hourly-icon" src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${item.weather[0].description}">
            <div class="hourly-temp">${Math.round(item.main.temp)}°</div>
            <div class="hourly-desc">${item.weather[0].main}</div>
        `;
        
        hourlyContainer.appendChild(hourlyItem);
    });
}

function updateWeeklyForecast(forecastData) {
    forecastContainer.innerHTML = '';
    
    // Group forecast by day
    const dailyForecasts = groupForecastByDay(forecastData.list);
    
    dailyForecasts.slice(0, 7).forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const iconCode = day.weather[0].icon;
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${day.weather[0].description}">
            <div class="forecast-temps">
                <span class="forecast-high">${Math.round(day.temp_max)}°</span>
                <span class="forecast-low">${Math.round(day.temp_min)}°</span>
            </div>
            <div class="forecast-desc">${day.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

function groupForecastByDay(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
                dt: item.dt,
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min,
                weather: item.weather,
                items: []
            };
        } else {
            dailyData[dayKey].temp_max = Math.max(dailyData[dayKey].temp_max, item.main.temp_max);
            dailyData[dayKey].temp_min = Math.min(dailyData[dayKey].temp_min, item.main.temp_min);
        }
        
        dailyData[dayKey].items.push(item);
    });
    
    return Object.values(dailyData);
}

function updateAdditionalInfo(oneCallData) {
    // UV Index
    uvIndex.textContent = Math.round(oneCallData.current.uvi);
    
    // Moon phase (placeholder calculation)
    const moonPhaseValue = calculateMoonPhase(new Date());
    moonPhase.textContent = moonPhaseValue;
    
    // Air quality (placeholder values)
    updateAirQuality(42, 12, 18);
}

function updateAdditionalInfoFallback(currentWeather) {
    // Use placeholder values when One Call API is not available
    moonPhase.textContent = 'Waxing Crescent';
    updateAirQuality(45, 15, 22);
}

function updateAirQuality(aqi, pm25Value, pm10Value) {
    aqiValue.textContent = aqi;
    pm25.textContent = `${pm25Value} μg/m³`;
    pm10.textContent = `${pm10Value} μg/m³`;
    
    // Update AQI label and color
    let label, color;
    if (aqi <= 50) {
        label = 'Good';
        color = '#00b894';
    } else if (aqi <= 100) {
        label = 'Moderate';
        color = '#fdcb6e';
    } else if (aqi <= 150) {
        label = 'Unhealthy for Sensitive Groups';
        color = '#e17055';
    } else {
        label = 'Unhealthy';
        color = '#d63031';
    }
    
    aqiLabel.textContent = label;
    aqiLabel.style.color = color;
    aqiProgress.style.width = `${Math.min(aqi, 200) / 2}%`;
    aqiProgress.style.background = color;
}

function updateWindCompass(degrees) {
    compassNeedle.style.transform = `translate(-50%, -100%) rotate(${degrees}deg)`;
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function calculateMoonPhase(date) {
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const lunationDays = 29.530588853;
    const knownNewMoon = new Date('2000-01-06').getTime();
    const currentTime = date.getTime();
    const daysSinceNewMoon = (currentTime - knownNewMoon) / (1000 * 60 * 60 * 24);
    const currentPhase = (daysSinceNewMoon % lunationDays) / lunationDays;
    const phaseIndex = Math.round(currentPhase * 8) % 8;
    return phases[phaseIndex];
}

function convertWindSpeed(speedMs) {
    switch (settings.windUnit) {
        case 'mph':
            return `${(speedMs * 2.237).toFixed(1)} mph`;
        case 'ms':
            return `${speedMs.toFixed(1)} m/s`;
        default: // kmh
            return `${(speedMs * 3.6).toFixed(1)} km/h`;
    }
}

function getTempSymbol() {
    switch (settings.tempUnit) {
        case 'imperial':
            return 'F';
        case 'kelvin':
            return 'K';
        default:
            return 'C';
    }
}

function formatTime(date) {
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: settings.timeFormat === '12'
    };
    return date.toLocaleTimeString('en-US', options);
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: settings.timeFormat === '12'
    };
    dateTime.textContent = now.toLocaleDateString('en-US', options);
    
    // Update every minute
    setTimeout(updateDateTime, 60000 - (now.getSeconds() * 1000));
}

function handleRefresh() {
    refreshWeatherBtn.classList.add('rotating');
    getWeatherData(currentLocation.lat, currentLocation.lon).finally(() => {
        setTimeout(() => {
            refreshWeatherBtn.classList.remove('rotating');
        }, 1000);
    });
}

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        getWeatherData(currentLocation.lat, currentLocation.lon);
    }, 10 * 60 * 1000); // 10 minutes
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

function updateSettings() {
    settings.tempUnit = tempUnit.value;
    settings.windUnit = windUnit.value;
    settings.timeFormat = timeFormat.value;
    settings.autoRefresh = autoRefresh.checked;
    
    saveSettings();
    
    // Refresh weather data if temperature unit changed
    if (currentWeatherData) {
        getWeatherData(currentLocation.lat, currentLocation.lon);
    }
    
    // Update auto refresh
    if (settings.autoRefresh) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
    
    // Update time display
    updateDateTime();
}

function saveSettings() {
    localStorage.setItem('weatherAppSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('weatherAppSettings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    
    // Apply settings to UI
    tempUnit.value = settings.tempUnit;
    windUnit.value = settings.windUnit;
    timeFormat.value = settings.timeFormat;
    autoRefresh.checked = settings.autoRefresh;
}

function saveRecentSearch(city, country) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const searchItem = `${city}, ${country}`;
    
    // Remove if already exists
    recentSearches = recentSearches.filter(item => item !== searchItem);
    
    // Add to beginning
    recentSearches.unshift(searchItem);
    
    // Keep only 5 recent searches
    recentSearches = recentSearches.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
}

function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentCities.innerHTML = '';
    
    recentSearches.forEach(search => {
        const cityElement = document.createElement('div');
        cityElement.className = 'recent-city';
        cityElement.textContent = search;
        cityElement.addEventListener('click', async () => {
            const [cityName] = search.split(', ');
            cityInput.value = cityName;
            await handleSearch();
        });
        recentCities.appendChild(cityElement);
    });
}

function showLoadingScreen() {
    loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    mainContainer.style.opacity = '1';
}

function showError(message) {
    document.getElementById('errorText').textContent = message;
    errorMessage.classList.add('active');
}

// Utility function to check if API key is set
function checkApiKey() {
    if (API_KEY === 'your_openweathermap_api_key_here') {
        showError('Please set your OpenWeatherMap API key in the JavaScript file.');
        return false;
    }
    return true;
}

// Initialize only if API key is set
if (checkApiKey()) {
    // App will initialize on DOMContentLoaded
} else {
    hideLoadingScreen();
}