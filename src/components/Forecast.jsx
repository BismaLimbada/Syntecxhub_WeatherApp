function Forecast({ data }) {
  // Utility function to turn text dates into Day names (e.g., "Monday")
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="forecast-section">
      <h3>5-Day Forecast</h3>
      <div className="forecast-container">
        {data.map((item, index) => {
          const dayIconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
          return (
            <div key={index} className="forecast-item">
              <p className="forecast-day">{getDayName(item.dt_txt)}</p>
              <img src={dayIconUrl} alt={item.weather[0].description} />
              <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
              <p className="forecast-status">{item.weather[0].main}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;