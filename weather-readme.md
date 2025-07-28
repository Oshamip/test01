# WeatherNow - Modern Weather Application

A beautiful, responsive weather application built with HTML5, CSS3, and JavaScript featuring real-time weather data, forecasts, and location-based services.

![Weather App Preview](https://via.placeholder.com/800x400/74b9ff/ffffff?text=WeatherNow+Preview)

## 🌟 Features

### 🌤️ Current Weather
- **Real-time weather data** with automatic updates
- **Current temperature** with "feels like" temperature
- **Weather conditions** with descriptive icons
- **Detailed metrics**: humidity, pressure, visibility, UV index
- **Wind information** with interactive compass
- **Sunrise/sunset times**

### 📅 Forecasts
- **24-hour hourly forecast** with scrollable interface
- **7-day weekly forecast** with high/low temperatures
- **Weather icons** for all forecast periods

### 🗺️ Location Services
- **Geolocation support** - automatic current location detection
- **City search** with autocomplete suggestions
- **Recent searches** - quick access to previously searched cities
- **Global coverage** - search any city worldwide

### 🎨 Modern UI/UX
- **Responsive design** - works on all devices
- **Beautiful gradients** and glass-morphism effects
- **Smooth animations** and transitions
- **Dark/light themed elements**
- **Interactive components** with hover effects

### ⚙️ Advanced Features
- **Air quality information** with AQI indicators
- **Moon phase calculations**
- **Wind compass** with directional indicators
- **Multiple unit systems** (metric/imperial/kelvin)
- **Auto-refresh** functionality
- **Settings panel** for customization
- **Local storage** for preferences

## 🚀 Quick Start

### 1. Get an API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key from your dashboard

### 2. Setup the Application
1. Clone or download the project files
2. Open `weather-script.js`
3. Replace `'your_openweathermap_api_key_here'` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

### 3. Run the Application
1. Open `weather-app.html` in your web browser
2. Allow location access when prompted (optional)
3. Start exploring the weather!

## 📁 File Structure

```
weather-app/
├── weather-app.html      # Main HTML file
├── weather-style.css     # Styles and animations
├── weather-script.js     # JavaScript functionality
└── weather-readme.md     # This documentation
```

## 🔧 Configuration

### API Settings
The app uses the OpenWeatherMap API with these endpoints:
- **Current Weather**: `api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `api.openweathermap.org/data/2.5/forecast`
- **Geocoding**: `api.openweathermap.org/geo/1.0/direct`
- **One Call API**: `api.openweathermap.org/data/3.0/onecall` (optional)

### Customizable Settings
- **Temperature Units**: Celsius, Fahrenheit, Kelvin
- **Wind Speed Units**: km/h, mph, m/s
- **Time Format**: 12-hour or 24-hour
- **Auto Refresh**: Enable/disable automatic updates

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 60+ ✅   |
| Firefox | 55+ ✅   |
| Safari  | 11+ ✅   |
| Edge    | 16+ ✅   |

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🎛️ API Features Used

### Free Tier (Included)
- ✅ Current weather data
- ✅ 5-day/3-hour forecast
- ✅ Geocoding API
- ✅ Weather icons

### Premium Features (Optional)
- 🔄 One Call API (hourly forecast, UV index, air quality)
- 🔄 Weather maps
- 🔄 Historical data

## 🔒 Privacy & Security

- **No personal data collection**
- **Location data** used only for weather queries
- **API key** should be kept secure (consider environment variables for production)
- **HTTPS recommended** for production deployment

## 🛠️ Customization

### Changing Colors
Edit the CSS custom properties in `weather-style.css`:
```css
:root {
    --primary-color: #74b9ff;
    --secondary-color: #0984e3;
    --accent-color: #6c5ce7;
}
```

### Adding Features
The modular JavaScript structure makes it easy to add new features:
- Add new API endpoints in the configuration section
- Create new UI components following the existing patterns
- Extend the settings system for new preferences

### Weather Icons
The app uses OpenWeatherMap's icon set. You can replace with custom icons by modifying the `updateCurrentWeather()` function.

## 🐛 Troubleshooting

### Common Issues

**"Please set your OpenWeatherMap API key"**
- Solution: Replace the placeholder API key in `weather-script.js`

**Location not working**
- Solution: Ensure HTTPS is used and location permissions are granted

**Weather data not loading**
- Check API key validity
- Verify internet connection
- Check browser console for error messages

**Styling issues on mobile**
- Clear browser cache
- Ensure viewport meta tag is present

## 🔄 Updates & Maintenance

### Regular Updates
- API key rotation (recommended annually)
- Dependency updates for CDN resources
- Browser compatibility testing

### Performance Optimization
- Image optimization for weather icons
- API request caching
- Code minification for production

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Check the troubleshooting section
- Review OpenWeatherMap API documentation

## 🙏 Acknowledgments

- **OpenWeatherMap** for the weather API
- **Font Awesome** for the icons
- **Google Fonts** for typography
- **CSS-Tricks** for responsive design patterns

---

**Made with ❤️ using vanilla JavaScript, CSS3, and HTML5**