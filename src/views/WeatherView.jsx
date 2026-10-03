import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api.js';
import { WeatherIntelligenceCard } from '../components/WeatherIntelligenceCard';
import { ContextualRecommendationsCard } from '../components/ContextualRecommendationsCard';
import {
  CloudSun,
  MapPin,
  Search,
  Sparkles,
  Droplets,
  Wind,
} from 'lucide-react';

export const WeatherView = () => {
  const { activeCrop } = useAuth();
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [searchLocation, setSearchLocation] = useState('Malegaon, Maharashtra');
  const [inputVal, setInputVal] = useState('Malegaon, Maharashtra');
  const [isLoading, setIsLoading] = useState(false);

  const loadWeather = async (loc) => {
    setIsLoading(true);
    try {
      const res = await api.getWeather(loc);
      setWeather(res.data?.weather);

      if (activeCrop) {
        const recRes = await api.getCropRecommendations(activeCrop.id);
        setRecommendations(recRes.data?.recommendations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loc = activeCrop?.farm?.locationName || 'Malegaon, Maharashtra';
    setSearchLocation(loc);
    setInputVal(loc);
    loadWeather(loc);
  }, [activeCrop]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchLocation(inputVal);
      loadWeather(inputVal);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>☁️ Weather & Agro-Meteorological Advisories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            High-resolution agricultural weather forecasting and contextual crop alerts
          </p>
        </div>

        {/* Location Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', minWidth: '320px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#15803d' }} />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search district (e.g. Malegaon, Nashik)"
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
            Search
          </button>
        </form>
      </div>

      {/* Weather Card with Warnings */}
      <WeatherIntelligenceCard
        weather={weather}
        cropStageName={activeCrop ? 'Vegetative Growth' : 'Routine'}
        cropType={activeCrop?.cropType || 'Wheat'}
      />

      {/* Contextual Agro Advisories */}
      <ContextualRecommendationsCard
        recommendations={recommendations}
        cropName={activeCrop?.cropType || 'Wheat'}
        stageName="Vegetative Growth"
      />
    </div>
  );
};
