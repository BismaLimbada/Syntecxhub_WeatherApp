import { useState, useEffect } from 'react';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import './App.css';

function App() {
  const [city, setCity] = useState('Karachi'); // Fallback default city
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Modified to handle both text string searches and coordinate object searches
  const fetchWeatherData = async (searchParam) => {
    if (!searchParam) return;
    setLoading(true);
    setError(null);

    let current_url = '';
    let forecast_url = '';

    if (typeof searchParam === 'string') {
      // Searching by city name string
      current_url = `https://api.openweathermap.org/data/2.5/weather?q=${searchParam}&units=metric&appid=${API_KEY}`;
      forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchParam}&units=metric&appid=${API_KEY}`;
    } else if (searchParam.lat && searchParam.lon) {
      // Searching by geographical coordinates
      current_url = `https://api.openweathermap.org/data/2.5/weather?lat=${searchParam.lat}&lon=${searchParam.lon}&units=metric&appid=${API_KEY}`;
      forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${searchParam.lat}&lon=${searchParam.lon}&units=metric&appid=${API_KEY}`;
    }

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(current_url),
        fetch(forecast_url)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("Location data unavailable.");
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecast);
      setCity(weatherData.name); // Sync the city state with what the API returned

    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Automatically request device location on application startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData({ lat: latitude, lon: longitude });
        },
        (geoError) => {
          // If user denies location access, load the fallback city (Karachi) smoothly
          console.log("Location access denied, loading default city.");
          fetchWeatherData(city);
        }
      );
    } else {
      // Browser doesn't support geolocation feature
      fetchWeatherData(city);
    }
  }, []);

  const weatherClass = weather ? weather.weather[0].main.toLowerCase() : 'default';

  return (
    <div className={`main-wrapper ${weatherClass}`}>
      <div className="dashboard-container">
        <header>
          <h1>Weather Dashboard</h1>
        </header>
        
        <Search onSearch={fetchWeatherData} />

        {loading && <div className="loader">Detecting localized weather metrics...</div>}
        {error && <div className="error-card">⚠️ {error}</div>}

        {!loading && !error && (
          <main className="dashboard-grid">
            {weather && <WeatherCard data={weather} />}
            {forecast && <Forecast data={forecast} />}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;