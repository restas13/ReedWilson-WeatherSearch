// Getting html elements
const input = document.querySelector('#Weather-Input');
const historyCont = document.querySelector('#button-history');
const todaysWeather = document.querySelector('#Today-cont');
const forecastCont = document.querySelector('#forecast-cont');
const searchCont = document.querySelector('#button-history');

// api variables
let apiRoot = 'https://api.openweathermap.org';
let apiKey = 'a145f8e44dde584518f485491c3469d3';

// History container
let searchHistory = [];

//Timezone plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

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
            renderForecast(city, data.list);
            addToHistory(city);
        }).catch((error) => {
            console.log(error);
        });

}

function renderToday(city, weather) {
    console.log(weather);
    const temperature = weather.main.temp;
    const winds = weather.wind.speed;
    const humid = weather.main.humidity;

    createCard(city, temperature, winds, humid, 'today', dayjs(weather.dt_txt).format('M/D/YYYY'));

}

function renderForecast(city, data) {
    forecastCont.innerHTML = '';


    const start = dayjs().add(1, 'day').startOf('day').unix();
    const end = dayjs().add(6, 'day').startOf('day').unix();

    let headerCont = document.createElement('div');
    let header = document.createElement('h4');

    header.textContent = 'Five Day Forecast: ';

    headerCont.append(header);


    for (let i = 1; i < data.length; i++) {
        if (data[i].dt >= start && data[i].dt < end) {
            if (data[i].dt_txt.slice(11, 13) == "12") {
                const temperature = data[i].main.temp;
                const winds = data[i].wind.speed;
                const humid = data[i].main.humidity;

                headerCont.append(createCard(city, temperature, winds, humid, 'forecast', dayjs(data[i].dt_txt).format('M/D/YYYY')));

            }
        }
    }

    forecastCont.append(headerCont);
}

function createCard(city, temperature, winds, humid, type, date) {
    let card = document.createElement('div');
    let cardBody = document.createElement('div');
    let header = document.createElement('h2');
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidity = document.createElement('p');

    if (type == 'today') {
        console.log('todays forecast');

        header.textContent = city + '-' + date;
        temp.textContent = `Temperature: ${temperature}`;
        wind.textContent = `Wind: ${winds}`;
        humidity.textContent = `Humidity: ${humid}`;
        cardBody.append(temp, wind, humidity);

        card.append(header, cardBody);

        todaysWeather.innerHTML = '';
        todaysWeather.append(card);
    }else if (type == 'forecast') {
        header.textContent = city + '-' + date;
        temp.textContent = `Temperature: ${temperature}`;
        wind.textContent = `Wind: ${winds}`;
        humidity.textContent = `Humidity: ${humid}`;
        cardBody.append(temp, wind, humidity);

        card.append(header, cardBody);

        return card;
    }
}

function addToHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        console.log("already Have it");
        return;
    }

    searchHistory.push(search);
    localStorage.setItem('history', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    searchCont.innerHTML = '';

    for (let i = 0; i < searchHistory.length; i++) {
        let button = document.createElement('button');

        button.setAttribute('search', searchHistory[i]);
        button.textContent = searchHistory[i];
        searchCont.append(button);
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