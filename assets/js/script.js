var apiKey = "4fd1df31154eabf381d8360e8c92b155"
var cityName = $("#city-name")
var cityInput = $(".city-input")
var contentEL = $(".content")
var displayCityName = $("#display-city-name")
var displayCurrentWeather = $(".content-container")
var displayIcon = $(".custom-icon")
var displayTemp = $(".temp")
var displayHumidity = $(".humidity")
var windSpeed = $("#wind-speed")
var uvIndex = $("#uv-index")
var currentDate = moment().format("l")          

cityInput.on("submit", function(event) {
    event.preventDefault()
    contentEL.css("display", "initial")
    var city = cityName.val()
    var URL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey

    fetch(URL)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data)
        var { name } = data
        var { icon } = data.weather[0]
        var { temp, humidity } = data.main
        var { speed } = data.wind
        displayCityName.text(name + " " + currentDate)
        displayIcon.css("display", "initial")
        displayIcon.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
        displayTemp.text("Temperature: " + temp)
        displayHumidity.text("Humidity: " + humidity + "%")
        windSpeed.text("Wind Speed: " + speed + " MPH")
    })
})