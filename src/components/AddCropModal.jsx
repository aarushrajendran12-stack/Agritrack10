import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Sprout,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const AddCropModal = ({ isOpen, onClose, onCropCreated }) => {
  const { refreshCrops, setActiveCrop } = useAuth();
  const [metadata, setMetadata] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    cropType: 'Wheat',
    variety: 'HD-2967',
    sowingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 35 days ago for vegetative stage!
    croppingSeason: 'Rabi',
    locationName: 'Malegaon, Maharashtra',
    soilType: 'Loamy',
    fieldSizeAcre: 3.5,
    irrigationMethod: 'Drip Irrigation',
  });

  useEffect(() => {
    if (isOpen) {
      api.getCropMetadata().then((res) => {
        setMetadata(res.data);
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCropChange = (cropType) => {
    const defaultVariety = metadata?.varieties?.find((v) => v.cropType === cropType)?.varietyName || '';
    const defaultSeason = cropType === 'Wheat' ? 'Rabi' : 'Kharif';
    setFormData({
      ...formData,
      cropType,
      variety: defaultVariety,
      croppingSeason: defaultSeason,
    });
  };

  const filteredVarieties = metadata?.varieties?.filter(
    (v) => v.cropType === formData.cropType
  ) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createCrop({
        ...formData,
        fieldSizeAcre: Number(formData.fieldSizeAcre),
        sowingDate: new Date(formData.sowingDate).toISOString(),
      });
      await refreshCrops();
      if (res.data?.crop) {
        setActiveCrop(res.data.crop);
      }
      if (onCropCreated) onCropCreated(res.data?.crop);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to add crop profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.25rem' }}>Add New Crop Profile</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Crop Selection */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
              Select Crop
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {['Wheat', 'Rice', 'Maize', 'Cotton', 'Soybean'].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleCropChange(c)}
                  className={formData.cropType === c ? 'btn-primary' : 'btn-secondary'}
                  style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '0.85rem' }}
                >
                  {c === 'Wheat' ? '🌾 Wheat' : c === 'Rice' ? '🍚 Rice' : c === 'Maize' ? '🌽 Maize' : c === 'Cotton' ? '☁️ Cotton' : '🌱 Soybean'}
                </button>
              ))}
            </div>
          </div>

          {/* Variety & Season */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Crop Variety
              </label>
              <select
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              >
                {filteredVarieties.length > 0 ? (
                  filteredVarieties.map((v) => (
                    <option key={v.id} value={v.varietyName}>
                      {v.varietyName}
                    </option>
                  ))
                ) : (
                  <option value="Standard Hybrid">Standard Hybrid</option>
                )}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Season
              </label>
              <select
                value={formData.croppingSeason}
                onChange={(e) => setFormData({ ...formData, croppingSeason: e.target.value })}
              >
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
          </div>

          {/* Sowing Date with Quick Demo Buttons */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Sowing Date
              </label>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  type="button"
                  style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 35);
                    setFormData({ ...formData, sowingDate: d.toISOString().split('T')[0] });
                  }}
                >
                  35 Days Ago (Vegetative Demo)
                </button>
                <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>|</span>
                <button
                  type="button"
                  style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                  onClick={() => {
                    setFormData({ ...formData, sowingDate: new Date().toISOString().split('T')[0] });
                  }}
                >
                  Today
                </button>
              </div>
            </div>
            <input
              type="date"
              required
              value={formData.sowingDate}
              onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
            />
          </div>

          {/* Location and Soil */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Field Location
              </label>
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Malegaon, Maharashtra"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
                <option value="Loamy">Loamy Soil</option>
                <option value="Black Cotton">Black Cotton Soil</option>
                <option value="Clayey">Clayey Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Alluvial">Alluvial Soil</option>
              </select>
            </div>
          </div>

          {/* Field Size and Irrigation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Field Area (Acres)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={formData.fieldSizeAcre}
                onChange={(e) => setFormData({ ...formData, fieldSizeAcre: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Irrigation Method
              </label>
              <select
                value={formData.irrigationMethod}
                onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler System</option>
                <option value="Canal / Flood">Canal / Surface Flood</option>
                <option value="Rainfed">Rainfed / Dryland</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? 'Calculating Lifecycle...' : 'Start Tracking This Crop'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
