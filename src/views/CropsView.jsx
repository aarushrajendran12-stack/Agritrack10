import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api.js';
import { CropTrackingCenterpiece } from '../components/CropTrackingCenterpiece';
import { CropStageModal } from '../components/CropStageModal';
import {
  Sprout,
  PlusCircle,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const CropsView = ({ onOpenAddCrop }) => {
  const { crops, activeCrop, setActiveCrop, t } = useAuth();
  const [intelligence, setIntelligence] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeCrop) {
      setIsLoading(true);
      api
        .getCropById(activeCrop.id)
        .then((res) => {
          setIntelligence(res.data?.intelligence);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [activeCrop]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🌱 Crop Intelligence & Growth Tracking</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Stage-by-stage crop monitoring from Sowing to Post-Harvest based on ICAR guidelines
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddCrop}>
          <PlusCircle size={16} />
          <span>Add Another Crop</span>
        </button>
      </div>

      {/* Centerpiece active crop component */}
      <CropTrackingCenterpiece
        crop={activeCrop}
        intelligence={intelligence}
        onOpenAddCrop={onOpenAddCrop}
      />

      {/* Comprehensive Stages Reference Cards */}
      {intelligence?.timeline && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.2rem' }}>Detailed Stage Specifications ({activeCrop?.cropType})</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {intelligence.timeline.map((stage) => (
              <div
                key={stage.id}
                style={{
                  border: `1.5px solid ${stage.isCurrent ? '#22c55e' : 'var(--border-color)'}`,
                  backgroundColor: stage.isCurrent ? 'var(--primary-light)' : '#fff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  cursor: 'pointer',
                  boxShadow: stage.isCurrent ? '0 0 15px rgba(22, 163, 74, 0.15)' : 'none',
                }}
                onClick={() => setSelectedStage(stage)}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                      Stage {stage.stageOrder}: {stage.stageName}
                    </span>
                    {stage.isCurrent && (
                      <span className="tag-pill" style={{ background: '#22c55e', color: '#fff' }}>
                        ● CURRENT PHASE
                      </span>
                    )}
                    {stage.isCompleted && (
                      <span className="tag-pill" style={{ color: '#15803d', borderColor: '#bbf7d0' }}>
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                    {stage.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>📅 Timeline: Day {stage.dayOffsetStart} – {stage.dayOffsetEnd}</span>
                    <span>🏛️ Guidance: {stage.sourceInstitution || 'ICAR'}</span>
                  </div>
                </div>

                <button
                  className="btn-secondary"
                  style={{ alignSelf: 'center', fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStage(stage);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStage && (
        <CropStageModal
          stage={selectedStage}
          cropType={activeCrop?.cropType}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </div>
  );
};
