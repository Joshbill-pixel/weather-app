// Weather App JavaScript

// Global state
let weatherData = null;
let units = 'metric'; // 'metric' or 'imperial'
let precipitationUnit = 'mm'; // 'mm' or 'inch'
let selectedDay = 0;
let isLoading = false;

// DOM elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const suggestions = document.getElementById('suggestions');
const errorMessage = document.getElementById('errorMessage');
const weatherContent = document.getElementById('weatherContent');
const unitsButton = document.getElementById('unitsButton');
const unitsDropdown = document.getElementById('unitsDropdown');

// Weather display elements
const locationName = document.getElementById('locationName');
const locationDate = document.getElementById('locationDate');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const precipitation = document.getElementById('precipitation');
const dailyForecastGrid = document.getElementById('dailyForecastGrid');
const hourlyForecastList = document.getElementById('hourlyForecastList');
const daySelector = document.getElementById('daySelector');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    // Load default location (Lagos)
    handleSearch('Lagos');
});

function initializeEventListeners() {
    // Search form
    searchForm.addEventListener('submit', handleSearchSubmit);
    // searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 2) {
            showSuggestions(query);
        } else {
            hideSuggestions();
        }
    });

   
    // Units toggle
    unitsButton.addEventListener('click', toggleUnitsDropdown);
    // Day selector
    daySelector.addEventListener('change', handleDaySelect);
    
    // Unit buttons
    const unitBtns = document.querySelectorAll('.unit-btn');
    unitBtns.forEach(btn => {
        btn.addEventListener('click', handleUnitChange);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!unitsButton.contains(e.target) && !unitsDropdown.contains(e.target)) {
            closeUnitsDropdown();
        }
        if (!suggestions.contains(e.target) && !searchInput.contains(e.target)) {
            hideSuggestions();
        }
    });
}

function handleSearchSubmit(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        handleSearch(query);
        hideSuggestions();
    }
}

function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length > 2) {
        showMockSuggestions(query);
    } else {
        hideSuggestions();
    }
}

// Fetch and display location suggestions
async function showSuggestions(query) {
    if (!query.trim()) {
        hideSuggestions();
        return;
    }

    try {
        // Fetch suggestions from Open-Meteo Geocoding API
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data = await response.json();

        suggestions.innerHTML = '';

        if (!data.results || data.results.length === 0) {
            hideSuggestions();
            return;
        }

        data.results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="suggestion-name">${result.name}</div>
                <div class="suggestion-detail">${result.admin1 || ''}, ${result.country}</div>
            `;
            item.addEventListener('click', () => {
                searchInput.value = result.name;
                handleSearch(result.name);
                hideSuggestions();
            });
            suggestions.appendChild(item);
        });

        suggestions.classList.add('show');
    } catch (err) {
        console.error("Error fetching suggestions:", err);
        hideSuggestions();
    }
}

function hideSuggestions() {
    suggestions.classList.remove('show');
}

// Main function to handle search and fetch weather data
async function handleSearch(location) {
    if (!location.trim() || isLoading) return;
    
    setLoading(true);
    hideError();
    
    try {
        // Get coordinates from location name
        const geocodeResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );
        const geocodeData = await geocodeResponse.json();
        
        if (!geocodeData.results || geocodeData.results.length === 0) {
            throw new Error('Location not found');
        }
        
        const { latitude, longitude, name, country } = geocodeData.results[0];
        
        // Get weather data
        const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
        const windUnit = units === 'imperial' ? 'mph' : 'kmh';
        const precipUnit = precipitationUnit === 'inch' ? 'inch' : 'mm';
        
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto&forecast_days=7`
        );
        const weatherApiData = await weatherResponse.json();
        
        // Transform API data
        weatherData = transformWeatherData(weatherApiData, name, country);
        
        displayWeatherData();
        showWeatherContent();
        
    } catch (err) {
        showError(err.message || 'Failed to fetch weather data');
    } finally {
        setLoading(false);
    }
}

