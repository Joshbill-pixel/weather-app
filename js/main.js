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
    // Load default location (Berlin)
    handleSearch('Berlin');
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