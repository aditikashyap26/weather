
const apiKey = "95f49a53b0a318bb11b2722a24c90e83";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    if (data.code === "404") {
      document.getElementById("weatherResult").innerHTML = "City not found!";
      return;
    }
    document.getElementById("weatherResult").innerHTML = `
    <h2>${data.name}</h2>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
  `;

  saveToHistory(city);
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
  
  window.onload = updateHistoryList;