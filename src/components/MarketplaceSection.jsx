import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Search,
  Filter,
  Check,
  Plus,
  Sparkles,
  PackageCheck,
  Clock,
} from 'lucide-react';

export const MarketplaceSection = ({ onOpenCart, onOpenOrders }) => {
  const { activeCrop, refreshCart, t } = useAuth();
  const [products, setProducts] = useState([]);
  const [contextualInputs, setContextualInputs] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const categories = [
    { id: 'ALL', label: 'All Products' },
    { id: 'FERTILIZERS', label: 'Fertilizers & Nutrients' },
    { id: 'SEEDS', label: 'Certified Seeds' },
    { id: 'SOIL_AMENDMENTS', label: 'Soil Amendments' },
    { id: 'PEST_MANAGEMENT', label: 'Crop Protection' },
    { id: 'TOOLS', label: 'Farm Tools' },
  ];

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({
        category: category !== 'ALL' ? category : undefined,
        search: searchTerm || undefined,
      });
      setProducts(res.data?.products || []);

      if (activeCrop) {
        const ctxRes = await api.getContextualInputs(activeCrop.cropType);
        setContextualInputs(ctxRes.data?.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, activeCrop]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    try {
      await api.addToCart(product.id, 1);
      await refreshCart();
      setSuccessId(product.id);
      setTimeout(() => setSuccessId(null), 1500);
    } catch (err) {
      alert(err.message || 'Could not add to cart');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* Top Banner and Quick Orders Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🌾 Farm Input Marketplace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Verified agricultural seeds, fertilizers, biologicals, and equipment
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={onOpenOrders}>
            <Clock size={16} />
            <span>My Orders</span>
          </button>
          <button className="btn-primary" onClick={onOpenCart}>
            <ShoppingBag size={16} />
            <span>Open Cart</span>
          </button>
        </div>
      </div>

      {/* Context-Aware Section: Inputs for Active Crop */}
      {activeCrop && contextualInputs.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1.5px solid var(--primary-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>
              Tailored Inputs for Your {activeCrop.cropType} ({activeCrop.croppingSeason} Season)
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '1.25rem' }}>
            Curated verified fertilizers, soil conditioners and inputs suited for your crop's current vegetative growth.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {contextualInputs.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.brand}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.25rem 0' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Target Stage: {item.targetCropStage || 'All Stages'}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    ₹{item.price}
                  </span>
                  <button
                    className="btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => handleAddToCart(item)}
                    disabled={addingId === item.id}
                  >
                    {successId === item.id ? <Check size={14} /> : <Plus size={14} />}
                    <span>{successId === item.id ? 'Added' : 'Add'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 280px', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search seeds, fertilizers, bio-fungicides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ flexShrink: 0 }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={category === cat.id ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading marketplace catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <PackageCheck size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3>No products found</h3>
          <p style={{ marginTop: '0.35rem' }}>Try clearing your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-img-wrapper">
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=60'}
                  alt={p.name}
                  className="product-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                <span className="product-badge-category">{p.category}</span>
              </div>

              <div className="product-body">
                <span className="product-brand">{p.brand}</span>
                <h4 className="product-title">{p.name}</h4>
                <p className="product-desc">{p.description}</p>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Suitable: <strong>{p.suitableCrops}</strong>
                </div>

                <div className="product-footer">
                  <div>
                    <span className="product-price">₹{p.price}</span>
                    <span className="product-unit"> / {p.unit}</span>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                    onClick={() => handleAddToCart(p)}
                    disabled={addingId === p.id}
                  >
                    {successId === p.id ? <Check size={16} /> : <Plus size={16} />}
                    <span>{successId === p.id ? 'Added' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
