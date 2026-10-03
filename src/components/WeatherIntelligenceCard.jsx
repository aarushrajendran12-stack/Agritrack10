import React from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Calendar,
  CloudSun,
} from 'lucide-react';

export const WeatherIntelligenceCard = ({ weather, cropStageName, cropType }) => {
  if (!weather) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <CloudSun size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
        <p>Loading weather intelligence...</p>
      </div>
    );
  }

  const {
    location,
    currentTemperature,
    minTemperature,
    maxTemperature,
    rainProbability,
    expectedRainMm,
    relativeHumidity,
    windSpeedKmh,
    conditionText,
    isHeavyRain,
    isHighHeat,
    forecast,
  } = weather;

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Urgent Weather Alert Banner if Heavy Rain or High Heat */}
      {isHeavyRain && (
        <div className="weather-alert-banner">
          <div className="alert-icon-box">
            <CloudRain size={28} />
          </div>
          <div className="alert-content" style={{ flex: 1 }}>
            <h3>⚠️ Weather Advisory: Heavy Rain Expected</h3>
            <p>
              Your {cropType || 'crop'} is currently in the <strong>{cropStageName || 'active growth'}</strong> stage.
              Rain probability is <strong>{rainProbability}%</strong> with expected rainfall of ~<strong>{expectedRainMm} mm</strong>.
            </p>
            <div className="alert-suggestion">
              💡 <strong>Action to Consider:</strong> Inspect and clear all field boundary drainage channels. Strictly avoid any scheduled flood or canal irrigation.
            </div>
          </div>
        </div>
      )}

      {isHighHeat && !isHeavyRain && (
        <div className="weather-alert-banner" style={{ borderColor: '#fca5a5', background: 'linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)' }}>
          <div className="alert-icon-box" style={{ backgroundColor: '#fecaca', color: '#b91c1c' }}>
            <Sun size={28} />
          </div>
          <div className="alert-content" style={{ flex: 1 }}>
            <h3 style={{ color: '#991b1b' }}>🔥 High Temperature Advisory</h3>
            <p style={{ color: '#7f1d1d' }}>
              Daytime temperatures are reaching <strong>{maxTemperature}°C</strong>. Crops in flowering or grain filling are vulnerable to heat stress.
            </p>
            <div className="alert-suggestion" style={{ borderLeftColor: '#dc2626', color: '#991b1b' }}>
              💡 <strong>Action to Consider:</strong> Provide light evening sprinkler irrigation to alleviate canopy heat and maintain cell turgor.
            </div>
          </div>
        </div>
      )}

      {/* Main Weather Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Live Field Weather
            </span>
            <h3 style={{ fontSize: '1.25rem' }}>{location}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="tag-pill" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
              ● Live Sync
            </span>
          </div>
        </div>

        {/* Current Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Thermometer size={28} color="#d97706" />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentTemperature}°C</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Min: {minTemperature}° / Max: {maxTemperature}°
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CloudRain size={28} color="#0284c7" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{rainProbability}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rain Probability</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Droplets size={28} color="#0d9488" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{relativeHumidity}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Humidity</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wind size={28} color="#64748b" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{windSpeedKmh} km/h</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wind Speed</div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Strip */}
        {forecast && forecast.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
              7-Day Agricultural Forecast
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
                gap: '0.5rem',
                overflowX: 'auto',
              }}
            >
              {forecast.map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: idx === 0 ? 'var(--primary-light)' : '#fff',
                    border: `1px solid ${idx === 0 ? 'var(--primary-border)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>
                    {idx === 0 ? 'Today' : day.dayName}
                  </div>
                  <div style={{ fontSize: '1.1rem', margin: '0.3rem 0' }}>
                    {day.rainProbability > 50 ? '🌧️' : day.maxTemp > 32 ? '☀️' : '⛅'}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {day.maxTemp}° / {day.minTemp}°
                  </div>
                  <div style={{ fontSize: '0.7rem', color: day.rainProbability > 50 ? '#0284c7' : 'var(--text-muted)', fontWeight: 600 }}>
                    {day.rainProbability}% Rain
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
