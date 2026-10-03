import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Trash2,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const FinancialDashboard = () => {
  const { activeCrop } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    category: 'FERTILIZERS',
    amount: '',
    description: '',
    cropId: activeCrop?.id || '',
  });

  const [incomeForm, setIncomeForm] = useState({
    source: 'CROP_SALES',
    amount: '',
    description: '',
    cropId: activeCrop?.id || '',
  });

  const loadFinance = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFinancialSummary();
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, [activeCrop]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.addExpense({
        ...expenseForm,
        amount: Number(expenseForm.amount),
        cropId: activeCrop?.id || undefined,
      });
      setIsExpenseOpen(false);
      setExpenseForm({ category: 'FERTILIZERS', amount: '', description: '', cropId: '' });
      await loadFinance();
    } catch (err) {
      alert(err.message || 'Failed to record expense');
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await api.addIncome({
        ...incomeForm,
        amount: Number(incomeForm.amount),
        cropId: activeCrop?.id || undefined,
      });
      setIsIncomeOpen(false);
      setIncomeForm({ source: 'CROP_SALES', amount: '', description: '', cropId: '' });
      await loadFinance();
    } catch (err) {
      alert(err.message || 'Failed to record income');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.deleteExpense(id);
      await loadFinance();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!confirm('Are you sure you want to delete this income record?')) return;
    try {
      await api.deleteIncome(id);
      await loadFinance();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading financial analytics...
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    netIncome = 0,
    isProfitable = true,
    categoryBreakdown = [],
    monthlyTrends = [],
    recentExpenses = [],
    recentIncomes = [],
  } = summary || {};

  // Maximum value for bar charts scaling
  const maxMonthlyVal = Math.max(
    ...monthlyTrends.map((m) => Math.max(m.income, m.expenses)),
    1000
  );

  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* Top Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>💰 Farm Financial Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track input costs, operational labour, crop harvest sales, and net farm profit
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={() => setIsExpenseOpen(true)}>
            <PlusCircle size={16} color="#dc2626" />
            <span>Add Expense</span>
          </button>
          <button className="btn-primary" onClick={() => setIsIncomeOpen(true)}>
            <PlusCircle size={16} />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Trio */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Farm Income</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={18} color="#15803d" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d' }}>
            ₹{totalIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Crop sales & government subsidies
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Farm Expenses</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={18} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626' }}>
            ₹{totalExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Seeds, fertilizers, labour, irrigation
          </div>
        </div>

        <div className="card" style={{ borderLeft: `4px solid ${isProfitable ? '#15803d' : '#ea580c'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Net Farm Income</span>
            <span className="tag-pill active" style={{ fontSize: '0.7rem' }}>
              {isProfitable ? 'Profitable' : 'Deficit'}
            </span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: isProfitable ? '#15803d' : '#ea580c' }}>
            ₹{netIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Net operational balance
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Category Breakdown Chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={18} color="#15803d" />
            <h3 style={{ fontSize: '1.1rem' }}>Expense Breakdown by Category</h3>
          </div>

          {categoryBreakdown.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No expenses recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{cat.category}</span>
                    <span>
                      ₹{cat.amount.toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${cat.percentage}%`,
                        backgroundColor: '#15803d',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Income vs Expense Bars */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={18} color="#0284c7" />
            <h3 style={{ fontSize: '1.1rem' }}>Monthly Financial Trends</h3>
          </div>

          {monthlyTrends.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No transactions recorded for trend analysis.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {monthlyTrends.map((m) => {
                const incPct = Math.round((m.income / maxMonthlyVal) * 100);
                const expPct = Math.round((m.expenses / maxMonthlyVal) * 100);

                return (
                  <div key={m.month}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      Month: {m.month}
                    </div>
                    {/* Income Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', width: '60px', color: '#16a34a', fontWeight: 600 }}>Income</span>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${incPct}%`, backgroundColor: '#16a34a' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '65px', textAlign: 'right' }}>
                        ₹{m.income.toLocaleString()}
                      </span>
                    </div>

                    {/* Expense Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', width: '60px', color: '#dc2626', fontWeight: 600 }}>Expense</span>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${expPct}%`, backgroundColor: '#dc2626' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '65px', textAlign: 'right' }}>
                        ₹{m.expenses.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Expenses List */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#dc2626' }}>
            Recent Farm Expenses
          </h3>
          {recentExpenses.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No expenses recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentExpenses.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fff',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{e.category}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {e.description || 'Routine expense'} • {new Date(e.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>
                      -₹{e.amount.toLocaleString()}
                    </span>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: '#94a3b8' }}
                      onClick={() => handleDeleteExpense(e.id)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incomes List */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#15803d' }}>
            Recent Farm Incomes
          </h3>
          {recentIncomes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No income recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentIncomes.map((i) => (
                <div
                  key={i.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fff',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{i.source.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {i.description || 'Harvest sale'} • {new Date(i.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>
                      +₹{i.amount.toLocaleString()}
                    </span>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: '#94a3b8' }}
                      onClick={() => handleDeleteIncome(i.id)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseOpen && (
        <div className="modal-overlay" onClick={() => setIsExpenseOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Record Farm Expense</h3>
              <button className="btn-icon" onClick={() => setIsExpenseOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                >
                  <option value="SEEDS">Seeds</option>
                  <option value="FERTILIZERS">Fertilizers & Nutrients</option>
                  <option value="LABOUR">Field Labour & Tractor</option>
                  <option value="IRRIGATION">Irrigation & Power</option>
                  <option value="TRANSPORTATION">Transport & Logistics</option>
                  <option value="EQUIPMENT">Tools & Equipment</option>
                  <option value="OTHER">Other Expense</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 2500"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Description</label>
                <input
                  type="text"
                  placeholder="e.g. 2 bags of DAP basal dose"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {isIncomeOpen && (
        <div className="modal-overlay" onClick={() => setIsIncomeOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Record Farm Income</h3>
              <button className="btn-icon" onClick={() => setIsIncomeOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddIncome} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Income Source</label>
                <select
                  value={incomeForm.source}
                  onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                >
                  <option value="CROP_SALES">Crop Sales at Mandi / APMC</option>
                  <option value="SUBSIDY">Government PM-KISAN / Subsidy</option>
                  <option value="LEASE">Land or Equipment Lease</option>
                  <option value="OTHER">Other Income</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 45000"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10 quintals sold at Mandi yard"
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                Save Income
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
