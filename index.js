// Getting html elements
const input = document.querySelector('#Weather-Input');
const historyCont = document.querySelector('#button-history');
const todaysWeather = document.querySelector('#Today-cont');
const forecastCont = document.querySelector('#forecast-cont');
const searchCont = document.querySelector('#search-cont');

// api variables
let apiRoot = 'https://api.openweathermap.org';
let apiKey = 'a145f8e44dde584518f485491c3469d3';

// History container
let searchHistory = [];

function fetchLocation(search) {
    var url = `${apiRoot}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;

    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {
        if (data[0]) {
            console.log(data[0]);
            getWeather(data[0]);
        }
    }).catch((error) => {
        console.log(error);
    })
}

function getWeather(location) {
    const { lon } = location;
    const { lat } = location;

    const city = location.name;

    fetch(`${apiRoot}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then((response) => {
            console.log(response);
            return response.json();
        }).then((data) => {
            renderToday(city, data.list[0])
        }).catch((error) => {
            console.log(error);
        });

}

function renderToday(city, weather) {
    console.log(weather);
    const temperature = weather.main.temp;
    const winds = weather.wind.speed;
    const humid = weather.main.humidity;

    createCard(city, temperature, winds, humid, 'today');

}

function createCard(city, temperature, winds, humid, type) {
    let card = document.createElement('div');
    let cardBody = document.createElement('div');
    let header = document.createElement('h2');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidity = document.createElement('p');

    if (type == 'today') {
        console.log('todays forecast');

        header.textContent = city;
        temp.textContent = `Temperature: ${temperature}`;
        wind.textContent = `Wind: ${winds}`;
        humidity.textContent = `Humidity: ${humid}`;
        cardBody.append(temp, wind, humidity);

        card.append(header, cardBody);

        todaysWeather.innerHTML = '';
        todaysWeather.append(card);
    }
}

function handleSubmit(event) {
    if (!input.value) {
        console.log('bug');
        return;
    }

    event.preventDefault();
    let search = input.value.trim();
    fetchLocation(search);
}


document.querySelector('#Submit-btn').addEventListener('click', handleSubmit);