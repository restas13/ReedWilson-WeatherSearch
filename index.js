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

// Function for creating the forecast cards
function forecastCard(forecast) {
    // Creating variables for the api request data
    let iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    let iconDescription = forecast.weather[0].description;
    let temperature = forecast.main.temp;
    let humidity = forecast.main.humidity;
    let winds = forecast.wind.speed;

    // Create the elements for the card
    let column = document.createElement('div');
    let card = document.createElement('div');
    let body = document.createElement('div');
    let title = document.createElement('h4');
    let weatherIcon = document.createElement('img');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidityEl = document.createElement('p');

    // Adds the elements to the card, column, and the body elements
    column.append(card);
    card.append(body);
    body.append(title, weatherIcon, temp, wind, humidityEl);

    // sets attributes for the created elements
    column.setAttribute('class', 'col-md');
    column.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    body.setAttribute('class', 'card-body p-2');
    title.setAttribute('class', 'card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Adds content to the created elements
    title.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    temp.textContent = `Temp: ${temperature} °F`;
    wind.textContent = `Wind: ${winds} MPH`;
    humidityEl.textContent = `Humidity is at ${humidity}%`;

    // adds the column to the forecast container
    forecastContainer.append(col);
}

// renders the forecast for the next 5 days
function forecast(dayForecast) {
    // Create a time range for the forecast
    let startDt = dayjs().add(1, 'day').startOf('day').unix();
    let endDt = dayjs().add(6, 'day').startOf('day').unix();

    // Creating headers and the header column
    let header = document.createElement('h4');
    let headerColumn = document.createElement('div');

    // Setting attributes for the column and the header
    headerColumn.setAttribute('class', 'col-12');
    header.textContent = '5-Day Forecast:';

    // Adding the header to the column
    headerColumn.append(header);

    // Getting rid of the previous search results and adding the new forecast ressults
    forecastContainer.innerHTML = '';
    forecastContainer.append(headerColumn);

    // Loop for creating and adding each forecast card
    for (var i = 0; i < dayForecast.length; i++) {

        // Loops through all the data and returns the data for the days that fall within the range set above (5 days)
        if (dayForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {

            // This filters through the data and returns only the data for noon on each day
            if (dayForecast[i].dt_txt.slice(11, 13) == "12") {
                forecastCard(dayForecast[i]);
            }
        }
    }
}

//function for fetching the weather data
function getWeather(location) {
    // creating variables for 
    var { latitude } = location;
    var { longitude } = location;
    var city = location.name;

    // connecting the api url to get the data from the city that was inputed
    var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`;

    // fetch request 
    fetch(apiUrl)
        // returns json of data
        .then(function (res) {
            return res.json();
        })
        //calls renderItems function and passes the city and data json 
        .then(function (data) {
            renderItems(city, data);
        })
        // Catches in case of an error
        .catch(function (err) {
            console.error(err);
        });
}

function getCoordinates(search) {
    // Sets the api url for the get request
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

    // fetch request 
    fetch(apiUrl)
        // returns json of data
        .then(function (res) {
            return res.json();
        })
        //checks if there was any data returned 
        .then(function (data) {
            if (!data[0]) {
                // Alerts the user if the city they input was invalid
                alert('Sorry, we couldn\'t find the city you put in, please check the spelling and try again.');
            } else {
                // Adds the search to the localstorage, and gets the weather
                addToHistory(search);
                getWeather(data[0]);
            }
        })
        // Runs if there was an error with the request
        .catch(function (err) {
            console.error(err);
        });
}

// renders the items fo the page by calling the renderWeather and forecast functions
function renderItems(city, data) {
    renderWeather(city, data.list[0], data.city.timezone);
    forecast(data.list);
}

// Function for when the user submits the city
function handleSearchSubmit(e) {
    if (!searchInput.value) {
        return;
    }

    // prevents the page from reloading
    e.preventDefault();

    //Gets the search value from the page
    var search = searchInput.value.trim();
    // Runs the getCoordinates function and resets the input field
    getCoordinates(search);
    searchInput.value = '';
}

function historyClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
        return;
    }

    // Gets the target of the click and runs the fetch process using the buttons 'data-search' attribute
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
}

// Listening for the submit button or the enter key and for a history button to be clicked
searchDiv.addEventListener('submit', handleSearchSubmit);
historyContainer.addEventListener('click', handleSearchHistoryClick);