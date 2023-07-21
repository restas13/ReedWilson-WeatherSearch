var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'a145f8e44dde584518f485491c3469d3';

// Getting the elements that will be added to
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

// This is geting the time
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// This function renders the search history using the localstorage
function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';

    // Looping throught the search history and adding buttons from previous searches
    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn', 'btn-history');


        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
}

// This function adds an element to the search history once it is searched
function appendToHistory(search) {

    // This searched to see if the city has been searched for and adds the search if it hasn't been found
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);

    // After adding the new search, it calls the renderSearchHistory function to render the new search along with the other searches
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}

// This function gets the search history from the local storage every time the application is opened
function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    // Calls the render Search History to display the history
    renderSearchHistory();
}

// This function renders the current weather for the searched city
function renderCurrentWeather(city, weather) {
    var date = dayjs().format('M/D/YYYY');

    // Getting the weather elements from the api request
    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    // Creating elements to br rendered in the page
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    // Setting the attributes of the card
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    // Setting the attributes of the other elements
    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);
    todayContainer.innerHTML = '';

    //Adding the created weather card to the main today container
    todayContainer.append(card);
}

// Function for rendering the forcast for the upcoming days
function renderForecastCard(forecast) {
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;

    // Making html elements to add to the page
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    // Adding the elements to each other
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    // Setting attributes
    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Setting the card title to the date and inputing the icons and data into the card
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    // Adding the created card to the html page 
    forecastContainer.append(col);
}

// Rendering the forcast for the week
function renderForecast(dailyForecast) {
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();

    // Creating the heading elements
    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');

    // Setting the attributes
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);

    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);

    // Looping through the daily forcast and calling the renderForecastCard function to add a forcast card to the html page
    for (var i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                renderForecastCard(dailyForecast[i]);
            }
        }
    }
}

// Calls the rendering functions to display the current weather and the forecast
function renderItems(city, data) {
    renderCurrentWeather(city, data.list[0], data.city.timezone);
    renderForecast(data.list);
}

// Function for egtting the weather
function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    // variable for getting the searched locations weather forecast
    var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

    // Makes a fetch to the api and then calls the renderItems function
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            renderItems(city, data);
        })
        .catch(function (err) {
            console.error(err);
        });
}

// Function for getting the coordinates
function fetchCoords(search) {
    // variable for getting the locations coordinates
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

    // fetch request for the location coordinates
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location not found');
            } else {
                appendToHistory(search);
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

// Function for getting the input from the search bar
function handleSearchFormSubmit(e) {

    // Checking to see if there is anything in the search bar
    if (!searchInput.value) {
        return;
    }

    // preventing the page from refreshing
    e.preventDefault();

    // getting the search bar value and calling the fetchCoords function then resetting the search bar
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
}

// Function for handling the search history button licks
function handleSearchHistoryClick(e) {
    // Checking if the click hits one of the buttons in the search history container
    if (!e.target.matches('.btn-history')) {
        return;
    }

    // getting the button and using the data-search attribute to pass through the fetchCoords function to render the forecast
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
}

// Calling the initial function to render the search history
initSearchHistory();
// Adding the event listeners to make the buttons/forms work
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
