import React, { useState } from 'react';
import { Search, Wind, Droplets, MapPin, CloudSun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeatherData } from './services/weatherService';

const translations = {
  en: {
    title: 'Weather App',
    subtitle: 'Enter a location name to get the current weather.',
    placeholder: 'Enter location name',
    button: 'Get Weather',
    wind: 'Wind Speed',
    humidity: 'Humidity',
    empty: 'Search for a city to see results',
    error: 'Failed to fetch weather data'
  },
  hi: {
    title: 'मौसम ऐप',
    subtitle: 'वर्तमान मौसम जानने के लिए स्थान का नाम दर्ज करें।',
    placeholder: 'स्थान का नाम दर्ज करें',
    button: 'मौसम देखें',
    wind: 'हवा की गति',
    humidity: 'नमी',
    empty: 'परिणाम देखने के लिए शहर खोजें',
    error: 'मौसम डेटा प्राप्त करने में विफल'
  },
  mr: {
    title: 'हवामान ॲप',
    subtitle: 'सध्याचे हवामान मिळवण्यासाठी ठिकाणाचे नाव प्रविष्ट करा.',
    placeholder: 'ठिकाणाचे नाव प्रविष्ट करा',
    button: 'हवामान पहा',
    wind: 'वाऱ्याचा वेग',
    humidity: 'आर्द्रता',
    empty: 'परिणाम पाहण्यासाठी शहर शोधा',
    error: 'हवामान माहिती मिळवण्यात अपयश'
  },
  hing: {
    title: 'Weather App',
    subtitle: 'Mausam janne ke liye jagah ka naam daalo.',
    placeholder: 'Jagah ka naam daalo',
    button: 'Mausam Dekho',
    wind: 'Hawa ki Speed',
    humidity: 'Nami',
    empty: 'Result dekhne ke liye city search karo',
    error: 'Mausam data nahi mila'
  }
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');

  const t = translations[lang];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await getWeatherData(city, lang);
      setWeather(data);
    } catch (err) {
      setError(err.message || t.error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLangChange = (e) => {
    setLang(e.target.value);
    setWeather(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Globe size={16} color="white" style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }} />
          <select
            value={lang}
            onChange={handleLangChange}
            style={{
              appearance: 'none',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              padding: '8px 16px 8px 36px',
              color: 'white',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            <option value="en" style={{ color: 'black' }}>English</option>
            <option value="hi" style={{ color: 'black' }}>Hindi</option>
            <option value="mr" style={{ color: 'black' }}>Marathi</option>
            <option value="hing" style={{ color: 'black' }}>Hinglish</option>
          </select>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>{t.subtitle}</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="glass-input"
            placeholder={t.placeholder}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <MapPin
            size={18}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}
          />
        </div>
        <button type="submit" className="glass-button" disabled={loading}>
          {loading ? <div className="loading-spinner" /> : <><Search size={18} /> {t.button}</>}
        </button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="error-msg"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {weather && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="weather-info"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
              <MapPin size={16} />
              <span>{weather.location}</span>
            </div>

            <div className="temp">{weather.temp}°C</div>
            <div className="condition">{weather.condition}</div>

            <div className="details-grid">
              <div className="detail-item">
                <Wind size={20} color="#007aff" />
                <span className="detail-value">{weather.windSpeed} km/h</span>
                <span className="detail-label">{t.wind}</span>
              </div>
              <div className="detail-item">
                <Droplets size={20} color="#007aff" />
                <span className="detail-value">{weather.humidity}%</span>
                <span className="detail-label">{t.humidity}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!weather && !loading && !error && (
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <CloudSun size={64} style={{ margin: '0 auto 1rem' }} />
          <p>{t.empty}</p>
        </div>
      )}
    </motion.div>
  );
}

export default App;
