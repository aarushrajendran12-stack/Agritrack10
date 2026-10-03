import React from 'react';
import {
  X,
  Activity,
  AlertTriangle,
  Eye,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const CropStageModal = ({ stage, cropType, onClose }) => {
  if (!stage) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              {cropType} Growth Stage #{stage.stageOrder}
            </span>
            <h3 style={{ fontSize: '1.35rem', marginTop: '0.15rem' }}>
              {stage.stageName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span className="tag-pill active">
                Timeline: Day {stage.dayOffsetStart} – {stage.dayOffsetEnd}
              </span>
              {stage.isCurrent && <span className="tag-pill" style={{ background: '#22c55e', color: '#fff' }}>Current Stage</span>}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* What is happening in plant/soil */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>
              <Activity size={18} color="#15803d" />
              What is Happening in the Field
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {stage.whatIsHappening}
            </p>
          </div>

          {/* Important Farming Activities */}
          <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#0f172a' }}>
              <BookOpen size={18} color="#0284c7" />
              Key Activities & Operations
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {stage.keyActivities}
            </p>
          </div>

          {/* What to Monitor */}
          <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#b45309' }}>
              <Eye size={18} color="#d97706" />
              Critical Points to Monitor
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {stage.whatToMonitor}
            </p>
          </div>

          {/* Risks & Mitigation */}
          <div style={{ backgroundColor: 'var(--danger-light)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--danger)' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--danger)' }}>
              <AlertTriangle size={18} color="#dc2626" />
              Potential Risks & Vulnerabilities
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#7f1d1d', lineHeight: 1.5 }}>
              {stage.risks}
            </p>
          </div>

          {/* Verified Guidance */}
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--primary-dark)' }}>
              <ShieldCheck size={18} color="#15803d" />
              Verified Agricultural Guidance
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#14532d', lineHeight: 1.5, fontWeight: 500 }}>
              {stage.agriculturalGuidance}
            </p>
          </div>

          {/* Credible Source & Upcoming Stage Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Credible Source:</strong> {stage.sourceInstitution || 'ICAR - Indian Agricultural Research Institute'}
            </div>
            {stage.upcomingStageName && (
              <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)' }}>
                <span>Next: {stage.upcomingStageName}</span>
                <ArrowRight size={14} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
