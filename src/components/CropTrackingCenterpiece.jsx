import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CropStageModal } from './CropStageModal';

export const CropTrackingCenterpiece = ({
  crop,
  intelligence,
  onOpenAddCrop,
}) => {
  const { t } = useAuth();
  const [selectedStage, setSelectedStage] = useState(null);

  if (!crop || !intelligence) {
    return (
      <div className="crop-centerpiece-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌱</div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Active Crop Added Yet</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          Add your farm's first crop to unlock real-time stage tracking, weather-based advisories, and tailored input recommendations.
        </p>
        <button className="btn-primary" onClick={onOpenAddCrop} style={{ margin: '0 auto' }}>
          <span>+ Add Your First Crop</span>
        </button>
      </div>
    );
  }

  const {
    cropAgeDays,
    currentStage,
    stageProgressPercent,
    overallProgressPercent,
    nextStage,
    expectedHarvestDate,
    timeline,
  } = intelligence;

  const harvestFormatted = expectedHarvestDate
    ? new Date(expectedHarvestDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Estimated in 100 days';

  const sowingFormatted = crop.sowingDate
    ? new Date(crop.sowingDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown';

  const getCropEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case 'wheat': return '🌾';
      case 'rice': return '🍚';
      case 'maize': return '🌽';
      case 'cotton': return '☁️';
      case 'soybean': return '🌱';
      default: return '🌿';
    }
  };

  return (
    <>
      <div className="crop-centerpiece-card">
        {/* Header Grid */}
        <div className="crop-header-grid">
          <div className="crop-badge-title">
            <span className="crop-icon-large">{getCropEmoji(crop.cropType)}</span>
            <div className="crop-title-text">
              <h2>
                {crop.cropType} {crop.variety ? `• ${crop.variety}` : ''}
              </h2>
              <div className="crop-meta-tags">
                <span className="tag-pill active">
                  <MapPin size={12} style={{ display: 'inline', marginRight: '3px' }} />
                  {crop.farm?.locationName || 'Farm Field'}
                </span>
                <span className="tag-pill">Season: {crop.croppingSeason}</span>
                <span className="tag-pill">Soil: {crop.soilType || 'Loamy'}</span>
                {crop.fieldSizeAcre && <span className="tag-pill">{crop.fieldSizeAcre} Acres</span>}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <Sparkles size={14} color="#15803d" />
              Stage: {currentStage?.stageName}
            </span>
          </div>
        </div>

        {/* Crop Key Numbers Strip */}
        <div className="crop-stats-grid">
          <div className="stat-item">
            <span className="stat-label">Crop Age</span>
            <span className="stat-value highlight">{cropAgeDays} Days</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Sowing Date</span>
            <span className="stat-value">{sowingFormatted}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Current Phase</span>
            <span className="stat-value" style={{ fontSize: '1rem', color: '#15803d' }}>
              {currentStage?.stageName?.split('&')?.[0] || 'Active Growth'}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Next Stage In</span>
            <span className="stat-value">
              {nextStage ? `${nextStage.daysUntilNextStage} Days` : 'At Maturity'}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Expected Harvest</span>
            <span className="stat-value">{harvestFormatted}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-header">
            <span>Overall Lifecycle Growth ({overallProgressPercent}%)</span>
            <span style={{ color: 'var(--text-muted)' }}>
              Stage Progress: {stageProgressPercent}%
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.max(4, overallProgressPercent)}%` }}
            />
          </div>
        </div>

        {/* Interactive Visual Timeline */}
        <div className="timeline-section-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#15803d" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Crop Growth Stages & Timeline
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            👉 Click any stage to inspect verified agricultural package
          </span>
        </div>

        <div className="timeline-scroll-wrapper">
          <div className="crop-timeline-steps">
            {timeline?.map((stage, idx) => {
              const isLast = idx === timeline.length - 1;
              return (
                <div
                  key={stage.id || idx}
                  className={`timeline-step ${stage.status.toLowerCase()}`}
                  onClick={() => setSelectedStage(stage)}
                  title={`Click to view details for ${stage.stageName}`}
                >
                  {!isLast && <div className="timeline-connector" />}
                  <div className="step-node">
                    {stage.isCompleted ? (
                      <CheckCircle2 size={20} color="#fff" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="step-info">
                    <span className="step-name">{stage.stageName}</span>
                    {stage.isCurrent && (
                      <span className="step-badge-curr">Current</span>
                    )}
                    <span className="step-days">
                      Day {stage.dayOffsetStart}–{stage.dayOffsetEnd}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deep-dive Stage Modal */}
      {selectedStage && (
        <CropStageModal
          stage={selectedStage}
          cropType={crop.cropType}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </>
  );
};
