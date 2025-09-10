# Frontend Mentor - Weather app solution

This is a solution to the [Weather app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Search for weather information by entering a location in the search bar
- View current weather conditions including temperature, weather icon, and location details
- See additional weather metrics like "feels like" temperature, humidity percentage, wind speed, and precipitation amounts
- Browse a 7-day weather forecast with daily high/low temperatures and weather icons
- View an hourly forecast showing temperature changes throughout the day
- Switch between different days of the week using the day selector in the hourly forecast section
- Toggle between different measurement units via the units dropdown:
  - Temperature units (Celsius and Fahrenheit)
  - Wind speed units (km/h and mph)
  - Precipitation units (millimeters and inches)
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot
- LOADING STATE/SCREEN
[![Loading State](./public/screenshots/Screenshot%202025-09-09%20at%2001.04.08.png)](https://github.com/Joshbill-pixel/weather-app.git)


- APP FULLY LOADED/DISPLAYED
[![Main Screen](./public/screenshots/Screenshot%202025-09-09%20at%2004.10.19.png)](https://github.com/Joshbill-pixel/weather-app.git)


- UNIT DROPDOWN
[![Unit Dropdown](./public/screenshots/Screenshot%202025-09-10%20at%2002.25.31.png)](https://github.com/Joshbill-pixel/weather-app.git)


[![Alt text](./public/screenshots/Screenshot%202025-09-10%20at%2002.26.12.png)](https://github.com/Joshbill-pixel/weather-app.git)


- SEARCH SUGGESTIONS
[![Search Suggestion](./public/screenshots/Screenshot%202025-09-10%20at%2002.31.33.png)](https://github.com/Joshbill-pixel/weather-app.git)


[![Alt text](./public/screenshots/Screenshot%202025-09-10%20at%2002.32.09.png)](https://github.com/Joshbill-pixel/weather-app.git)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript
- OpenWeatherMap API
- Responsive design

### What I learned

This project helped me practice working with weather APIs and implementing dynamic unit conversion systems. I learned how to handle different measurement units for temperature, wind speed, and precipitation.

```js
// Unit conversion for precipitation
function convertPrecipitation(value, unit) {
  if (unit === 'inch') {
    return (value * 0.0393701).toFixed(2);
  }
  return value.toFixed(1);
}
```

### Continued development

I want to continue focusing on:
- API error handling and loading states
- More advanced weather data visualization
- Implementing weather alerts and notifications
- Adding geolocation functionality

### Useful resources

- [OpenWeatherMap API](https://openweathermap.org/api) - Great weather data API with comprehensive documentation
- [MDN Web Docs](https://developer.mozilla.org/) - Essential reference for JavaScript and web APIs

## Author

- Website - [Add your name here](https://www.your-site.com)
- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/yourusername)
- Twitter - [@yourusername](https://www.twitter.com/yourusername)

## Acknowledgments

Thanks to Frontend Mentor for providing this realistic weather app challenge that helped improve my API integration and responsive design skills.