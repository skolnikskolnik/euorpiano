$(document).ready(function () {
    // This is our API key. Add your own API key between the ""
    var APIKey1 = "1b926fe361dd9ac5d241ebf0aa6a6ffb";
    var APIKey2 = "195500ce3388180192ee4c07e1d7b6b2";


    $("#submit").on("click", function () {
        var cityName = ($("#searchInput").val()).trim();

        var queryURLfuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey1;

        var queryURLpresent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey2;

        addToCard(cityName);
        //This ajax call gets forecast data
        $.ajax({
            url: queryURLfuture,
            method: "GET"
        }).then(function (response) {
            //futureWeather is an array, starting at zero
            //Each three hours the weather is updated
            //indexes 0-7 are for tomorrow, then 8-15 for the next day, etc.
            var futureWeather = response.list;
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
            var month = date.getMonth()+1;
            var dayOfWeek = date.getDay();
            var year = date.getFullYear();
            var dateToDisplay = month + "/" + dateOfMonth + "/" + year;

            //Getting city name 
            //Getting icon to display next to city name 
            console.log(response2.weather[0].icon);
            var iconNumber = response2.weather[0].icon;
            var iconLink = "http://openweathermap.org/img/w/" + iconNumber + ".png";
            var iconDisplay = $("<img>");
            iconDisplay.attr("src", iconLink);
            var displayHeader = $("<h3>");
            displayHeader.text(cityName + " " + dateToDisplay);
            $("#currentCity").append(displayHeader, iconDisplay);
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