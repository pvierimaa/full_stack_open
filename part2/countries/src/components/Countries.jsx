import React from 'react'
import Button from './Button'
import Country from './Country'

const Countries = ({ filteredCountries, setSelectedCountry }) => {
  if (filteredCountries.length === 1) {
    return (
    <div>
      <Country showCountry = {filteredCountries[0]} />
    </div>
    )
  } else if (filteredCountries.length < 10) {
  return (
  <div>
      {filteredCountries.map(country => (
      <div key={country.cca3}>
        {country.name.common} 
        <Button handleClick={() => setSelectedCountry(country)} text="show" />
      </div>
      ))}
  </div>     
      )
  } else {
    return (
    <div>
    Too many matches, specify another filter
    </div>
    )
  }
}

export default Countries