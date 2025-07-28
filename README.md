# Weather App

A modern, responsive weather application built with HTML5, CSS3, and JavaScript. Features real-time weather data, 5-day forecasts, and beautiful animations.

## ✨ Features

- **Current Weather Display**: Temperature, humidity, wind speed, pressure, and more
- **5-Day Forecast**: Extended weather predictions with daily high/low temperatures
- **Location-Based Weather**: Automatic detection of user's current location
- **City Search**: Search for weather in any city worldwide
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient backgrounds, smooth animations, and intuitive interface
- **Error Handling**: Graceful error messages and loading states

## 🚀 Getting Started

### Prerequisites

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. A modern web browser with JavaScript enabled

### Installation

1. Clone or download this repository
2. Open `script.js` and add your OpenWeatherMap API key:
   ```javascript
   const API_KEY = 'your_api_key_here';
   ```
3. Open `index.html` in your web browser

### Demo Mode

If you don't have an API key, the app will automatically switch to demo mode after 3 seconds, showing sample weather data for testing purposes.

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with:
  - Flexbox and Grid layouts
  - CSS animations and transitions
  - Responsive design with media queries
  - Custom properties and gradients
  - Backdrop filters and box shadows
- **JavaScript (ES6+)**: 
  - Async/await for API calls
  - Geolocation API
  - DOM manipulation
  - Error handling
  - Modular code structure

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful blue gradient theme
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Icons**: Weather-appropriate FontAwesome icons
- **Interactive Elements**: Hover effects and button animations
- **Loading States**: Animated spinners and smooth transitions

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 API Integration

The app uses the OpenWeatherMap API for:
- Current weather data (`/weather` endpoint)
- 5-day weather forecast (`/forecast` endpoint)
- Geolocation-based weather lookup

## 📄 File Structure

```
weather-app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## 🎯 Key Components

### Weather Display
- Current temperature and conditions
- Weather icon based on current conditions
- Location name with country code
- Detailed weather metrics

### Forecast Section
- 5-day weather forecast
- Daily high/low temperatures
- Weather descriptions and icons
- Interactive forecast cards

### Search Functionality
- City name search with autocomplete
- Current location detection
- Error handling for invalid searches

## 🌟 Future Enhancements

- [ ] Hourly weather forecast
- [ ] Weather maps integration
- [ ] Multiple location favorites
- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Weather charts and graphs
- [ ] Dark/light theme toggle
- [ ] Offline functionality

## 📞 Support

For issues or questions:
1. Check that your API key is correctly set
2. Ensure you have an internet connection
3. Verify browser compatibility
4. Check browser console for any errors

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This weather app requires an active internet connection and a valid OpenWeatherMap API key for full functionality.