const apiKey = "5b3357340f44b7dea2c36b98a5359d39";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const nowUTC = Math.floor(Date.now() / 1000);

console.log(searchBox.value);
//const geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?&appid="+apiKey+"&q="+city+"&limit=5";
const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?&appid=${apiKey}`;
const weatherApi = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
let lat = "";
let lon = "";


async function getWeather(city) {
    console.log("getting weather")
    const geoResponse = await fetch(geoApiUrl + `&q=${city}&limit=5`);
    const geoData = await geoResponse.json();
    console.log(geoData)

    if (geoData.length == 0) {
        console.log('no cities found')
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        lat = geoData[0].lat;
        lon = geoData[0].lon;

        const wthrResponse = await fetch(weatherApi + `&lat=${lat}&lon=${lon}`);

        const wthrData = await wthrResponse.json();
        console.log(wthrData)

        document.querySelector(".city").innerHTML = wthrData.name
        document.querySelector(".temp").innerHTML = Math.round(wthrData.main.temp) + "°c"
        document.querySelector(".humidity").innerHTML = wthrData.main.humidity + "%"
        document.querySelector(".wind").innerHTML = wthrData.wind.speed + " km/h"

        let wthrCondition = wthrData.weather[0].main
        let wthrId = wthrData.weather[0].id
        let sunrise = wthrData.sys.sunrise
        let sunset = wthrData.sys.sunset
        let imgSuffix = "";
        // Check if current time is between sunrise and sunset
        if (nowUTC >= sunrise && nowUTC < sunset) {
            imgSuffix = "_d";
            console.log("It's daytime.");
        } else {
            console.log("It's nighttime.");
            imgSuffix = "_n";
        }
        console.log(wthrCondition);
        if (wthrCondition == "Rain") {
            //weatherIcon.src = "images/rain.png";
            weatherIcon.src = "images/rain.svg";
            weatherIcon.title = wthrCondition;
        } else if (wthrCondition == "Snow") {
            // weatherIcon.src = "images/snow.png";
            weatherIcon.src = "images/snow.svg";
            weatherIcon.title = wthrCondition;
        } else if (wthrCondition == "Clouds") {

            if (wthrId == "804" || wthrId == "803") weatherIcon.src = `images/overcast${imgSuffix}.svg`;
            else weatherIcon.src = "images/cloudy.svg";
            weatherIcon.title = wthrCondition;
        } else if (wthrCondition == "Clear") {
            weatherIcon.src = `images/clear${imgSuffix}.svg`;
            weatherIcon.title = wthrCondition;
        } else if (wthrCondition == "Drizzle") {
            // weatherIcon.src = "images/drizzle.png";
            weatherIcon.src = "images/drizzle.svg";
            weatherIcon.title = wthrCondition;
        } else if (wthrCondition == "Mist") {
            weatherIcon.src = "images/mist.svg";
            weatherIcon.title = wthrCondition;
        } else if (wthrCondition == "Thunderstorm") {
            if (wthrId == "200" || wthrId == "201" || wthrId == "202") weatherIcon.src = "images/thunderstorms-rain.svg";
            //else if(wthrId == "230" || wthrId == "231" || wthrId == "232") weatherIcon.src = "images/thunderstorms-rain.svg";
            else weatherIcon.src = "images/thunderstorms.svg";
            weatherIcon.title = wthrCondition;
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }

}


searchBtn.addEventListener("click", () => {
    getWeather(searchBox.value)
})

searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        getWeather(searchBox.value)
})
