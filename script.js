
const key = "69e63909fb6e55a180806cb7fe8a5954";
let cityname = document.querySelector("h3");
let temp = document.querySelector("h1");
let decrip = document.querySelector("#descrip");
let humidity = document.querySelector("#humidity");
let pressure = document.querySelector("#pressure");
const apiKey = "0uF8CVAb403K1SP0oDjiAxqe43KilFHd";
let currentHour;


const weatherDescriptions = {
    0: "Unknown",
    1000: "Clear, Sunny",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
};



const weatherIconMap = {
    1000: "icons/sun.png",
    1101: "icons/partly_cloudy.png",
    1001: "icons/cloudy.png",
    4200: "icons/drizzle.png",
    4201: "icons/rain.png",
    5000: "icons/snow.png",
    8000: "icons/thunder.png",
    2000: "icons/fog.png",
    1100: "icons/sun.png"
};


const countryMap = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AR": "Argentina",
    "AU": "Australia",
    "AT": "Austria",
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BR": "Brazil",
    "CA": "Canada",
    "CN": "China",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "EG": "Egypt",
    "FI": "Finland",
    "FR": "France",
    "DE": "Germany",
    "GR": "Greece",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IL": "Israel",
    "IT": "Italy",
    "JP": "Japan",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KR": "South Korea",
    "KW": "Kuwait",
    "LB": "Lebanon",
    "MY": "Malaysia",
    "MX": "Mexico",
    "MA": "Morocco",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NZ": "New Zealand",
    "NG": "Nigeria",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PH": "Philippines",
    "PL": "Poland",
    "PT": "Portugal",
    "QA": "Qatar",
    "RO": "Romania",
    "RU": "Russia",
    "SA": "Saudi Arabia",
    "SG": "Singapore",
    "ZA": "South Africa",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syria",
    "TH": "Thailand",
    "TR": "Turkey",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "VN": "Vietnam",
    "YE": "Yemen"
};









function getDayName(dateString) {
    const date = new Date(dateString);
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdayNames[date.getUTCDay()];
}








function weeklyData() {
    let loc = document.querySelector("#input").value;
    let dates = document.querySelectorAll(".date");
    let temps = document.querySelectorAll(".temp");
    let conditions = document.querySelectorAll(".condition");
    if (loc === "") {
        loc = "gujranwala";
    }
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${loc}&timesteps=1d&apikey=${apiKey}`;

    fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const dailyForecasts = data.timelines.daily;
            let i = 0;
            const degree = '\u00B0';
            dailyForecasts.forEach(day => {
                // console.log(day);
                const dayname = getDayName(day.time);
                const tempMax = day.values.temperatureMax;
                const tempMin = day.values.temperatureMin;
                const tempAvg = day.values.temperatureAvg;
                const condition = day.values.weatherCodeMax;
                const openWeatherCode = weatherIconMap[condition];
                // This is a weather code
                dates[i].innerText = dayname;
                temps[i].innerText = tempAvg + degree + "C";
                conditions[i].innerHTML = "";
                conditions[i].innerHTML = `<div style=" display: flex; flex-direction: row; gap:5%; "><div style="font-family:system-ui;">${weatherDescriptions[condition]}</div> <img src= ${openWeatherCode} alt="weather" style="width:30px; height:30px; margin-right:10px;"/></div>`;
                i++;
                // console.log(`${date}: High ${tempMax}°C / Low ${tempMin}°C - Code ${condition}`);
            });
        })
        .catch(error => console.error("Weather fetch error:", error));

};













function hourlyData(currentHour) {
    let loc = document.querySelector("#input").value;
    let hours = document.querySelectorAll(".hour");
    let htemps = document.querySelectorAll(".htemp");
    if (loc === "") {
        loc = "gujranwala";
    }


    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${loc}&timesteps=1h&apikey=${apiKey}`;

    fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            // const hourly = data.timelines.hourly.slice(0, 6); // just 6 hours for example
            const container = document.querySelector("#weather");
            const hourly = data.timelines.hourly;
            const degree = '\u00B0';
            let i = 0;
            hourly.forEach(hour => {
                let hourcount = hour.time.slice(11, 13);
                // console.log(hour);
                if ((hourcount > currentHour && i==0) || (i>0 && i<5)) {
                    // console.log(hourcount);
                    // console.log(currentHour);
                    let time = hour.time;
                    // console.log(time);
                    let format12time = time.slice(11, 13);
                    // console.log(format12time);
                    if (format12time >= 12) {
                        if (format12time != 12) {
                            format12time = format12time - 12;
                        }
                        time = `${format12time}PM`;
                    }
                    else {
                        time = `${format12time}AM`;
                    }

                    const temp = hour.values.temperature;
                    // const code = hour.values.weatherCode;
                    // const openWeatherCode = weatherIconMap[code];

                    console.log(time);
                    hours[i].innerText = time;
                    htemps[i].innerText = temp + degree + "C";
                    i++;
                    // if(i===5)
                    // {
                    //     return;
                    // }

                    // const openWeatherCode = weatherIconMap[code];
                    // const iconURL = `https://openweathermap.org/img/wn/${openWeatherCode}@2x.png`;


                    // container.innerHTML = `<div style="margin:10px; display:flex; align-items:center;"><img src="${openWeatherCode}" alt="weather" style="width:40px; height:40px; margin-right:10px;" /><span><strong>${time}</strong>: ${temp}°C</span></div>`;

                }
                // else{
                //     console.log("failed");
                // }
            });
        })
        .catch(err => console.log("Weather error:", err));
}





let getData = async () => {
    let city = document.querySelector("#input").value;
    if (city === "") {
        city = "gujranwala";
    }
    let link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;


    let response = await fetch(link);
    let data = await response.json();
    const degree = '\u00B0';


    if (data.cod === 200) {
        // console.log(data);
        let countrycode = data.sys.country;
        let country = countryMap[countrycode];
        cityname.innerText = `${data.name} , ${country}`;
        temp.innerText = data.main.temp + degree + "C";
        descrip.innerText = data.weather[0].description;
        humidity.innerText = `Humidity: ${data.main.humidity}`;
        pressure.innerText = `Pressure: ${data.main.pressure}`;
        document.querySelector("#input").value = "";

        let timestamp = data.dt;
        let timeZoneOffset = data.timezone;
        let localUTCtime = new Date((timestamp + timeZoneOffset) * 1000);
        currentHour = localUTCtime.getUTCHours();

        weeklyData();
        hourlyData(currentHour);
        // let formattedtime = localtime.toLocaleTimeString('en-GB', {
        //     hour: '2-digit',
        //     minute: '2-digit'
        // });
        // console.log(currentHour);
        // console.log(formattedtime);
    }
    else {
        alert(data.message);
    }

};












window.addEventListener("load", () => {
    getData();
});
document.querySelector("#input").addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        getData();
    }
});