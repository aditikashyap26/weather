
const apiKey = "95f49a53b0a318bb11b2722a24c90e83";

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return;

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const [weatherRes, forecastRes] = await Promise.all([
    fetch(weatherURL),
    fetch(forecastURL),
  ]);

  const weatherData = await weatherRes.json();
  const forecastData = await forecastRes.json();

  if (weatherData.cod === "404") {
    document.getElementById("weatherResult").innerHTML = "City not found!";
    document.getElementById("forecast").innerHTML = "";
    return;
  }

  // Show current weather
  document.getElementById("weatherResult").innerHTML = `
    <h2>${weatherData.name}</h2>
    <p>Temperature: ${weatherData.main.temp}°C</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
    <p>Wind: ${weatherData.wind.speed} m/s</p>
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" />
  `;

  saveToHistory(city);
  setWeatherBackground(weatherData.weather[0].main.toLowerCase());

  // Show 5-day forecast (filtered to 12:00 PM entries)
  const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
  let forecastHTML = "";

  forecastList.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString();
    const temp = day.main.temp;
    const desc = day.weather[0].description;
    const icon = day.weather[0].icon;

    forecastHTML += `
      <div class="forecast-day">
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" />
        <p>${temp}°C</p>
        <p>${desc}</p>
      </div>
    `;
  });

  document.getElementById("forecast").innerHTML = forecastHTML;
}

function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    updateHistoryList();
  }
}

function updateHistoryList() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    list.appendChild(li);
  });
}

// 🌦 Set background based on weather
function setWeatherBackground(condition) {
  const body = document.body;
  const classes = ["sunny", "rainy", "cloudy", "snow", "thunderstorm", "mist", "clear"];
  classes.forEach(c => body.classList.remove(c));

  switch (condition) {
    case "rain":
    case "drizzle":
      body.classList.add("rainy");
      break;
    case "clouds":
      body.classList.add("cloudy");
      break;
    case "snow":
      body.classList.add("snow");
      break;
    case "thunderstorm":
      body.classList.add("thunderstorm");
      break;
    case "mist":
    case "fog":
    case "haze":
      body.classList.add("mist");
      break;
    case "clear":
      body.classList.add("sunny");
      break;
    default:
      body.classList.add("clear");
      break;
  }
}

// 🌙 Theme toggle
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("change", () => {
  const isDark = toggle.checked;
  document.body.className = isDark ? "dark" : "light";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.onload = () => {
  updateHistoryList();
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.className = savedTheme;
  toggle.checked = savedTheme === "dark";
};
