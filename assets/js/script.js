var apiKey = "4fd1df31154eabf381d8360e8c92b155"
var cityName = $("#city-name")
var cityInput = $(".city-input")

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
    })
})