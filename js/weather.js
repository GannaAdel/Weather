var rowData = document.getElementById('rowData');
var search = document.getElementById('search');
var button = document.getElementById('button');
var currentLocation = false;


function value() {
    if (search.value.trim() !== "") {
        getWeather(search.value);
        currentLocation = false
    } else {
        getLocationWeather();
        currentLocation = true;
    }
}


search.addEventListener('input', function () {
    console.log(search.value)
    value()
});

button.addEventListener('click', function () {
    value()
});

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let query = `${lat} , ${lon}`;
            getWeather(query);
        }, function (error) {
            console.error("Geolocation Error: ", error.message);
            alert("Fail to reach your location");
        });
    }
}

async function getWeather(term) {
    let x = await fetch(`https://api.weatherapi.com/v1//forecast.json?key=3b3c0ecd8b2c47419d2154018251804&q=${term}&days=3`);
    if (x.ok == true) {
        let data = await x.json();
        var cityName = currentLocation ? "Your location" : term;
        console.log(data.forecast.forecastday)
        display(data.forecast.forecastday, cityName)
    }
}
// getWeather()


function display(arr, city) {
    var cartona = "";
    for (var i = 0; i < arr.length; i++) {
        let dateStr = arr[i].date;
        let dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
        let options = { day: 'numeric', month: 'short' };
        let dateObj = new Date(dateStr).toLocaleDateString('en-GB', options);
        let condition = arr[i].day.condition.text.toLowerCase();
        let conditionClass = "";

        if (condition.includes("sunny")) {
            conditionClass = "sunny";
        } else if (condition.includes("rain")) {
            conditionClass = "rainy";
        } else if (condition.includes("cloud")) {
            conditionClass = "cloudy";
        } else if (condition.includes("clear")) {
            conditionClass = "clear";
        } else {
            conditionClass = 'default'
        }

        cartona +=
            `<div class="col">
          <div class="inner rounded-3 ${conditionClass}">
            <div class="header d-flex justify-content-between py-2 px-3">
              <div class="day">${dayName}</div>
              <div class="date">${dateObj}</div>
            </div>
            <div class="content py-3">
              <h4>${city}</h4>
              <h1>${arr[i].day.maxtemp_c}°</h1>
              <h4>${arr[i].day.mintemp_c}°</h4>
              <img src='https:${arr[i].day.condition.icon}' class="image" alt="">
              <p>${arr[i].day.condition.text}</p>
              <div class="temp-details d-flex justify-content-evenly">
                <div class="icon"><i class="me-1 fa-solid fa-droplet"></i>${arr[i].day.avghumidity}</div> 
                <div class="icon"><i class="me-1 fa-solid fa-wind"></i>${arr[i].day.maxwind_mph}Km/h</div>
                <div class="icon"><i class="me-1 fa-solid fa-umbrella"></i>${arr[i].day.daily_chance_of_rain}%</div>
              </div>
            </div>
          </div>
        </div>`;
    }

    rowData.innerHTML = cartona;
}  