var apiKey = "4fd1df31154eabf381d8360e8c92b155"
var cityName = $("#city-name")
var cityInput = $(".city-input")
var displayCityName = $("#display-city-name")
var displayCurrentWeather = $(".content-container")
var displayIcon = $(".custom-icon")
var currentDate = moment().format("l")          

cityInput.on("submit", function(event) {
    event.preventDefault()
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
        var { temp } = data.main
        displayCityName.text(name + " " + currentDate)
        displayIcon.css("display", "initial")
        displayIcon.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")

    })
})