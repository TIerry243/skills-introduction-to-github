const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherDiv = document.getElementById('weather');

const apiKey = '5eccb2ed22803078861486bb2c86b3d3'; // Substitua pela sua chave da API

searchButton.addEventListener('click', () => {
    const citiesInput = cityInput.value;
    const cities = citiesInput.split(',').map(city => city.trim());

    if (cities.length > 0) {
        getWeatherData(cities)
            .then(data => {
                weatherDiv.innerHTML = '';
                data.forEach(cityData => {
                    if (cityData) {
                        displayWeather(cityData);
                    }
                });
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                weatherDiv.innerHTML = '<div class="error">Erro ao carregar dados.</div>';
            });
    }
});

async function getWeatherData(cities) {
    const promises = cities.map(async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            console.log('Chamando a API:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro na resposta da API para ${city}: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao buscar dados para ${city}:`, error);
            return null;
        }
    });

    return Promise.all(promises);
}

function displayWeather(data) {
    console.log('Dados recebidos:', data);

    if (!data) {
        return;
    }

    const { name, main, weather, rain } = data;
    const temperature = main.temp;
    const feelsLike = main.feels_like;
    const humidity = main.humidity;
    const tempMin = main.temp_min;
    const tempMax = main.temp_max;
    const weatherCondition = weather[0].main;
    const rainLastHour = rain && rain['1h'];
    const pressure = main.pressure;

    const cityDiv = document.createElement('div');
    cityDiv.innerHTML = `
        <h2>${name}</h2>
        <p>Temperatura: ${temperature}°C</p>
        <p>Sensação térmica: ${feelsLike}°C</p>
        <p>Umidade: ${humidity}%</p>
        <p>Mínima: ${tempMin}°C / Máxima: ${tempMax}°C</p>
        <p>Condição: ${weatherCondition}</p>
        ${rainLastHour ? `<p>Chuva (última hora): ${rainLastHour} mm</p>` : ''}
        <p>Pressão: ${pressure} hPa</p>
    `;

    weatherDiv.appendChild(cityDiv);
}