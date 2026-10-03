import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  CreditCard,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onOrderCompleted }) => {
  const { refreshCart } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Patil Farmhouse, Old Agra Road, Malegaon, Maharashtra - 423203');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('DEMO_CASH_ON_DELIVERY');
  const [notes, setNotes] = useState('Please call upon arrival at the farm gate.');
  const [completedOrder, setCompletedOrder] = useState(null);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCart();
      setCart(res.data?.cart || null);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCompletedOrder(null);
      fetchCart();
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (cartItemId, newQty) => {
    try {
      await api.updateCartItem(cartItemId, newQty);
      await fetchCart();
      await refreshCart();
    } catch (err) {
      alert(err.message || 'Could not update item');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await api.removeFromCart(cartItemId);
      await fetchCart();
      await refreshCart();
    } catch (err) {
      alert(err.message || 'Could not remove item');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!deliveryAddress || !contactPhone) {
      alert('Please fill delivery address and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.checkout({
        deliveryAddress,
        contactPhone,
        paymentMethod,
        notes,
      });
      setCompletedOrder(res.data?.order);
      await refreshCart();
      if (onOrderCompleted) onOrderCompleted(res.data?.order);
    } catch (err) {
      alert(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Farm Inputs Cart</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {completedOrder ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle size={56} color="#15803d" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                Order Confirmed!
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Order Reference: <strong>#{completedOrder.id.slice(0, 8).toUpperCase()}</strong>
                <br />
                Total: <strong>₹{completedOrder.totalAmount}</strong>
              </p>
              <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                <div>📍 <strong>Delivery To:</strong> {completedOrder.deliveryAddress}</div>
                <div>📞 <strong>Contact:</strong> {completedOrder.contactPhone}</div>
                <div>💳 <strong>Payment:</strong> {completedOrder.paymentMethod.replace(/_/g, ' ')}</div>
              </div>
              <button className="btn-primary" onClick={onClose} style={{ margin: '0 auto' }}>
                <span>Continue Farming</span>
              </button>
            </div>
          ) : isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading cart items...
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <h4>Your cart is empty</h4>
              <p style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>
                Browse seeds, fertilizers, and biologicals in the marketplace to add them to your cart.
              </p>
            </div>
          ) : (
            <div>
              {/* Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div style={{ flex: 1, marginRight: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.brand} • ₹{item.price} / {item.unit}
                      </div>
                      {item.isOutOfStock && (
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>
                          ⚠️ Exceeds stock ({item.stockAvailable} available)
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', minWidth: '22px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>

                      <div style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: '65px', textAlign: 'right' }}>
                        ₹{item.subtotal}
                      </div>

                      <button
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', color: '#dc2626' }}
                        onClick={() => handleRemove(item.id)}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <span>Items Total ({cart.itemCount} units)</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                  <span>Delivery to Farm Gate</span>
                  <span>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--primary-dark)' }}>₹{cart.totalAmount}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                    Farm Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter village, farm road, district and pincode"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="DEMO_CASH_ON_DELIVERY">Cash on Delivery (Demo)</option>
                      <option value="DEMO_UPI">Instant UPI (Demo Test)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave near the tractor shed"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}
                  disabled={isSubmitting}
                >
                  <Truck size={18} />
                  <span>{isSubmitting ? 'Placing Order...' : `Confirm & Place Order (₹${cart.totalAmount})`}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
