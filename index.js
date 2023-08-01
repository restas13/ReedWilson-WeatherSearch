// Setting the constant api variables && search history variable
let history = [];
let apiKey = `a145f8e44dde584518f485491c3469d3`;
let apiUrl = `https://api.openweathermap.org`;

// Getting the html elements
let searchDiv = document.querySelector('#search-div');
let searchBar = document.querySelector('#search-bar');
let currentContainer = document.querySelector('#today');
let forcastCNont = document.querySelector('#forecast');
let historyContnainer = document.querySelector('#search-history');

// Time plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Renders the current weather 
function renderWeather(city, weather) {
    // 
    let temperature = weather.main.temp;
    let winds = weather.wind.speed;
    let humidity = weather.main.humidity;
    let iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    let description = weather.weather[0].description || weather[0].main;
    let date = dayjs().format('M/D/YYYY');

    let card = document.createElement('div');
    let body = document.createElement('div');
    let header = document.createElement('h2');
    let weatherIcon = document.createElement('img');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidityElement = document.createElement('p');

    card.setAttribute('class', 'card');
    body.setAttribute('class', 'card-body');
    card.append(body);

    header.setAttribute('class', 'h3 card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    humidityElement.setAttribute('class', 'card-text');

    header.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', description);
    weatherIcon.setAttribute('class', 'weather-img');
    header.append(weatherIcon);
    temp.textContent = `Temp: ${temperature}°F`;
    wind.textContent = `Wind: ${winds} MPH`;
    humidityEl.textContent = `Humidity is at ${humidity}%`;
    body.append(header, temp, wind, humidityElement);

    currentContainer.innerHTML = '';
    currentContainer.append(card);
}

// Function for when the user submits the city
function handleSearchSubmit() {

}

// Listening for the submit button or the enter key
searchDiv.addEventListener('submit', handleSearchSubmit);