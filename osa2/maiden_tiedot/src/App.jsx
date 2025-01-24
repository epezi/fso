import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import countryService from './services/country'
import CountryInfo from './components/CountryInfo'
import weatherService from './services/weather'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [showCountries, setShowCountries] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [showCountry, setShowCountry] = useState(null)
  const [weather, setWeather] = useState(null)  

  useEffect(() => {
    console.log('effect')
    
    countryService
      .getAll()
      .then(initialCountries => {
        console.log('promise fulfilled')
        setCountries(initialCountries)
      })
  }, [])

  const handleClick = (name) => {
    const country = countries.find(c => c.name.common === name)
    setShowCountry(country)
    setShowCountries(false)
    weatherService
      .getWeather(country.capital)
      .then(response => {
        setWeather(response)
      })
    setFilter('')
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    const filterValue = event.target.value
    setFilter(filterValue)
    const filtered = countries.filter(country => country.name.common
      .toLowerCase().includes(filterValue.toLowerCase()))
    setFilteredCountries(filtered)
    if (filtered.length > 1 && filtered.length <= 10) {
      setShowCountries(true)
      setShowCountry(null)
      
    } else if (filtered.length === 1) {
      setShowCountries(false)
      setShowCountry(filtered[0])
      console.log('capital', filtered[0].capital)
      weatherService
        .getWeather(filtered[0].capital)
        .then(response => {
          setWeather(response)
        })
    } else {
      setShowCountries(false)
      setShowCountry(null)
    }
  }

  return (
    <div>
      <Filter filter={filter} handleChange={handleFilterChange} />
      {showCountries ? (
        <Countries countries={filteredCountries} handleClick={handleClick} />
      ) : showCountry && weather ? (
        <CountryInfo country={showCountry} weather={weather} />
      ) : (
        <p>Too many matches, specify another filter</p>
      )}
    </div>
  )
}

export default App