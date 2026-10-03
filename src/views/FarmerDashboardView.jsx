import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api.js';
import { CropTrackingCenterpiece } from '../components/CropTrackingCenterpiece';
import { WeatherIntelligenceCard } from '../components/WeatherIntelligenceCard';
import { ContextualRecommendationsCard } from '../components/ContextualRecommendationsCard';
import {
  Sprout,
  ShoppingBag,
  IndianRupee,
  PlusCircle,
  CloudRain,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const FarmerDashboardView = ({
  setActiveTab,
  onOpenAddCrop,
  onOpenCart,
}) => {
  const { user, activeCrop, t } = useAuth();
  const [intelligence, setIntelligence] = useState(null);
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [financeSummary, setFinanceSummary] = useState(null);
  const [contextualInputs, setContextualInputs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeCrop) {
      setIsLoading(true);
      // Fetch full crop details including intelligence, weather, and recommendations
      api
        .getCropById(activeCrop.id)
        .then((res) => {
          setIntelligence(res.data?.intelligence);
          setWeather(res.data?.weather);
          setRecommendations(res.data?.recommendations || []);
        })
        .catch((err) => console.error('Failed to load crop intelligence:', err))
        .finally(() => setIsLoading(false));

      // Fetch contextual marketplace inputs
      api
        .getContextualInputs(activeCrop.cropType)
        .then((res) => setContextualInputs(res.data?.products || []))
        .catch(console.error);
    } else {
      // Fetch default location weather
      api
        .getWeather('Malegaon, Maharashtra')
        .then((res) => setWeather(res.data?.weather))
        .catch(console.error);
    }

    // Fetch finance summary
    api
      .getFinancialSummary()
      .then((res) => setFinanceSummary(res.data))
      .catch(console.error);
  }, [activeCrop]);

  return (
    <div>
      {/* Farmer Greeting Strip */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {t.greeting}, {user?.name || 'Farmer'} 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Connected Crop Intelligence & Field Management Platform
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setActiveTab('crops')}>
            <Sprout size={16} color="#15803d" />
            <span>Track Crop</span>
          </button>
          <button className="btn-secondary" onClick={() => setActiveTab('marketplace')}>
            <ShoppingBag size={16} color="#0284c7" />
            <span>Marketplace</span>
          </button>
          <button className="btn-secondary" onClick={() => setActiveTab('finance')}>
            <IndianRupee size={16} color="#d97706" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* CORE FEATURE: The Crop Tracking Centerpiece */}
      <CropTrackingCenterpiece
        crop={activeCrop}
        intelligence={intelligence}
        onOpenAddCrop={onOpenAddCrop}
      />

      {/* Weather Alert & Contextual Recommendations */}
      <div className="dashboard-grid">
        <div>
          {/* Weather Intelligence Card */}
          <WeatherIntelligenceCard
            weather={weather}
            cropStageName={intelligence?.currentStage?.stageName}
            cropType={activeCrop?.cropType}
          />

          {/* Contextual Recommendations Card */}
          <ContextualRecommendationsCard
            recommendations={recommendations}
            cropName={activeCrop?.cropType || 'Wheat'}
            stageName={intelligence?.currentStage?.stageName || 'Vegetative Growth'}
          />
        </div>

        {/* Right Sidebar on Dashboard: Financial Summary & Quick Contextual Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Financial Summary Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IndianRupee size={18} color="#15803d" />
                <h3 style={{ fontSize: '1.1rem' }}>Financial Summary</h3>
              </div>
              <button
                style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
                onClick={() => setActiveTab('finance')}
              >
                View Details →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Farm Income</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  ₹{(financeSummary?.totalIncome || 55000).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Farm Expenses</span>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>
                  ₹{(financeSummary?.totalExpenses || 18850).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '1rem',
                  fontWeight: 800,
                }}
              >
                <span>Net Farm Profit</span>
                <span style={{ color: 'var(--primary-dark)' }}>
                  ₹{(financeSummary?.netIncome || 36150).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contextual Inputs Spotlight */}
          {contextualInputs.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
                  Inputs for Current Stage
                </h3>
                <button
                  style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
                  onClick={() => setActiveTab('marketplace')}
                >
                  Shop All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contextualInputs.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                        ₹{item.price}
                      </div>
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        api.addToCart(item.id, 1).then(() => onOpenCart()).catch(alert);
                      }}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
