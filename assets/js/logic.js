const searchFormEl = document.querySelector('#search-form');
const cityButtonsEl = document.querySelector('#city-buttons');
const cityInputEl = document.querySelector('#city');
const cityContainerEl = document.querySelector('#city-container');
const citySearchTerm = document.querySelector('#city-search-term');

//handle search
const formSubmitHandler = function (event) {
  event.preventDefault();

  const citySearch = cityInputEl.value.trim();

  if (citySearch) {
    getWeather(citySearch);

    cityContainerEl.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter a valid city');
  }
};


//display featured city
const buttonClickHandler = function (event) {
  const city = event.target.getAttribute('data-city');

  if (city) {
    getFeaturedCities(city);

    cityContainerEl.textContent = '';
  }
};

//use API to get weather data from city searched for
const getWeather = function (city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayCities(data, city);
        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to get weather data.');
    });
};

//use API to get weather data from featured city
const getFeaturedCities = function (city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayCities(data.items, city);
      });
    } else {
      alert(`Error:${response.statusText}`);
    }
  });
};

//display searched city
const displayCities = function (cities, searchTerm) {
  if (cities.length === 0) {
    cityContainerEl.textContent = 'Cities not found.';
    return;
  }

  citySearchTerm.textContent = searchTerm;

  for (let cityObj of cities) {
    const cityName = `${cityObj.owner.login}/${cityObj.name}`;

    const cityEl = document.createElement('div');
    cityEl.classList = 'list-item flex-row justify-space-between align-center';

    const titleEl = document.createElement('span');
    titleEl.textContent = cityName;

    cityEl.appendChild(titleEl);

    const statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (cityObj.open_issues_count > 0) {
      statusEl.innerHTML =
        `<i class='fas fa-times status-icon icon-danger'></i>${cityObj.open_issues_count} issue(s)`;
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    cityEl.appendChild(statusEl);

    cityContainerEl.appendChild(cityEl);
  }
};

//event listeners for buttons
searchFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);