import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Sprout,
  ShoppingBag,
  Package,
  History,
  PlusCircle,
  Check,
} from 'lucide-react';

export const AdminPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New recommendation rule state
  const [newRec, setNewRec] = useState({
    cropType: 'Wheat',
    stageKey: 'FLOWERING',
    condition: 'Hailstorm & Strong Gale Winds (> 45 km/h)',
    weatherCondition: 'HEAVY_RAIN',
    severity: 'CRITICAL',
    title: 'Lodging & Mechanical Shattering Emergency Alert',
    message: 'High speed gale winds with squalls can cause crop lodging and physical stem breakage.',
    suggestedAction: 'Suspend all field operations. Clear boundary drains to avoid root soil loosening.',
    sourceInstitution: 'ICAR - Indian Agricultural Research Institute (IARI)',
    sourceDocument: 'Wheat Weather Bulletin 2026',
  });

  // New product state
  const [newProd, setNewProd] = useState({
    name: 'Zinc Sulphate Heptahydrate 21% (5 kg)',
    category: 'FERTILIZERS',
    description: 'Essential micronutrient for preventing khaira disease in paddy and chlorosis in wheat.',
    price: 360,
    stockQuantity: 100,
    unit: 'bag (5 kg)',
    brand: 'IFFCO Micronutrients',
    suitableCrops: 'Wheat, Rice, Maize',
    targetCropStage: 'Vegetative Growth & Tillering',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, recsRes, ordersRes, logsRes] = await Promise.all([
        api.getAdminStats(),
        api.listAdminUsers(),
        api.listAdminRecommendations(),
        api.listAdminOrders(),
        api.getAuditLogs(),
      ]);
      setStats(statsRes.data);
      setUsersList(usersRes.data?.users || []);
      setRecommendations(recsRes.data?.recommendations || []);
      setOrders(ordersRes.data?.orders || []);
      setAuditLogs(logsRes.data?.logs || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      alert(`User role changed to ${newRole}`);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCreateRecommendation = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminRecommendation(newRec);
      alert('New agricultural recommendation advisory added successfully!');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to create recommendation');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminProduct({
        ...newProd,
        price: Number(newProd.price),
        stockQuantity: Number(newProd.stockQuantity),
      });
      alert('Product created and published to marketplace!');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to create product');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <ShieldCheck size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h3>Administrator Access Required</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          This control center is reserved for verified agricultural nodal officers and administrators.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#15803d', color: '#fff', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>⚙️ Admin Management System</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Agricultural knowledge base rules, marketplace products, user roles, and system audit trail
          </p>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'stats', label: 'Overview Stats', icon: ShieldCheck },
          { id: 'users', label: 'User Roles', icon: Users },
          { id: 'recommendations', label: 'Agro Recommendations', icon: Sprout },
          { id: 'products', label: 'Market Catalog', icon: ShoppingBag },
          { id: 'orders', label: 'Customer Orders', icon: Package },
          { id: 'audits', label: 'Audit Trail', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview Stats */}
      {activeTab === 'stats' && stats && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Farmers</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.totalUsers}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Farm Fields</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalFarms}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Crops Tracked</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>{stats.totalCrops}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Marketplace Products</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalProducts}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Input Orders</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7' }}>{stats.totalOrders}</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Administrative Audit Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats.recentAudits?.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.65rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong>{log.action}</strong> • {log.entityType} #{log.entityId?.slice(0, 8)}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      By: {log.adminUser?.name} ({log.adminUser?.email})
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users & Roles */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Registered Users & Role Assignment</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Current Role</th>
                  <th style={{ padding: '0.75rem' }}>Farms / Crops</th>
                  <th style={{ padding: '0.75rem' }}>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="tag-pill active">{u.role}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {u._count?.farms || 0} farms / {u._count?.crops || 0} crops
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="FARMER">FARMER</option>
                        <option value="SELLER">SELLER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Agro Recommendations Management */}
      {activeTab === 'recommendations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          {/* Existing Rules */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Verified Agricultural Recommendation Rules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recommendations.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: '0.85rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${r.severity === 'CRITICAL' ? '#dc2626' : r.severity === 'WARNING' ? '#f59e0b' : '#15803d'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{r.title}</span>
                    <span className={`rec-severity-badge ${r.severity}`}>{r.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Crop: <strong>{r.cropType}</strong> • Stage: {r.stageKey || 'Any'} • Trigger: {r.weatherCondition}
                  </div>
                  <p style={{ fontSize: '0.82rem', marginBottom: '0.4rem' }}>{r.message}</p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    🏛️ Source: <strong>{r.sourceInstitution}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Rule Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Add New ICAR Advisory Rule</h3>
            <form onSubmit={handleCreateRecommendation} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Target Crop</label>
                <select
                  value={newRec.cropType}
                  onChange={(e) => setNewRec({ ...newRec, cropType: e.target.value })}
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Soybean">Soybean</option>
                  <option value="ALL">All Crops</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Growth Stage Key</label>
                <select
                  value={newRec.stageKey}
                  onChange={(e) => setNewRec({ ...newRec, stageKey: e.target.value })}
                >
                  <option value="SOWING">SOWING</option>
                  <option value="GERMINATION">GERMINATION</option>
                  <option value="VEGETATIVE">VEGETATIVE</option>
                  <option value="FLOWERING">FLOWERING</option>
                  <option value="GRAIN_DEVELOPMENT">GRAIN_DEVELOPMENT</option>
                  <option value="MATURITY">MATURITY</option>
                  <option value="HARVEST">HARVEST</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Weather Trigger Condition</label>
                <select
                  value={newRec.weatherCondition}
                  onChange={(e) => setNewRec({ ...newRec, weatherCondition: e.target.value })}
                >
                  <option value="HEAVY_RAIN">HEAVY_RAIN</option>
                  <option value="HIGH_TEMP">HIGH_TEMP</option>
                  <option value="HIGH_HUMIDITY">HIGH_HUMIDITY</option>
                  <option value="DROUGHT_RISK">DROUGHT_RISK</option>
                  <option value="OPTIMAL">OPTIMAL</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Severity</label>
                <select
                  value={newRec.severity}
                  onChange={(e) => setNewRec({ ...newRec, severity: e.target.value })}
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="WARNING">WARNING</option>
                  <option value="ADVISORY">ADVISORY</option>
                  <option value="INFO">INFO</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Advisory Title</label>
                <input
                  type="text"
                  required
                  value={newRec.title}
                  onChange={(e) => setNewRec({ ...newRec, title: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Advisory Message</label>
                <textarea
                  rows="2"
                  required
                  value={newRec.message}
                  onChange={(e) => setNewRec({ ...newRec, message: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Suggested Farmer Action</label>
                <input
                  type="text"
                  required
                  value={newRec.suggestedAction}
                  onChange={(e) => setNewRec({ ...newRec, suggestedAction: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Credible Source Institution</label>
                <input
                  type="text"
                  required
                  value={newRec.sourceInstitution}
                  onChange={(e) => setNewRec({ ...newRec, sourceInstitution: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                <PlusCircle size={16} />
                <span>Save Recommendation Rule</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Marketplace Product Management */}
      {activeTab === 'products' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Add New Input Product to Catalog</h3>
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Product Name</label>
              <input
                type="text"
                required
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                >
                  <option value="FERTILIZERS">Fertilizers & Nutrients</option>
                  <option value="SEEDS">Certified Seeds</option>
                  <option value="SOIL_AMENDMENTS">Soil Amendments</option>
                  <option value="PEST_MANAGEMENT">Pest Management</option>
                  <option value="TOOLS">Tools & Equipment</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Brand / Manufacturer</label>
                <input
                  type="text"
                  required
                  value={newProd.brand}
                  onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Price (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Initial Stock</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProd.stockQuantity}
                  onChange={(e) => setNewProd({ ...newProd, stockQuantity: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Unit</label>
                <input
                  type="text"
                  required
                  value={newProd.unit}
                  onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Suitable Crops (Comma-separated)</label>
              <input
                type="text"
                required
                value={newProd.suitableCrops}
                onChange={(e) => setNewProd({ ...newProd, suitableCrops: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
              <textarea
                rows="2"
                required
                value={newProd.description}
                onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              Publish Product
            </button>
          </form>
        </div>
      )}

      {/* Tab: Customer Orders Management */}
      {activeTab === 'orders' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>All Farmer Input Orders</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem' }}>Items</th>
                  <th style={{ padding: '0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem' }}>Delivery Location</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{o.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user?.phone}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{o.items?.length} items</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{o.totalAmount}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {o.deliveryAddress?.slice(0, 30)}...
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audits' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Administrative Action Audit Trail</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{log.action}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Admin: {log.adminUser?.name} ({log.adminUser?.email}) • Entity: {log.entityType} ({log.entityId})
                </div>
                {log.details && (
                  <div style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: '4px', marginTop: '0.3rem', fontFamily: 'monospace' }}>
                    {log.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
