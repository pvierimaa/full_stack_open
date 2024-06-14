import React from 'react'
import Weather from './Weather'

const Country = ({ showCountry }) => {
  return (
    <div>
      <h1>{showCountry.name.common}</h1>
      <div>capital {showCountry.capital}</div>
      <div>area {showCountry.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.entries(showCountry.languages).map(([key, language]) => (
          <li key={key}>{language}</li>
        ))}
      </ul>
      <img src={showCountry.flags.png} alt={showCountry.flags.alt} width="200" />
      <Weather capital={showCountry.capital} />  
    </div>
  )
}

export default Country