import axios from "axios"

const api_key = import.meta.env.VITE_SOME_KEY
const baseUrl = `https://api.openweathermap.org/data/2.5/weather`

const getWeather = (city) => {
    console.log('city', city)
    console.log('api_key', api_key)
    const request = axios.get(`${baseUrl}?q=${city}&appid=${api_key}`)
    console.log('weather request', request)
    return request.then(response => response.data)
}

export default { getWeather }
