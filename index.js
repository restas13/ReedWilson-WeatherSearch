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
    // Gets the weather element from the api
    let temperature = weather.main.temp;
    let winds = weather.wind.speed;
    let humidity = weather.main.humidity;
    // Gets the weather icon
    let iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    let description = weather.weather[0].description || weather[0].main;
    // Gets the date and formats it
    let date = dayjs().format('M/D/YYYY');

    // Creates the elements that contain the weather data to be added to the document 
    let card = document.createElement('div');
    let body = document.createElement('div');
    let header = document.createElement('h2');
    let weatherIcon = document.createElement('img');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidityElement = document.createElement('p');

    // Setting attributes for the elements for styling
    card.setAttribute('class', 'card');
    body.setAttribute('class', 'card-body');
    card.append(body);
    header.setAttribute('class', 'h3 card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    humidityElement.setAttribute('class', 'card-text');

    // Setting the attributes for the weather icon
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', description);
    weatherIcon.setAttribute('class', 'weather-img');
    // Adding the text contents to the card
    header.textContent = `${city} (${date})`;
    header.append(weatherIcon);
    temp.textContent = `Temp: ${temperature}°F`;
    wind.textContent = `Wind: ${winds} MPH`;
    humidityEl.textContent = `Humidity is at ${humidity}%`;
    // Adding all the elements to the card body
    body.append(header, temp, wind, humidityElement);

    // Clearning the container from previous elements
    currentContainer.innerHTML = '';
    // Adding the card to the container
    currentContainer.append(card);
}

function forecastCard(forecast) {
    // variables for data from api
    let iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    let iconDescription = forecast.weather[0].description;
    let temperature = forecast.main.temp;
    let humidity = forecast.main.humidity;
    let winds = forecast.wind.speed;

    // Create elements for a card
    let column = document.createElement('div');
    let card = document.createElement('div');
    let body = document.createElement('div');
    let title = document.createElement('h4');
    let weatherIcon = document.createElement('img');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidityEl = document.createElement('p');

    column.append(card);
    card.append(body);
    body.append(title, weatherIcon, temp, wind, humidityEl);

    column.setAttribute('class', 'col-md');
    column.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    body.setAttribute('class', 'card-body p-2');
    title.setAttribute('class', 'card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Add content to elements
    title.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    temp.textContent = `Temp: ${temperature} °F`;
    wind.textContent = `Wind: ${winds} MPH`;
    humidityEl.textContent = `Humidity is at ${humidity}%`;

    forecastContainer.append(col);
}

// Function for when the user submits the city
function handleSearchSubmit() {

}

// Listening for the submit button or the enter key
searchDiv.addEventListener('submit', handleSearchSubmit);