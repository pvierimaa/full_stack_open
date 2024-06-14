import React from 'react'
import Countries from './Countries'
import Country from './Country'

const Show = ({ selectedCountry, filteredCountries, setSelectedCountry }) => {
  return (
    <div>
    {selectedCountry ? (
      <Country showCountry={selectedCountry} />
    ) : (
      <Countries 
      filteredCountries={filteredCountries} 
      setSelectedCountry={setSelectedCountry} 
      />
    )}
    </div>
  )
}

export default Show