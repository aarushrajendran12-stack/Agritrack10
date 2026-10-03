import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const ContextualRecommendationsCard = ({ recommendations, cropName, stageName }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <ShieldCheck size={36} color="#15803d" style={{ margin: '0 auto 0.75rem' }} />
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No Urgent Weather Hazards</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Conditions for your {cropName} ({stageName}) are currently within favorable thresholds. Continue routine field monitoring.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="#15803d" />
          <h3 style={{ fontSize: '1.25rem' }}>
            Contextual Agricultural Advisories
          </h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Rule-Matched via ICAR & KVK Knowledge Base
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recommendations.map((rec) => (
          <div key={rec.id} className={`recommendation-card ${rec.severity}`}>
            <div className="rec-header">
              <span className={`rec-severity-badge ${rec.severity}`}>
                {rec.severity}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Condition: {rec.condition}
              </span>
            </div>

            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              {rec.title}
            </h4>

            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {rec.message}
            </p>

            {/* Suggested Action Box */}
            <div className="rec-action-box">
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--primary-dark)', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                💡 Suggested Farmer Action
              </div>
              <div style={{ color: '#0f172a' }}>{rec.suggestedAction}</div>
            </div>

            {/* Credible Source Footer */}
            <div className="rec-source">
              <ShieldCheck size={14} color="#15803d" />
              <span>
                <strong>Verified Source:</strong> {rec.sourceInstitution}
                {rec.sourceDocument ? ` • Ref: ${rec.sourceDocument}` : ''}
              </span>
            </div>

            {/* Safety Disclaimer */}
            <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
              ℹ️ {rec.disclaimer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
