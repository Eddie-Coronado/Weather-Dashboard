const APIKey="ed3bbfef3cf7bc6623d35600cf9e7220";

window.addEventListener("load", () => {
    let existingHistory;
    if (!JSON.parse(localStorage.getItem("history"))) {
        existingHistory = [];
    } else {
        existingHistory = JSON.parse(localStorage.getItem("history"));
    }

    const getUVIndex = (lat, lon) => {
        fetch("https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey + "&lat=" + lat + "&lon=" + lon)
            .then(function (res) {
                return res.json()
            })
            .then( (data) => {
            const UVIndex = data.value;
            console.log(UVIndex);
            $(".currentUVIndex").html(UVIndex);
            })
    }

    const addToList = () => {
        const ul = document.getElementById("city-list");
        const city = document.getElementById("city");
        const li = document.createElement("li");
        li.setAttribute('id',city.value);
        li.appendChild(document.createTextNode(city.value));
        ul.appendChild(li);
    }

    const getForecast = (cityValue) =>  {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityValue + "&units=imperial&appid=" + APIKey)
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                for (i=0;i<5;i++){
                const date = new Date((data.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
                const temp = data.list[((i+1)*8)-1].main.temp;
                const humidity = data.list[((i+1)*8)-1].main.humidity;
                
                console.log(data);

                $(".date" + i ).html(date);
                $(".temp" + i).html("Temp: " + temp + " F");
                $(".hum"+ i).html("Humidity: " + humidity + "%");
            }})
    }


    const getWeather = (findCity) => { 
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + findCity + "&units=imperial&appid=" + APIKey)
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                if (!existingHistory.includes(findCity)) {
                }
                const date = new Date().toLocaleDateString();
                const name = data.name;
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                const wind = data.wind.speed;
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                const iconcode = data.weather[0].icon;
                const weathericon ="https://openweathermap.org/img/wn/" + iconcode + "@2x.png";
                
                console.log(data);

                $(".city-title").html(name + " " + date);
                $(".currentTemp").html("Temprature: " + temp + " F");
                $(".currentHum").html("Humidity: " + humidity + "%");
                $(".currentWind").html("Wind Speed " + wind + " MPH");
                $(".currentIcon").html("<img src="+ weathericon +">");
                
                getUVIndex(lat,lon);
               
            })
    }

    $(".searchBtn").on("click", (e) => {
        e.preventDefault();
        const findCity = $(".city-input").val();
        const cityValue = $(".city-input").val();
        if (findCity) {
            getWeather(findCity);
            getForecast(cityValue);
            addToList();
            $(".city-input").val("");
        }
    })
})
