import { useState, useEffect } from 'react';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import './App.css';

function App() {
  const [city, setCity] = useState('Karachi'); 
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeatherData = async (searchCity) => {
    if (!searchCity) return;
    setLoading(true);
    setError(null);

    const current_url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`;
    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=metric&appid=${API_KEY}`;

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(current_url),
        fetch(forecast_url)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found. Check spelling!");
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecast);
      setCity(searchCity);

    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  // Determine background class based on weather condition
  const weatherClass = weather ? weather.weather[0].main.toLowerCase() : 'default';

  return (
    <div className={`main-wrapper ${weatherClass}`}>
      <div className="dashboard-container">
        <header>
          <h1>Weather Dashboard</h1>
        </header>
        
        <Search onSearch={fetchWeatherData} />

        {loading && <div className="loader">Updating dashboard metrics...</div>}
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