var apiKey = "4fd1df31154eabf381d8360e8c92b155"
var cityName = $("#city-name")
var cityInput = $(".city-input")
var searchedCities = $(".searched-cities")
var contentEL = $(".content")
var displayCityName = $(".display-city-name")
var currentWeather = $(".content-container")
var cityNameCurrent = $("#city-name-current")
var currentIcon = $("#current-icon")
var currentTemp = $("#current-temp")
var currentHumidity = $("#current-humidity")
var windSpeed = $("#wind-speed")
var uvIndex = $("#uv-index")
var fiveDayForecast = {
    dayOne: [
        $("#icon-day-one"),
        $("#temp-day-one"),
        $("#humidity-day-one"), 
    ],
    dayTwo: [
        $("#icon-day-two"),
        $("#temp-day-two"),
        $("#humidity-day-two"),
         
    ],
    dayThree: [
        $("#icon-day-three"),
        $("#temp-day-three"),
        $("#humidity-day-three"),
    ],
    dayFour: [
        $("#icon-day-four"),
        $("#temp-day-four"),
        $("#humidity-day-four"),
    ],
    dayFive: [
        $("#icon-day-five"),
        $("#temp-day-five"),
        $("#humidity-day-five"), 
    ]
}
forecastDates = [$("#city-name-day-one"), $("#city-name-day-two"), $("#city-name-day-three"), $("#city-name-day-four"), $("#city-name-day-five"),]
var currentDate = moment().format("l")
var cityNames = JSON.parse(localStorage.getItem("Cities")) || []

cityInput.on("submit", function (event) {
    event.preventDefault()
    var city = cityName.val()
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
    saveCities(city)
    getWeatherData(weatherURL)
})

function saveCities(city) {
    if (!cityNames.includes(city)) {
    cityNames.unshift(city)
    }
    if (cityNames.length === 5){
        cityNames.splice(4, 1)
    }
    console.log(cityNames)
    localStorage.setItem("Cities", JSON.stringify(cityNames))
    return city
    
}

function displaySavedCities() {
    for (var i = 0; i < cityNames.length; i++) {
        searchedCities.append($("<li>").text(cityNames[i]).addClass("btn"))
    }
}


searchedCities.on("click", function(event){
    var element = event.target;
    if(element.matches("li")){
        var city = element.textContent
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
        getWeatherData(weatherURL)
    }
})

function getWeatherData(URL){
    contentEL.css("display", "initial")
    fetch(URL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            currentIcon.css("display", "initial")
            var { name } = data
            var { icon } = data.weather[0]
            var { temp, humidity } = data.main
            var { speed } = data.wind
            var { lat, lon } = data.coord
            var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`
            displayCityName.text(name)
            cityNameCurrent.append(" " + currentDate)
            currentIcon.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
            currentTemp.text("Temperature: " + temp)
            currentHumidity.text("Humidity: " + humidity + "%")
            windSpeed.text("Wind Speed: " + speed + " MPH")

            fetch(onecallURL)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    var displayIcons = $(".custom-icon")
                    displayIcons.css("display", "initial")
                    for (var i = 1; i < 6; i++) {
                        var { icon } = data.daily[i].weather[0]
                        var { day } = data.daily[i].temp
                        var { humidity } = data.daily[i]
                        if(i === 1){
                            fiveDayForecast.dayOne[0].attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
                            fiveDayForecast.dayOne[1].text("Temperature: " + day)
                            fiveDayForecast.dayOne[2].text("Humidity: " + humidity + "%")
                        }
                        else if(i === 2){
                            fiveDayForecast.dayTwo[0].attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
                            fiveDayForecast.dayTwo[1].text("Temperature: " + day)
                            fiveDayForecast.dayTwo[2].text("Humidity: " + humidity + "%")
                        }
                        else if(i === 3){
                            fiveDayForecast.dayThree[0].attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
                            fiveDayForecast.dayThree[1].text("Temperature: " + day)
                            fiveDayForecast.dayThree[2].text("Humidity: " + humidity + "%")
                        }
                        else if(i === 4){
                            fiveDayForecast.dayFour[0].attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
                            fiveDayForecast.dayFour[1].text("Temperature: " + day)
                            fiveDayForecast.dayFour[2].text("Humidity: " + humidity + "%")
                        }
                        else {
                            fiveDayForecast.dayFive[0].attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
                            fiveDayForecast.dayFive[1].text("Temperature: " + day)
                            fiveDayForecast.dayFive[2].text("Humidity: " + humidity + "%")
                        }
                    }
                    for (var i = 0; i < forecastDates.length; i++) {
                        forecastDates[i].append(" " + moment().add(i + 1, "days").format("l"))
                    }
                    var { uvi } = data.current
                    uvIndex.text(" " + uvi)
                    if (uvi < 3) {
                        uvIndex.addClass("uv-favorable")
                    }
                    else if (uvi < 6) {
                        uvIndex.addClass("uv-moderate")
                    }
                    else {
                        uvIndex.addClass("uv-severe")
                    }
                })
        })
}
displaySavedCities()