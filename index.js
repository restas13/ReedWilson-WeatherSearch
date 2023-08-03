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
    }).then((data)  => {
        if(data[0]) {
            console.log(data[0]);
            getWeather(data[0]);
        }
    }).catch((error) => {
        console.log(error);
    })
}

function getWeather(location) {
    const {lon} = location;
    const {lat} = location;

    fetch(`${apiRoot}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then((response) => {
        return response.json();
    }).then((data) => {

    }).catch((error) => {
        console.log(error);
    });

}
