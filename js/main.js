
function renderWeather(weather) {
    hideSpinner();
    var div = $('#weather');
    div.empty();
    div.append('<h2>Weather in ' + weather.name + '</h2>');
    div.append('<p class="temp">' + weather.main.temp.toFixed(1) + ' °C</p>');
    div.append('<p>' + weather.weather[0].description + '</p>');
}

function renderError() {
    hideSpinner();
    var div = $('#weather');
    div.empty();
    div.append('<h2>Found nothing.</h2>');
    div.append('<p>Please try again.</p>')
}

function showSpinner() {
    $('#weather').empty();
    $('#preloader').show();
}

function hideSpinner() {
    $('#preloader').hide();
}

function getWeather(query) {
    showSpinner();
    return Bacon.fromPromise(queryWeather(query))
}

function queryWeather(query) {
    return $.ajax({
        type: "GET",
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + query + "&type=like&units=metric"
    })
}

function nonEmpty(s) {
    return s.length > 0
}

$(function () {

    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    var input = $('#weather-search')
        .asEventStream("keyup")
        .debounce(300)
        .map(function (e) { return $(e.target).val() })
        .skipDuplicates()
        .filter(nonEmpty);

    var searches = input.flatMapLatest(getWeather);

    searches.onValue(function(result) {
       if (result.name) {
           renderWeather(result)
       } else {
           renderError();
       }
    });
});
