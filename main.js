const API_KEY = '385041d6079abf142d96faac54572968';
const PROMPT_TITLE = 'Введите через запятую названия городов, по которым хотите получить прогноз погоды';

function prepareCities(cities) {
    // City1, City2, City3
    return cities.replace(' ', '').split(',');
}

function createHTMLElement(data) {

    const { location, current } = data;
    const { name, country, localtime } = location;
    const { temperature, weather_icons: weatherIcons, weather_descriptions: description } = current;

    let locationTitle = document.createElement('div')
    locationTitle.setAttribute("class", "location-title");
    locationTitle.textContent = `${name}, ${country}`;

    let weatherStatus = document.createElement('div')
    weatherStatus.setAttribute("class", "weather-status");
    weatherStatus.textContent = `${description[0]}, ${temperature} C`;

    let localTime = document.createElement('div')
    localTime.setAttribute("class", "local-time");
    localTime.textContent = localtime;

    let imageContainer = document.createElement('div')
    imageContainer.setAttribute("class", "image-container");
    let image = document.createElement('img');
    image.setAttribute('src', weatherIcons[0]);
    imageContainer.appendChild(image);

    let container = document.createElement('div');
    container.setAttribute('class', 'container');

    container.appendChild(locationTitle);
    container.appendChild(weatherStatus);
    container.appendChild(localTime);
    container.appendChild(imageContainer);

    return container;
}

async function loadWeather(cities){

    const cityWeatherData = [];

    for (const city of cities) {
        const data = await doFetch(city);
        cityWeatherData.push(data);
    }

    return cityWeatherData;
}

async function doFetch(cityName) {

    const api = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${cityName}`;
    
    const response = await fetch(api);
    return response.json();
}

window.addEventListener('load', () => {
    
    let cities = prompt(PROMPT_TITLE, 'Moscow');
    cities = prepareCities(cities);

    loadWeather(cities)
        .then(weatherByCities => {
            console.log(weatherByCities);
            
            const body = document.getElementsByTagName('body')[0];

            for (let weather of weatherByCities) {
                const container = createHTMLElement(weather);
                body.appendChild(container);
            }
        })
        .catch(error => {
            console.log(error)
        })
    
});