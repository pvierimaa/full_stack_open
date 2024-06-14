import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  
  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [capital])
  
  if (!weather) {
    return <div>Loading weather...</div>
  }
  
  const temperatureCelsius = (weather.main.temp - 273.15).toFixed(2)
  
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>temperature {temperatureCelsius} Celsius</div>
      <img alt="weather icon" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather