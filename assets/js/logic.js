const searchFormEl = document.querySelector('#search-form'); //search form
const cityInputEl = document.querySelector('#city'); //search field
const cityButtonsEl = document.querySelector('#city-buttons'); //previously searched for cities
const cityContainerEl = document.querySelector('#city-container'); //today's weather
const fiveDayCity = document.querySelector('#five-day-container'); //5 day forecast
//const citySearchTerm = document.querySelector('#city-search-term');
const key = "32740c99c57ef895dc921d7b77438e20";

//create array for searched cities
let searchHistory = [];

//pull from local storage the previous arrays and parse from string to object array
function init() {
  const searchedCities = JSON.parse(localStorage.getItem('searchHistory'));
  if (searchedCities !== null) {
    searchHistory = searchedCities;
  }
  console.log(searchHistory)
}

//creates buttons on left side for each city searched
function renderSearchHistory() {
  cityButtonsEl.innerHTML = '';
  for (let i = 0; i < searchHistory.length; i++) {
    const search = searchHistory[i];

    const div = document.createElement ('div');
    const par = document.createElement ('p');
    par.textContent = search;
    div.appendChild(par);
    div.dataset.city = `${search}`;
    div.setAttribute("class", "btn");
    cityButtonsEl.appendChild(div);
  }
}

//store object array into local storage
function storeHistory() {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  //console.log(searchHistory)
}

function newSearch(data) {
  //push new search to array
  searchHistory.push(data);
  data.value = '';
  //store array to local storage
  storeHistory()
  //console.log(searchHistory)
}

//handle search
const formSubmitHandler = function () {
  const citySearch = cityInputEl.value.trim();
  cityContainerEl.textContent = '';
  cityInputEl.value = '';
  //console.log(citySearch)
  newSearch(citySearch)
  if (!citySearch) {
    alert('Please enter a valid city')
  } else {
    getLL(citySearch)
  }
  renderSearchHistory()
};


//display search history
const buttonClickHandler = function (event) {
  const city = event.target.textContent;
  console.log(city);
  cityContainerEl.textContent = '';
  cityInputEl.value = '';
  getLL(city);
  //getFive(city);
};

// get lat and lon
const getLL = function (city) {
  const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`;
  //console.log(city);

  fetch(apiUrl)
    .then(function (response) {
      
        return response.json() })
    .then(function (data) {
        //console.log(data);
        const lat = data[0].lat;
        const lon = data[0].lon;
        getWeather(lat, lon);
        getFive(lat, lon);
        console.log(lat, lon);
    })
    
    .catch(function (error) {
      console.log(error)
      alert('Unable to get weather data.')
    })
  };

//use API to get weather data from city searched for
const getFive = function (lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

  fetch(apiUrl)
  .then(function (response) {
      
    return response.json() })
  .then(function (data) {
    console.log(data)
    const forecasts = data.list;
    for (let i=8; i<forecasts.length; i+=8) {
      const date = forecasts[i].dt_txt;
      const nuDate = date.slice(0, 10);
      const icon = forecasts[i].weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      const kelvin = forecasts[i].main.temp;
      const deg = (kelvin -273.15) * 1.8 + 32;
      const degree = deg.toFixed(3);
      const wind = forecasts[i].wind.speed;
      const humid = forecasts[i].main.humidity
      displayFive(nuDate, iconUrl, degree, wind, humid)
    }
  })

  .catch(function (error) {
  console.log(error)
  alert('Unable to get weather data.')
  })
};

//use API to get weather data from city searched for
const getWeather = function (lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

  fetch(apiUrl)
  .then(function (response) {
      
    return response.json() })
  .then(function (data) {
    let i = 0;
    let name = data.city.name;
    let date = data.list[i].dt_txt;
    let nuDate = date.slice(0, 10);
    let icon = data.list[i].weather[i].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    let kelvin = data.list[i].main.temp;
    let deg = (kelvin -273.15) * 1.8 + 32;
    let degree = deg.toFixed(3);
    let wind = data.list[i].wind.speed;
    let humid = data.list[i].main.humidity
    cityCurrent(name, nuDate, iconUrl, degree, wind, humid);
    
  })
  
  
  .catch(function (error) {
    console.log(error)
    alert('Unable to get weather data.')
    })
  };




//display searched city
const cityCurrent = function (name, date, icon, deg, wind, humid) {
  
    const cityEl = document.createElement('div');
    cityEl.classList = 'list-item';

    const nameEl = document.createElement('span');
    nameEl.textContent = `${name}   `;
    cityEl.appendChild(nameEl);

    const dateEl = document.createElement('span');
    dateEl.textContent = `   ${date}      `;
    cityEl.appendChild(dateEl);

    const iconEl = document.createElement('img');
    iconEl.src = icon;
    cityEl.appendChild(iconEl);

    const temperature = document.createElement('p');
    temperature.textContent = "\n" + "Temp: " + deg;
    cityEl.appendChild(temperature);

    const windEl = document.createElement('p');
    windEl.textContent = "\n" + "Wind: " + wind;
    cityEl.appendChild(windEl);

    const humidity = document.createElement('p');
    humidity.textContent = "\n" + "Humidity: " + humid;
    cityEl.appendChild(humidity);

    cityContainerEl.appendChild(cityEl);
};

//display searched city
const displayFive = function (date, icon, deg, wind, humid) {
  console.log(date, icon, deg, wind, humid)
  
  const cityEl = document.createElement('div');
  cityEl.classList = 'list-item';

  const dateEl = document.createElement('p');
  dateEl.textContent = date;
  cityEl.appendChild(dateEl);

  const iconEl = document.createElement('img');
    iconEl.src = icon;
    cityEl.appendChild(iconEl);

  const temperature = document.createElement('p');
  temperature.textContent = "\n" + "Temp: " + deg;
  cityEl.appendChild(temperature);

  const windEl = document.createElement('p');
  windEl.textContent = "\n" + "Wind: " + wind;
  cityEl.appendChild(windEl);

  const humidity = document.createElement('p');
  humidity.textContent = "\n" + "Humidity: " + humid;
  cityEl.appendChild(humidity);

  fiveDayCity.appendChild(cityEl);

};

//event listeners for buttons
searchFormEl.addEventListener('submit', function(event){
  event.preventDefault()
  console.log("you clicked the button")
  formSubmitHandler() } );
cityButtonsEl.addEventListener('click', buttonClickHandler);

init()
renderSearchHistory()