const inputText = document.querySelector(".input-text");
const searchBtn = document.querySelector(".searchbtn");
const locationBtn = document.querySelector(".location_btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_key = "ee17af958ed63e7cf7650cb3798c1b0c";
const createWeatherCard = (cityName, weatherItem, index) => {
  if(index === 0){
      return `<div class="details">
                <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4 class="text-contetnt">Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4 class="text-contetnt">Wind: ${weatherItem.wind.speed}M/S</h4>
                <h4 class="text-contetnt">Humidity: ${weatherItem.main.humidity}%</h4>
              </div>
              <div class="icon">
               <div class="img-icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Rain">
               </div>
               <h4>${weatherItem.weather[0].description}</h4>
              </div>`
  }else{
    return ` <li class="card">
               <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
               <div class="img-icon">
                 <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Rain">
               </div>
               <h4 class="text-contetnt">Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
               <h4 class="text-contetnt">Wind: ${weatherItem.wind.speed}M/S</h4>
               <h4 class="text-contetnt">Humidity: ${weatherItem.main.humidity}%</h4>
             </li>`;
  }
  
}
const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
  fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
    const uniqueforecastDay = [];
    //console.log(data);
    const fiveDaysForecast = data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueforecastDay.includes(forecastDate)) {
        return uniqueforecastDay.push(forecastDate);
      }
    });
    cityName.value= "";
    weatherCardsDiv.innerHTML = "";
    currentWeatherDiv.innerHTML = "";
   // console.log(fiveDaysForecast);
    fiveDaysForecast.forEach((weatherItem, index) => {
      if(index === 0){
        currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
       }else{
        weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
      }
     
    })
  }).catch(() => {
    alert("An error occurred while fetching the Weather Forecast");
  })
}
const getCity = () => {
  const cityName = inputText.value.trim();
  if (!cityName) return;
  // console.log(cityName);
  const geocoding_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
  fetch(geocoding_API_URL).then(res => res.json()).then(data => {
    if (!data.length) return alert(`No coordinates found for ${cityName}`);
    const { name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon);
  }).catch(() => {
    alert("An error occurred while fetching the API");
  });
}
const getUserCoordinates = () => {
navigator.geolocation.getCurrentPosition(
  position =>{
   const {latitude, longitude} = position.coords;
   const reverse_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
   fetch( reverse_GEOCODING_URL).then(res => res.json()).then(data => {
    const { name} = data[0];
    getWeatherDetails(name, latitude, longitude);
  }).catch(() => {
    alert("An error occurred while fetching City");
  });
  },
  error =>{
    if(error.coords === error.PERMISSION_DENIED){
      alert("Geolocation request denied")
    }
  }
)
}
searchBtn.addEventListener("click", getCity);
locationBtn.addEventListener("click", getUserCoordinates);