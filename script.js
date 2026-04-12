













const key = "69e63909fb6e55a180806cb7fe8a5954";
const apiKey = "0uF8CVAb403K1SP0oDjiAxqe43KilFHd";

/* ================= DOM ================= */
const cityname = document.querySelector("h3");
const temp = document.querySelector("h1");
const decrip = document.querySelector("#descrip");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");

const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");
const hourlyContainer = document.querySelector(".hourlyforecast");
const inputEl = document.querySelector("#input");


/* ================= STATE ================= */
let currentHour = 0;
const scrollAmount = 100;

/* ================= SCROLL BUTTONS ================= */
function updateButtons() {
    prevBtn.disabled = hourlyContainer.scrollLeft <= 0;

    nextBtn.disabled =
        hourlyContainer.scrollLeft + hourlyContainer.clientWidth >=
        hourlyContainer.scrollWidth;
}

hourlyContainer.addEventListener("scroll", updateButtons);

nextBtn.addEventListener("click", () => {
    hourlyContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(updateButtons, 300);
});

prevBtn.addEventListener("click", () => {
    hourlyContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    setTimeout(updateButtons, 300);
});

/* ================= DATA TABLES ================= */
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
    PK: "Pakistan",
    US: "United States",
    IN: "India",
    GB: "United Kingdom",
    // keep rest same...
};

/* ================= UTILS ================= */
function getDayName(dateString) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date(dateString).getUTCDay()];
}

function formatHour(time) {
    let h = Number(time);

    if (h >= 12) {
        return h === 12 ? "12PM" : `${h - 12}PM`;
    }
    return h === 0 ? "12AM" : `${h}AM`;
}

/* ================= WEEKLY ================= */
function weeklyData() {
    let loc = inputEl.value || "gujranwala";

    const dates = document.querySelectorAll(".date");
    const temps = document.querySelectorAll(".temp");
    const conditions = document.querySelectorAll(".condition");

    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${loc}&timesteps=1d&apikey=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const daily = data.timelines.daily;
            const degree = "\u00B0";

            daily.forEach((day, i) => {
                const code = day.values.weatherCodeMax;

                dates[i].innerText = i === 0 ? "Today" :
                    i === 1 ? "Tomorrow" :
                        getDayName(day.time);

                temps[i].innerText = `${day.values.temperatureAvg}${degree}C`;

                conditions[i].innerHTML = `
                    <div style="display:flex;gap:0.5rem;align-items:center;">
                        <span>${weatherDescriptions[code]}</span>
                        <img src="${weatherIconMap[code] || ''}" width="25" />
                    </div>
                `;
            });
        })
        .catch(err => console.log("Weekly error:", err));
}

/* ================= HOURLY ================= */
function hourlyData() {
    let loc = inputEl.value || "gujranwala";

    const hours = document.querySelectorAll(".hour");
    const htemps = document.querySelectorAll(".htemp");

    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${loc}&timesteps=1h&apikey=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const hourly = data.timelines.hourly;
            const degree = "\u00B0";

            let i = 0;

            hourly.forEach(hour => {
                const hourVal = hour.time.slice(11, 13);

                if ((hourVal > currentHour - 3 && i === 0) || i > 0) {

                    hours[i].innerText = formatHour(hourVal);
                    htemps[i].innerText = `${hour.values.temperature}${degree}C`;

                    if (hourVal == currentHour) {
                        hours[i].style.color = "#e4921f";
                        htemps[i].style.color = "#e4921f";
                    } else {
                        hours[i].style.opacity = "0.7";
                        htemps[i].style.opacity = "0.7";
                    }

                    i++;
                }
            });

            // document.querySelector(".loader").style.display = "none";
            updateButtons();
        })
        .catch(err => console.log("Hourly error:", err));
}

/* ================= MAIN WEATHER ================= */
async function getData() {
    let city = inputEl.value.trim() || "gujranwala";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

    let res = await fetch(url);
    let data = await res.json();

    if (data.cod !== 200) {
        alert(data.message);
        return;
    }

    const degree = "\u00B0";

    cityname.innerText = `${data.name}, ${countryMap[data.sys.country] || data.sys.country}`;
    temp.innerText = `${data.main.temp}${degree}C`;
    decrip.innerText = data.weather[0].description;
    humidity.innerText = `Humidity: ${data.main.humidity}`;
    pressure.innerText = `Pressure: ${data.main.pressure}`;

    const localTime = new Date((data.dt + data.timezone) * 1000);
    currentHour = localTime.getUTCHours();

    weeklyData();
    hourlyData();
    document.querySelector(".loader").style.display = "none";
}

/* ================= EVENTS ================= */
window.addEventListener("load", getData);

inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getData();
    }
});