function transformWeatherData(apiData, name, country) {
    const temperatureUnit = units === 'imperial' ? '°F' : '°C';
    const windUnit = units === 'imperial' ? 'mph' : 'km/h';
    const precipUnit = precipitationUnit === 'inch' ? 'inch' : 'mm';
    
    return {
        location: name,
        country: country,
        date: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        }),
        temperature: Math.round(apiData.current.temperature_2m),
        temperatureUnit,
        condition: getWeatherCondition(apiData.current.weather_code),
        icon: getWeatherIcon(apiData.current.weather_code),
        feelsLike: Math.round(apiData.current.apparent_temperature),
        humidity: apiData.current.relative_humidity_2m,
        windSpeed: Math.round(apiData.current.wind_speed_10m),
        windUnit,
        precipitation: (apiData.current.precipitation !== null && apiData.current.precipitation !== undefined) ? 
            Number(apiData.current.precipitation.toFixed(1)) : 0,
        precipitationUnit: precipUnit,
        daily: apiData.daily.time.map((date, index) => ({
            date,
            day: index === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
            high: Math.round(apiData.daily.temperature_2m_max[index]),
            low: Math.round(apiData.daily.temperature_2m_min[index]),
            condition: getWeatherCondition(apiData.daily.weather_code[index]),
            icon: getWeatherIcon(apiData.daily.weather_code[index])
        })),
        hourly: apiData.hourly.time.map((time, index) => ({
            time: new Date(time).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
            }),
            date: new Date(time).toDateString(),
            temperature: Math.round(apiData.hourly.temperature_2m[index]),
            condition: getWeatherCondition(apiData.hourly.weather_code[index]),
            icon: getWeatherIcon(apiData.hourly.weather_code[index])
        }))
    };
}

function displayWeatherData() {
    if (!weatherData) return;
    
    // Hide loading and show weather info
    const loadingIndicator = document.getElementById('loadingIndicator');
    const weatherInfo = document.getElementById('weatherInfo');
    const currentWeatherEl = document.getElementById('currentWeather');
    
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (weatherInfo) {
        weatherInfo.style.display = 'flex';
        weatherInfo.style.justifyContent = 'space-between';
        weatherInfo.style.alignItems = 'center';
    }
    if (currentWeatherEl) currentWeatherEl.classList.remove('loading-state');
    
    // Current weather
    if (locationName) locationName.textContent = `${weatherData.location}, ${weatherData.country}`;
    if (locationDate) locationDate.textContent = weatherData.date;
    if (weatherIcon) weatherIcon.textContent = weatherData.icon;
    if (currentTemp) currentTemp.textContent = `${weatherData.temperature}${weatherData.temperatureUnit}`;
    if (weatherCondition) weatherCondition.textContent = weatherData.condition;
    
    // Weather metrics
    if (feelsLike) feelsLike.textContent = `${weatherData.feelsLike}${weatherData.temperatureUnit}`;
    if (humidity) humidity.textContent = `${weatherData.humidity}%`;
    if (windSpeed) windSpeed.textContent = `${weatherData.windSpeed} ${weatherData.windUnit}`;
    if (precipitation) precipitation.textContent = `${weatherData.precipitation} ${weatherData.precipitationUnit}`;
    
    // Daily forecast
    displayDailyForecast();
    
    // Hourly forecast
    displayHourlyForecast();
    
    // Update day selector
    updateDaySelector();
}

function displayDailyForecast() {
    dailyForecastGrid.innerHTML = '';
    
    weatherData.daily.forEach((day, index) => {
        const item = document.createElement('button');
        item.className = `daily-forecast-item ${selectedDay === index ? 'active' : ''}`;
        item.innerHTML = `
            <div class="daily-day">${day.day}</div>
            <div class="daily-icon">${day.icon}</div>
            <div class="daily-high">${day.high}${weatherData.temperatureUnit}</div>
            <div class="daily-low">${day.low}${weatherData.temperatureUnit}</div>
        `;
        item.addEventListener('click', () => selectDay(index));
        dailyForecastGrid.appendChild(item);
    });
}

