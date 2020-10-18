$(document).ready(function () {
    // This is our API key. Add your own API key between the ""
    var APIKey1 = "1b926fe361dd9ac5d241ebf0aa6a6ffb";
    var APIKey2 = "195500ce3388180192ee4c07e1d7b6b2";


    $("#submit").on("click", function () {
        $("#currentCity").empty();

        var cityName = ($("#searchInput").val()).trim();

        var queryURLfuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey1;

        var queryURLpresent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey2;

        addToCard(cityName);
        //This ajax call gets forecast data
        $.ajax({
            url: queryURLfuture,
            method: "GET"
        }).then(function (response) {
            var futureWeather = response.list;
            console.log(futureWeather);
            //need to make five in line cards
        });

        //This ajax call gets current data
        $.ajax({
            url: queryURLpresent,
            method: "GET"
        }).then(function (response2) {
            //Displaying city name and today's date
            //Getting today's date
            var date = new Date();
            var dateOfMonth = date.getDate();
            var month = date.getMonth() + 1;
            var dayOfWeek = date.getDay();
            var year = date.getFullYear();
            var dateToDisplay = month + "/" + dateOfMonth + "/" + year;

            //Getting city name 
            //Getting icon to display next to city name 
            var iconNumber = response2.weather[0].icon;
            var iconLink = "http://openweathermap.org/img/w/" + iconNumber + ".png";
            var iconDisplay = $("<img>");
            iconDisplay.attr("src", iconLink);
            var displayHeader = $("<h3>");
            displayHeader.text(cityName + " " + dateToDisplay);

            //Display the temperature
            var tempCels = (response2.main.temp - 273).toFixed(1);
            var tempEl = $("<div>");
            tempEl.text(tempCels + "° C");

            //Displays the humidity
            var humEl = $("<div>");
            var humidity = response2.main.humidity;
            humEl.text(humidity + "% humidity");

            //Displays wind speed
            var windSpeed = response2.wind.speed;
            var windDegree = JSON.parse(response2.wind.deg);
            var windDirection = "";
            if ((windDegree >= 337.5 && windDegree < 360) || (windDegree >= 0 && windDegree < 22.5)) {
                windDirection = "N";
            }
            else if (windDegree >= 22.5 && windDegree < 67.5) {
                windDirection = "NE";
            }
            else if (windDegree >= 67.5 && windDegree < 112.5) {
                windDirection = "E";
            }
            else if (windDegree >= 112.5 && windDegree < 157.5) {
                windDirection = "SE";
            }
            else if (windDegree >= 157.5 && windDegree < 202.5) {
                windDirection = "S";
            }
            else if (windDegree >= 202.5 && windDegree < 247.5) {
                windDirection = "SW";
            }
            else if (windDegree >= 247.5 && windDegree < 292.5) {
                windDirection = "W";
            }
            else {
                windDirection = "NW";
            }
            var windEl = $("<div>");
            windEl.text("Wind speed: " + windSpeed + " mph " + windDirection);

            $("#currentCity").append(displayHeader, iconDisplay, tempEl, humEl, windEl);

            //UV index
            var lat = response2.coord.lat;
            var lon = response2.coord.lon;
            var queryURLuv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey1;
            $.ajax({
                url: queryURLuv,
                method: "GET"
            }).then(function(response3){
                var uvIndex = response3.value;
                var uvIndexEl = $("<div>");
                var uvIndexSpan = $("<div>")
                uvIndexEl.text("UV Index:  ");
                uvIndexSpan.text(uvIndex);
                uvIndexEl.addClass("uvIndex");
                uvIndexSpan.addClass("uvIndex , uvIndexSpan");
                $("#currentCity").append(uvIndexEl, uvIndexSpan);

                //Adding color coding for the different values of the uv Idex
                console.log(uvIndex);
                if(uvIndex <= 2){
                    uvIndexSpan.addClass("green");
                }
                else if(uvIndex >2 && uvIndex <=5){
                    uvIndexSpan.addClass("yellow");
                }
                else if(uvIndex > 5 && uvIndex <= 8){
                    uvIndexSpan.addClass("orange");
                }
                else if(uvIndex >8 && uvIndex <=11){
                    uvIndexSpan.addClass("red");
                }
                else{
                    uvIndexSpan.addClass("darkred");
                }
            });
        });


    });


    function addToCard(cityName) {
        //We need to add list elements with class list-group-item to id="cityDisplay"
        var newListEl = $("<li>");
        newListEl.addClass("list-group-item");
        newListEl.text(cityName);
        $("#cityDisplay").append(newListEl);
    }
});