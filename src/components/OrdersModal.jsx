import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  X,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';

export const OrdersModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api
        .getUserOrders()
        .then((res) => setOrders(res.data?.orders || []))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return { bg: '#dcfce7', text: '#15803d' };
      case 'SHIPPED': return { bg: '#e0f2fe', text: '#0284c7' };
      case 'PROCESSING': return { bg: '#fef3c7', text: '#b45309' };
      case 'CANCELLED': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Orders History</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <Package size={48} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <h4>No orders placed yet</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '0.25rem' }}>
                Purchased seeds, fertilizers and amendments will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => {
                const colors = getStatusColor(order.status);
                const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={order.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          <Calendar size={13} />
                          <span>{orderDate}</span>
                        </div>
                      </div>

                      <span
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.75rem' }}>
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.85rem',
                            marginBottom: '0.25rem',
                          }}
                        >
                          <span>
                            {item.productName} <strong>× {item.quantity}</strong>
                          </span>
                          <span style={{ fontWeight: 600 }}>₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Delivery: {order.deliveryAddress?.split(',')?.[0]}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                        Total: ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
