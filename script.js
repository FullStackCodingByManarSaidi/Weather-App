
// ===================================
// 1. Récupérer les éléments HTML
// ===================================

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const message = document.getElementById("message");


// ===================================
// 2. Traduire les codes météo
// ===================================

function getWeatherDescription(code) {

    const weatherCodes = {
        0: "Ciel dégagé ☀️",
        1: "Principalement dégagé 🌤️",
        2: "Partiellement nuageux ⛅",
        3: "Nuageux ☁️",
        45: "Brouillard 🌫️",
        48: "Brouillard givrant 🌫️",
        51: "Bruine légère 🌧️",
        53: "Bruine modérée 🌧️",
        55: "Bruine dense 🌧️",
        61: "Pluie légère 🌧️",
        63: "Pluie modérée 🌧️",
        65: "Forte pluie 🌧️",
        71: "Neige légère ❄️",
        73: "Neige modérée ❄️",
        75: "Forte neige ❄️",
        80: "Averses légères 🌦️",
        81: "Averses modérées 🌦️",
        82: "Fortes averses 🌧️",
        95: "Orage ⛈️",
        96: "Orage avec grêle ⛈️",
        99: "Orage violent ⛈️"
    };

    return weatherCodes[code] || "Conditions météo inconnues";
}


// ===================================
// 3. Rechercher une ville
// ===================================

async function searchCity(city) {

    try {

        message.textContent = "Recherche de la ville...";

        // Construire l'URL de géocodage
        const geocodingURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`;

        // Envoyer la requête
        const response = await fetch(geocodingURL);

        // Vérifier la réponse
        if (!response.ok) {
            throw new Error("Erreur lors de la recherche de la ville.");
        }

        // Convertir la réponse en JSON
        const data = await response.json();

        // Vérifier si la ville existe
        if (!data.results || data.results.length === 0) {
            message.textContent = "Ville introuvable. Essayez un autre nom.";
            return;
        }

        // Récupérer la première ville
        const location = data.results[0];

        // Récupérer les coordonnées
        const latitude = location.latitude;
        const longitude = location.longitude;

        // Récupérer la météo
        await getWeather(latitude, longitude, location);

    } catch (error) {

        console.error("Erreur :", error);
        message.textContent = "Une erreur est survenue. Vérifiez votre connexion.";

    }
}


// ===================================
// 4. Récupérer les données météo
// ===================================

async function getWeather(latitude, longitude, location) {

    try {

        message.textContent = "Récupération des données météo...";

        // Construire l'URL météo
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        // Envoyer la requête météo
        const response = await fetch(weatherURL);

        // Vérifier la réponse
        if (!response.ok) {
            throw new Error("Impossible de récupérer la météo.");
        }

        // Convertir la réponse en JSON
        const data = await response.json();

        // Récupérer les données actuelles
        const current = data.current;

        // Afficher les données dans HTML
        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${Math.round(current.temperature_2m)} °C`;

        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);

        humidity.textContent =
            `${current.relative_humidity_2m} %`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        message.textContent = "";

    } catch (error) {

        console.error("Erreur météo :", error);
        message.textContent = "Impossible de récupérer les données météo.";

    }
}


// ===================================
// 5. Événement du bouton Rechercher
// ===================================

searchButton.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Veuillez entrer le nom d'une ville.";
        return;
    }

    searchCity(city);

});


// ===================================
// 6. Rechercher avec la touche Entrée
// ===================================

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchButton.click();
    }

});
document.write('hello')