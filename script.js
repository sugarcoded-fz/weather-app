
const key = "69e63909fb6e55a180806cb7fe8a5954";
let cityname = document.querySelector("h3");
let temp = document.querySelector("h1");
let decrip = document.querySelector("#descrip");
let humidity = document.querySelector("#humidity");
let pressure = document.querySelector("#pressure");
const apiKey = "0uF8CVAb403K1SP0oDjiAxqe43KilFHd";
let currentHour;
let nextBtn = document.querySelector("#nextBtn");
let prevBtn = document.querySelector("#prevBtn");
let hourlyContainer = document.querySelector(".hourlyforecast");
const scrollAmount = 100;

function updateButtons(){
    // handling previousButton
    if(hourlyContainer.scrollLeft <=0){
        prevBtn.disabled = true;
    }
    else{
        prevBtn.disabled = false;
    }
    
    // handling nextButton
    if(hourlyContainer.scrollLeft + hourlyContainer.clientWidth >= hourlyContainer.scrollWidth){
        nextBtn.disabled = true;
    }
    else{
        nextBtn.disabled = false;
    }
}

hourlyContainer.addEventListener("scroll", updateButtons);

nextBtn.addEventListener("click",()=>{
    hourlyContainer.scrollBy({left: scrollAmount, behavior:"smooth"});
    setTimeout(updateButtons, 4000);
});
prevBtn.addEventListener("click",()=>{
    hourlyContainer.scrollBy({left: -scrollAmount, behavior:"smooth"});
    setTimeout(updateButtons, 4000);
});



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
    1100: "icons/sun.png",
    4001: "icons/rain.png"
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
                console.log(day);
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
                conditions[i].innerHTML = `<div style=" display: flex; flex-direction: row; gap:0.5rem "><div style="font-family:system-ui;">${weatherDescriptions[condition]}</div> <img src= ${openWeatherCode} alt="weather" style="width:30px; height:30px; margin-right:10px;"/></div>`;
                i++;
                dates[0].innerText = "Today";
                dates[1].innerText = "Tomorrow";
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
            const container = document.querySelector("#weather");
            const hourly = data.timelines.hourly;
            const degree = '\u00B0';
            let i = 0;
            hourly.forEach(hour => {
                let hourcount = hour.time.slice(11, 13);
                // console.log(hour);
                if ((hourcount > currentHour - 3 && i == 0) || (i > 0)) {
                    // console.log(hourcount);
                    // console.log(currentHour);
                    // console.log(i);
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

                    console.log(time);
                    hours[i].innerText = time;
                    htemps[i].innerText = temp + degree + "C";


                    if (hourcount == currentHour) {
                        hours[i].style.color = "#e4921fff";
                        htemps[i].style.color = "#e4921fff";
                        hours[i].style.opacity = "1";
                        htemps[i].style.opacity = "1";
                    }
                    else if (i<=1) {
                        hours[i].style.opacity = "0.7";
                        htemps[i].style.opacity = "0.7";
                    }
                    i++;
                    updateButtons();
                    document.querySelector(".loader").style.display ="none";
                }
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