$(document).ready(function () {
    // This is our API key. Add your own API key between the ""
    var APIKey = "1b926fe361dd9ac5d241ebf0aa6a6ffb";


    $("#submit").on("click", function () {
        var cityName = ($("#searchInput").val()).trim();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            addToCard(cityName);
        })
    });


    function addToCard(cityName) {
        //We need to add list elements with class list-group-item to id="cityDisplay"
        var newListEl = $("<li>");
        newListEl.addClass("list-group-item");
        newListEl.text(cityName);
        $("#cityDisplay").append(newListEl);
    }
});