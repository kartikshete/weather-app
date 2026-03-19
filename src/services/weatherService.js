import axios from 'axios';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const getWeatherData = async (city, lang = 'en') => {
    try {
        // 1. Get Coordinates
        const geoResponse = await axios.get(GEOCODING_URL, {
            params: {
                name: city,
                count: 1,
                language: 'en',
                format: 'json'
            }
        });

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            throw new Error(langError(lang));
        }

        const { latitude, longitude, name, country } = geoResponse.data.results[0];

        // 2. Get Weather
        const weatherResponse = await axios.get(WEATHER_URL, {
            params: {
                latitude,
                longitude,
                current_weather: true,
                hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m'
            }
        });

        return {
            location: `${name}, ${country}`,
            temp: Math.round(weatherResponse.data.current_weather.temperature),
            windSpeed: weatherResponse.data.current_weather.windspeed,
            condition: getWeatherCondition(weatherResponse.data.current_weather.weathercode, lang),
            humidity: weatherResponse.data.hourly.relativehumidity_2m[0], // approximate current
            time: weatherResponse.data.current_weather.time
        };
    } catch (error) {
        console.error('Weather error:', error);
        throw error;
    }
};

const langError = (lang) => {
    const errors = {
        en: 'City not found',
        hi: 'शहर नहीं मिला',
        mr: 'शहर सापडले नाही',
        hing: 'City nahi mila bhai'
    };
    return errors[lang] || errors.en;
};

const getWeatherCondition = (code, lang) => {
    const conditions = {
        0: { en: 'Clear sky', hi: 'साफ आसमान', mr: 'निरभ्र आकाश', hing: 'Bilkul saaf aasmaan' },
        1: { en: 'Mainly clear', hi: 'मुख्य रूप से साफ', mr: 'बऱ्यापैकी निरभ्र', hing: 'Thoda saaf hai' },
        2: { en: 'Partly cloudy', hi: 'आंशिक रूप से बादल', mr: 'कमी ढगाळ', hing: 'Thode baadal hain' },
        3: { en: 'Overcast', hi: 'बादल छाए रहेंगे', mr: 'ढगाळ', hing: 'Poora baadal chhaya hai' },
        45: { en: 'Fog', hi: 'कोहरा', mr: 'धुकं', hing: 'Bohot dhund hai' },
        48: { en: 'Depositing rime fog', hi: 'जमी हुई कोहरा', mr: 'धुकं', hing: 'Jamne wala dhund' },
        51: { en: 'Light drizzle', hi: 'हल्की बूंदाबांदी', mr: 'हल्का पाऊस', hing: 'Halki tip-tip ho rahi hai' },
        53: { en: 'Moderate drizzle', hi: 'मध्यम बूंदाबांदी', mr: 'मध्यम पाऊस', hing: 'Thodi tez tip-tip' },
        55: { en: 'Dense drizzle', hi: 'घनी बूंदाबांदी', mr: 'जोरदार पाऊस', hing: 'Zor ki tip-tip' },
        61: { en: 'Slight rain', hi: 'हल्की बारिश', mr: 'हल्का पाऊस', hing: 'Thodi baarish' },
        63: { en: 'Moderate rain', hi: 'मध्यम बारिश', mr: 'मध्यम पाऊस', hing: 'Theek-thaak baarish' },
        65: { en: 'Heavy rain', hi: 'भारी बारिश', mr: 'मुसळधार पाऊस', hing: 'Bohot tez baarish' },
        71: { en: 'Slight snow', hi: 'हल्की बर्फबारी', mr: 'हल्की बर्फवृष्टी', hing: 'Halki baraf gir rahi hai' },
        73: { en: 'Moderate snow', hi: 'मध्यम बर्फबारी', mr: 'मध्यम बर्फवृष्टी', hing: 'Thodi baraf gir rahi hai' },
        75: { en: 'Heavy snow', hi: 'भारी बर्फबारी', mr: 'जोरदार बर्फवृष्टी', hing: 'Bohot baraf gir rahi hai' },
        95: { en: 'Thunderstorm', hi: 'आंधी तूफान', mr: 'वादळी पाऊस', hing: 'Bijli kadak rahi hai' },
    };

    const defaultCondition = { en: 'Unknown', hi: 'अज्ञात', mr: 'अज्ञात', hing: 'Pata nahi yaar' };
    const condition = conditions[code] || defaultCondition;
    return condition[lang] || condition.en;
};
