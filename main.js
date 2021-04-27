// PROXY & demoAPI FOR TESTING ON LOCAL HOST
const proxy         = 'https://cors-anywhere.herokuapp.com/';
const demoAPI       = `API-Sample-openweather.org.json`;
const weatherAPIID  = '6524d31a78fbd7aeebf420ca4c308e07';
const units         = {
    celisus: 'metric',
    kelvin: 'standard'
};
const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
let tempValue,
    timezoneValue,
    windValue,
    humidityValue,
    ampmFlag,
    lat,
    lon,
    weatherIconF,
    weatherIcon             = document.querySelector('.weather-icon img')
    tempItem                = document.querySelector('.weather-temp'),
    subTempItem             = document.querySelector('.weather-state-item-value-temp'),
    humidityItem            = document.querySelector('.weather-state-item-value-humidity'),
    windItem                = document.querySelector('.weather-state-item-value-wind'),
    cityItem                = document.querySelector('.timezone-city'),
    dayItem                 = document.querySelector('.timezone-date-day'),
    hourItem                = document.querySelector('.timezone-date-hour'),
    minutesItem             = document.querySelector('.timezone-date-minutes'),
    ampmItem                = document.querySelector('.timezone-date-nightday'),
    greetingSentenceItem    = document.querySelector('.greeting-sentence');
// SET HOUR
setTime();
setGreetingSentence(greetingSentenceItem);
checkForDay();
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        let api = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&units=${units.celisus}&appid=${weatherAPIID}`;
        console.log(api);
        fetch(api)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                tempValue       = data.list[0].main.temp;
                timezoneValue   = data.list[0].name;
                windValue       = data.list[0].wind.speed;
                humidityValue   = data.list[0].main.humidity;

                tempItem.innerHTML      = `${Math.round(tempValue)}&deg;C`;
                subTempItem.innerHTML   = `${Math.round(tempValue)}&deg;C`;
                cityItem.innerHTML      = `${timezoneValue}, ${data.list[0].sys.country}`;
                windItem.innerHTML      = `${windValue}m/s`;
                humidityItem.innerHTML  = `${humidityValue}%`;
                weatherIconF = data.list[0].weather[0].icon;
                console.log(weatherIconF);
                weatherIcon.src = `./icons/${weatherIconF}.svg`;
            }).catch((error) => {
                document.querySelector('.weather-icon').innerHTML = 'Please reconnect to the internet and try again' + error;
            });
    });
}else{
    // If Location Is Disabled
    console.log('fail');
}

// document.querySelector('.weather-icon img').src = weatherIcons.weatherIconF;
// console.log(weatherIcons.weatherIconF);

function setTime(){
let date            = new Date(),
    dayVal          = days[date.getDay()],
    hourVal         = date.getHours(),
    minutesVal      = date.getMinutes();
    dayItem.textContent = dayVal;
    if(hourVal < 10 && hourVal > 0){
        // hourVal = `0${hourVal}`;
        hourItem.textContent = `0${hourVal}`;
        ampmItem.textContent = 'AM';
    }else if(hourVal == 0){
        hourItem.textContent = `12:`;
        ampmItem.textContent = 'AM';
    }else if(hourVal >= 10 && hourVal <= 12) {
        hourItem.textContent = hourVal;
    }else{
        hourItem.textContent = hourVal - 12;
        ampmItem.textContent = 'PM';
    }
    if(minutesVal < 10){
        minutesItem.textContent = `:0${minutesVal}`
    }else{
        minutesItem.textContent = `:${minutesVal}`;
    }
    setTimeout(setTime, 500);
}
function setGreetingSentence (item){
    let hour = new Date().getHours();
    if(hour < 12){
        item.textContent = "Good Morning !";
    }else if(hour > 18){
        item.textContent = "Good Evening !";
    }else if(hour <= 18 && hour >= 12 ){
        item.textContent = "Good Afternoon !";
    }
}
function checkForDay(){
    let hour = new Date().getHours();
    // console.log(hour);
    if (hour >= 4 && hour <= 16){
        // Day Mode
        document.body.classList.remove('night');
        document.body.classList.add('day');
    }else{
        // Night Mode
        document.body.classList.add('night');
        document.body.classList.remove('day');
    }
}
/* 
    01n 01d => sunny    || Clear Sky
    02n 02d => sun-with-cloud    || Few Clouds
    03n 03d => cloud    || Scattered Clouds
    04n 04d => broken clouds    || Scattered Clouds
    05n 05d => broken clouds    || Shower Rain
*/