function displayHourlyForecast() {
    hourlyForecastList.innerHTML = '';
    
    // weatherData.hourly.forEach((hour, index) => {
        // Get the selected day's date
    const selectedDate = new Date(weatherData.daily[selectedDay].date).toDateString();
    
    // Filter hourly data for the selected day
    const selectedDayHours = weatherData.hourly.filter(hour => hour.date === selectedDate);
    
    selectedDayHours.forEach((hour, index) => {

        const item = document.createElement('div');
        item.className = 'hourly-item';
        item.innerHTML = `
            <div class="hourly-left">
                <div class="hourly-icon">${hour.icon}</div>
                <div class="hourly-time">${hour.time}</div>
            </div>
            <div class="hourly-temp">${hour.temperature}${weatherData.temperatureUnit}</div>
        `;
        hourlyForecastList.appendChild(item);
    });
}

function updateDaySelector() {
    daySelector.innerHTML = '';
    
    weatherData.daily.forEach((day, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = day.day;
        if (index === selectedDay) option.selected = true;
        daySelector.appendChild(option);
    });
}

function selectDay(dayIndex) {
    selectedDay = dayIndex;
    displayDailyForecast();
    // daySelector.value = dayIndex;
    displayHourlyForecast();
    daySelector.value = dayIndex;
}

function handleDaySelect(e) {
    const dayIndex = parseInt(e.target.value);
    selectDay(dayIndex);
}

function toggleUnitsDropdown() {
    const unitsToggle = unitsButton.parentElement;
    unitsToggle.classList.toggle('open');
}

function closeUnitsDropdown() {
    const unitsToggle = unitsButton.parentElement;
    unitsToggle.classList.remove('open');
}

function handleUnitChange(e) {
    const unitType = e.target.dataset.unit;
    
    // Update active state
    const unitSection = e.target.closest('.unit-section');
    const unitBtns = unitSection.querySelectorAll('.unit-btn');
    unitBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update units and re-fetch if needed
    let needsRefetch = false;
    
    if (unitType === 'celsius' || unitType === 'fahrenheit') {
        const newUnits = unitType === 'celsius' ? 'metric' : 'imperial';
        if (newUnits !== units) {
            units = newUnits;
            needsRefetch = true;
        }
    } else if (unitType === 'mm' || unitType === 'inch') {
        if (unitType !== precipitationUnit) {
            precipitationUnit = unitType;
            needsRefetch = true;
        }
    }
    
    if (needsRefetch && weatherData) {
        // Re-fetch data with new units
        handleSearch(weatherData.location);
    }
    
    closeUnitsDropdown();
}

function setLoading(loading) {
    isLoading = loading;
    const searchText = searchButton.querySelector('.search-text');
    const loadingText = searchButton.querySelector('.loading-text');
    
    if (loading) {
        searchText.style.display = 'none';
        loadingText.style.display = 'inline';
        searchButton.disabled = true;
        searchInput.disabled = true;
    } else {
        searchText.style.display = 'inline';
        loadingText.style.display = 'none';
        searchButton.disabled = false;
        searchInput.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherContent.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showWeatherContent() {
    hideError();
    weatherContent.style.display = 'block';
}

// Weather condition mapping
function getWeatherCondition(code) {
    const conditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
    };
    return conditions[code] || 'Unknown';
}

// Weather icon mapping
function getWeatherIcon(code) {
    const icons = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌦️',
        61: '🌧️',
        63: '🌧️',
        65: '🌧️',
        71: '🌨️',
        73: '🌨️',
        75: '❄️',
        77: '🌨️',
        80: '🌦️',
        81: '🌦️',
        82: '🌧️',
        85: '🌨️',
        86: '❄️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };
    return icons[code] || '❓';
}