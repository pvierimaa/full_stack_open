import { useState, useEffect } from 'react'
import axios from 'axios'
import Show from './components/Show'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
        })
  }, [])

  useEffect(() => {
    setFilteredCountries(
      countries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      )
    )
  }, [value])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSelectedCountry(null)
  }

  return (
    <div>
      <form>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Show 
      selectedCountry={selectedCountry} 
      filteredCountries={filteredCountries} 
      setSelectedCountry={setSelectedCountry} 
      />
    </div>
  )
}

export default App