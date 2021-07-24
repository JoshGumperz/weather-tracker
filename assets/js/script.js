// declare necessary variables
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
// use moment.js to get date so we can display it on the widgets along with the rest of the weather data for that day
var currentDate = moment().format("l")
// if cityNames already has content stored in it, use that, if not, use an empty array
var cityNames = JSON.parse(localStorage.getItem("Cities")) || []
// Event listener that runs a function when the user inputs a city name
cityInput.on("submit", function (event) {
    // use preventDefault to prevent the default behavior of the html form
    event.preventDefault()
    // get the value of whatever the user typed into the input field
    var city = cityName.val()
    // use this link when calling the weather data URL so it displays the data for the city the user typed in the input field
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
    saveCities(city)
    getWeatherData(weatherURL)
})
// this function saves the city the user input into local storage so that we can use it for the searched cities list
function saveCities(city) {
    // use an if statement to make sure the list doesn't populate the same city more than once
    if (!cityNames.includes(city)) {
    // if the city the user typed in isn't already in the cityNames array, use unshift to inject it at the 0 index of the array
    cityNames.unshift(city)
    }
    // if there are more than 5 items in cityNames array, get rid of the last one
    if (cityNames.length === 6){
        cityNames.splice(5, 1)
    }
    // set cityNames array in local storage
    localStorage.setItem("Cities", JSON.stringify(cityNames))  
}
// this function creates and appends the list items for each city stored in local storage
function displaySavedCities() {
    // use a for loop to iterate through all the values in cityNames array, append a new list item for each of those values
    for (var i = 0; i < cityNames.length; i++) {
        searchedCities.append($("<li>").text(cityNames[i]).addClass("btn"))
    }
}
// this function clears the cities array so that we can call displaySavedCities when the page loads, and also when the user inputs a new city. This way we can update the cities list right after the user inputs a new city. But if we didn't clear the list before updating, it would display both the old list, and the new list at the same time.
function clearSavedCities() {
    searchedCities.empty()
}

// when you click on one of the cities button, this function pulls up the weather data for that city
searchedCities.on("click", function(event){
    // use event.target to figure out which item the user clicked on
    var element = event.target;
    // use an if statement to make sure we only execute this code if the user clicked on one of the list items, and not somewhere else in the searchedCities div
    if(element.matches("li")){
        // store the text content of the item the user clicked on in a new variable called city
        var city = element.textContent
        // use this link when calling getWeatherData to display the weather data for the city the user clicked
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
        getWeatherData(weatherURL)
    }
})

// this function gets the weather data for the city the user input or clicked
function getWeatherData(URL){
    // call clearSavedCities and displaySavedCities to update searched cities list after user inputs a new city
    clearSavedCities()
    displaySavedCities()
    // this element was originally set to display: none; in the css because we don't want it to be visible until the user needs us to display some weather data
    contentEL.css("display", "initial")
    // use fetch to get the data from the provided URL
    fetch(URL)
        // convert data to json so it's more easily readable and accessible 
        .then(function (response) {
            return response.json()
        })
        // store all the individual pieces of data we need in new variables
        .then(function (data) {
            // this was also set to display: none; in the css because a little white box was appearing where the icon should be, until the data was loaded and the icon took it's place. I used display: none; to get rid of that little white box for the short amount of time it was there before the icon took it's  place.
            currentIcon.css("display", "initial")
            var { name } = data
            var { icon } = data.weather[0]
            var { temp, humidity } = data.main
            var { speed } = data.wind
            var { lat, lon } = data.coord
            // we need a new api URL to display the uv index, but we can't use the city name for the new api, we need to use lat and lon instead
            var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`
            // set the text content of all the elements in today's widget to display data we fetched
            displayCityName.text(name)
            cityNameCurrent.append(" " + currentDate)
            // set the src link of the img to display the icon associated with the data for today's weather
            currentIcon.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
            currentTemp.text("Temperature: " + temp)
            currentHumidity.text("Humidity: " + humidity + "%")
            windSpeed.text("Wind Speed: " + speed + " MPH")
            // now use the 2nd URL to get the data for the uv index, and also the weather data for the next 5 days
            fetch(onecallURL)
            // convert data to json
                .then(function (response) {
                    return response.json()
                })
                // now get all the weather data we need for the next 5 days and store it in new variables
                .then(function (data) {
                    var displayIcons = $(".custom-icon")
                    displayIcons.css("display", "initial")
                    for (var i = 1; i < 6; i++) {
                        var { icon } = data.daily[i].weather[0]
                        var { day } = data.daily[i].temp
                        var { humidity } = data.daily[i]
                        // use if statements to populate each widget in the 5 day forecast with the corresponding weather data for that day
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
                    // use a for loop to add a new date to each widget for the 5 day forecast
                    for (var i = 0; i < forecastDates.length; i++) {
                        forecastDates[i].append(" " + moment().add(i + 1, "days").format("l"))
                    }
                    // get the data for the uv index, store it in a new variable set text content of the uv index element to display the current uv index
                    var { uvi } = data.current
                    uvIndex.text(" " + uvi)
                    // use if statements to add different styling to uv index based on how severe it is
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