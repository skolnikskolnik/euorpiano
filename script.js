$(document).ready(function () {
    // This is our API key. Add your own API key between the ""
    var APIKey1 = "1b926fe361dd9ac5d241ebf0aa6a6ffb";
    var APIKey2 = "195500ce3388180192ee4c07e1d7b6b2";
    var queryURLfuture = "";
    var queryURLpresent = "";
    var cityName = "";
    var cityArray = [];

    startPage();

    $("#submit").on("click", function () {
        $("#currentCity").empty();

        cityName = ($("#searchInput").val()).trim();

        queryURLfuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey1;

        queryURLpresent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey2;

        //Adds the city name card to the page and adds it to the array of cities
        addToCard(cityName);

        //Want to push cityArray to local storage
        localStorage.setItem("cities", JSON.stringify(cityArray));

        //Displays the five day forecast
        fiveDayForecast();

        //Displays current forecast
        currentWeatherDisplay();

        //Looks through the array and assigns ids and elements
        for (var i = 0; i < cityArray.length; i++) {
            var cityId = cityArray[i];
            var cityEl = document.getElementById(cityId);
        }

        //Now using these variables add an event listener to make buttons work
        cityEl.addEventListener("click", function () {
            cityName = cityId;

            fiveDayForecast();
            currentWeatherDisplay();
        })
    })

    function fiveDayForecast() {
        $.ajax({
            url: queryURLfuture,
            method: "GET"
        }).then(function (response) {
            var futureWeather = response.list;
            //Day 1 (using fourth one since that is 3pm)
            var day1El = $("#day1");
            var day2El = $("#day2");
            var day3El = $("#day3");
            var day4El = $("#day4");
            var day5El = $("#day5");
            displayElements(day1El, 4);
            displayElements(day2El, 12);
            displayElements(day3El, 20);
            displayElements(day4El, 28);
            displayElements(day5El, 36);

            function displayElements(targetEl, indexOf) {
                targetEl.removeClass("invisible");
                //To get the date to display
                var weatherString = futureWeather[indexOf].dt_txt;
                weatherString = weatherString.substring(0, 10);
                targetEl.text(weatherString);
                var lineBreak = $("<br>");
                targetEl.append(lineBreak);

                //Displaying the icon
                var forecastIcon = futureWeather[indexOf].weather[0].icon;
                var iconLink = "http://openweathermap.org/img/w/" + forecastIcon + ".png";
                var iconDisplay2 = $("<img>");
                iconDisplay2.attr("src", iconLink);
                iconDisplay2.addClass("forecast_icon");
                targetEl.append(iconDisplay2, lineBreak);

                //To display temp
                var temp = futureWeather[indexOf].main.temp;
                temp = (temp - 273.15).toFixed(1);
                var newEl = $("<div>");
                newEl.text("Temp: " + temp + "° C");
                targetEl.append(newEl);

                //To display humidity
                var humidPercent = futureWeather[indexOf].main.humidity;
                var newEl2 = $("<div>");
                newEl2.text(humidPercent + " % humidity");
                targetEl.append(newEl2);

            }
        });
    }

    function currentWeatherDisplay() {
        $.ajax({
            url: queryURLpresent,
            method: "GET"
        }).then(function (response2) {
            $("#currentCity").empty();
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
            }).then(function (response3) {
                var uvIndex = response3.value;
                var uvIndexEl = $("<div>");
                var uvIndexSpan = $("<div>")
                uvIndexEl.text("UV Index:  ");
                uvIndexSpan.text(uvIndex);
                uvIndexEl.addClass("uvIndex");
                uvIndexSpan.addClass("uvIndex , uvIndexSpan");
                $("#currentCity").append(uvIndexEl, uvIndexSpan);

                //Adding color coding for the different values of the uv Idex
                if (uvIndex <= 2) {
                    uvIndexSpan.addClass("green");
                }
                else if (uvIndex > 2 && uvIndex <= 5) {
                    uvIndexSpan.addClass("yellow");
                }
                else if (uvIndex > 5 && uvIndex <= 8) {
                    uvIndexSpan.addClass("orange");
                }
                else if (uvIndex > 8 && uvIndex <= 11) {
                    uvIndexSpan.addClass("red");
                }
                else {
                    uvIndexSpan.addClass("darkred");
                }
            });
        });
    }

    function addToCard(cityName) {
        //We need to add list elements with class list-group-item to id="cityDisplay"
        var newListEl = $("<button>");
        var newSpan = $("<span>")
        newListEl.addClass("clickCity");
        newListEl.attr("id", cityName);
        newSpan.text(cityName);
        newListEl.append(newSpan);
        $("#cityDisplay").append(newListEl);
        cityArray.push(cityName);
    }

    function startPage() {
        var foreCastCards = $(".span1");
        foreCastCards.addClass("invisible");

        //Need to get cities from local storage and use the addToCard fxn to display them
        var citiesToDisplay = localStorage.getItem("cities");
        citiesToDisplay = JSON.parse(citiesToDisplay);

        if (!citiesToDisplay) {
            console.log("test");
        }
        else {

            for (var i = 0; i < citiesToDisplay.length; i++) {
                addToCard(citiesToDisplay[i]);
            }

            //This displays the cities, but when these items are clicked they don't display data
            var cityEl = $(".clickCity");
            cityEl.on("click", function () {
                //We need to get the city name from the object clicked
                cityName = $(this).attr("id");

                queryURLfuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey1;

                queryURLpresent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey2;

                //Displays the five day forecast
                fiveDayForecast();

                //Displays current forecast
                currentWeatherDisplay();

            })
        }

    }
});