const CountryInfo = ({ country, weather }) => {
    console.log('icon', weather.weather[0].icon)
    const icon = weather.weather[0].icon 
    return(
        <div>
            <h1>{country.name.common}</h1>

            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <div>
                <h3>Languages:</h3>
                <ul>
                    {Object.values(country.languages).map((language, index) => (
                        <li key={index}>{language}</li>
                    ))}
                </ul>
            </div>
            <img src={country.flags.png}/>
            <h3>Weather in {country.capital}</h3>
            <p>temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/>
            <p>wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default CountryInfo