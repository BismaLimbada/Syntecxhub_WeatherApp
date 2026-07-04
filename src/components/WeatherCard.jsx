function WeatherCard({ data }) {
  const { name, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="weather-card">
      <div className="card-header">
        <h2>{name}</h2>
        <p className="weather-desc">{weather[0].description}</p>
      </div>
      <div className="card-body">
        <img src={iconUrl} alt={weather[0].description} className="weather-icon" />
        <h1 className="temperature">{Math.round(main.temp)}°C</h1>
      </div>
      <div className="card-footer">
        <div className="info-block">
          <span className="label">Feels Like</span>
          <span className="value">{Math.round(main.feels_like)}°C</span>
        </div>
        <div className="info-block">
          <span className="label">Humidity</span>
          <span className="value">{main.humidity}%</span>
        </div>
        <div className="info-block">
          <span className="label">Wind Speed</span>
          <span className="value">{wind.speed} m/s</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;