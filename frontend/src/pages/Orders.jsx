import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { tokens, font } from '../styles';

const API = "http://127.0.0.1:8000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// ─── Status config ────────────────────────────────────────────────────────────
// STATUS_MAP used only for progress tracker ordering
const STATUS_MAP = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

// Map backend status values to display labels
function getStatus(order) {
  const raw = (order.status || '').toLowerCase();
  if (raw === 'paid' || raw === 'delivered') return 'Delivered';
  if (raw === 'shipped') return 'Shipped';
  if (raw === 'confirmed') return 'Confirmed';
  return 'Processing';
}

const STATUS_STYLE = {
  Processing: { bg: '#F5F5F5', color: '#888', dot: '#AAAAAA' },
  Confirmed:  { bg: '#EBF1FF', color: '#1D3557', dot: '#4A7FBF' },
  Shipped:    { bg: '#EAF6F0', color: '#1A5C3A', dot: '#2C9E62' },
  Delivered:  { bg: tokens.black, color: tokens.white, dot: tokens.white },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Processing;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      backgroundColor: s.bg, color: s.color,
      padding: '5px 12px',
      fontFamily: font, fontSize: '10px', letterSpacing: '1.5px',
      textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ─── Progress Tracker ─────────────────────────────────────────────────────────
function ProgressTracker({ status }) {
  const currentIndex = STATUS_MAP.indexOf(status);
  return (
    <div style={{ padding: '32px', backgroundColor: tokens.offwhite, marginBottom: '40px' }}>
      <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '28px' }}>
        Order Progress
      </p>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
        {/* Connector line */}
        <div style={{
          position: 'absolute', top: '11px', left: '12px',
          right: '12px', height: '1px', backgroundColor: tokens.gray200, zIndex: 0,
        }} />
        {/* Filled progress line */}
        <div style={{
          position: 'absolute', top: '11px', left: '12px',
          width: currentIndex === 0 ? '0%' : `${(currentIndex / (STATUS_MAP.length - 1)) * 100}%`,
          height: '1px', backgroundColor: tokens.black, zIndex: 1,
          transition: 'width 0.6s ease',
        }} />

        {STATUS_MAP.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: done || active ? tokens.black : tokens.white,
                border: `2px solid ${done || active ? tokens.black : tokens.gray200}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                {done && <span style={{ color: tokens.white, fontSize: '11px', lineHeight: 1, fontWeight: 700 }}>✓</span>}
                {active && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tokens.white, display: 'block' }} />}
              </div>
              <p style={{
                fontFamily: font, fontSize: '9px', letterSpacing: '1.5px',
                textTransform: 'uppercase', marginTop: '10px', textAlign: 'center',
                color: done || active ? tokens.black : tokens.gray400,
                fontWeight: active ? 700 : 400,
              }}>
                {s}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onBack }) {
  return (
    <div style={{ padding: '100px 24px', textAlign: 'center' }}>
      <div style={{ marginBottom: '24px', fontSize: '48px', lineHeight: 1 }}>∅</div>
      <p style={{
        fontFamily: font, fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '-1px', color: tokens.gray200,
        margin: '0 0 12px',
      }}>
        No Orders Yet
      </p>
      <p style={{ fontFamily: font, fontSize: '13px', color: tokens.gray400, marginBottom: '36px' }}>
        Your purchase history will appear here.
      </p>
      <button
        onClick={onBack}
        style={{
          fontFamily: font, fontSize: '11px', letterSpacing: '2px',
          textTransform: 'uppercase', background: 'none', border: `1px solid ${tokens.black}`,
          padding: '0 40px', height: '48px', cursor: 'pointer', color: tokens.black,
        }}
      >
        Explore Collection
      </button>
    </div>
  );
}

// ─── Order Detail View ────────────────────────────────────────────────────────
function OrderDetail({ order, onBack, isLoggedIn, cartCount, onSignIn, onLogout, onOrders, onLogoClick }) {
  const status = getStatus(order);
  const price = order.price_at_purchase ?? order.price ?? 0;
  const total = price * (order.quantity || 1);
  const date = order.date || order.timestamp || '';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.white, fontFamily: font }}>
      <Navbar
        isLoggedIn={isLoggedIn} cartCount={cartCount || 0}
        onLogoClick={onLogoClick} onSignIn={onSignIn} onLogout={onLogout}
        onCartOpen={() => {}} onOrders={onOrders}
      />

      {/* Breadcrumb */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${tokens.gray100}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onBack}
          style={{ fontFamily: font, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: tokens.gray600, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        >
          ← Orders
        </button>
        <span style={{ color: tokens.gray300 }}>·</span>
        <span style={{ fontFamily: font, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: tokens.gray400 }}>
          #{String(order.id).padStart(4, '0')}
        </span>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '10px' }}>
              Order
            </p>
            <h1 style={{ fontFamily: font, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-1.5px', color: tokens.black, margin: '0 0 10px', lineHeight: 0.95 }}>
              #{String(order.id).padStart(4, '0')}
            </h1>
            <p style={{ fontFamily: font, fontSize: '12px', color: tokens.gray400 }}>
              Placed {date.split(' ')[0] || date}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '10px' }}>Status</p>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Progress */}
        <ProgressTracker status={status} />

        {/* Item card */}
        <div style={{ border: `1px solid ${tokens.gray200}`, marginBottom: '32px' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px', padding: '12px 24px', backgroundColor: tokens.offwhite, borderBottom: `1px solid ${tokens.gray200}` }}>
            <span style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400 }}>Product</span>
            <span style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400 }}>Qty</span>
            <span style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, textAlign: 'right' }}>Amount</span>
          </div>

          {/* Item row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px', padding: '24px', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: font, fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px', color: tokens.black }}>
                {order.product_name}
              </p>
              <p style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, margin: '0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                SKU-{String(order.product_id || order.id).padStart(6, '0')}
              </p>
            </div>
            <span style={{ fontFamily: font, fontSize: '13px', color: tokens.gray600 }}>
              × {order.quantity || 1}
            </span>
            <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 700, textAlign: 'right', color: tokens.black }}>
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Summary + info — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px', alignItems: 'start' }}>

          {/* Shipping info (left) */}
          <div style={{ border: `1px solid ${tokens.gray200}`, padding: '24px' }}>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '16px' }}>
              Delivery Info
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Method', value: 'Standard Delivery' },
                { label: 'Est. delivery', value: '5–7 business days' },
                { label: 'Tracking', value: status === 'Delivered' || status === 'Shipped' ? `ATL-${String(order.id).padStart(8, '0')}` : 'Available after dispatch' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontFamily: font, fontSize: '11px', color: tokens.black, textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown (right) */}
          <div style={{ backgroundColor: tokens.offwhite, padding: '24px' }}>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '16px' }}>
              Summary
            </p>
            {[
              { label: 'Subtotal', value: `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Shipping', value: total >= 500 ? 'Free' : '$50.00' },
              { label: 'Tax', value: '$0.00' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontFamily: font, fontSize: '11px', color: tokens.gray600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{row.label}</span>
                <span style={{ fontFamily: font, fontSize: '11px' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${tokens.gray200}`, paddingTop: '14px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: font, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total</span>
              <span style={{ fontFamily: font, fontSize: '16px', fontWeight: 700 }}>
                ${(total + (total >= 500 ? 0 : 50)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Need help */}
        <div style={{ marginTop: '40px', padding: '20px 24px', border: `1px solid ${tokens.gray100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontFamily: font, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>Need Help?</p>
            <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, margin: 0 }}>Our client services team is here for you.</p>
          </div>
          <a
            href="mailto:service@atelier.com"
            style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: tokens.black, textDecoration: 'underline', textDecorationColor: tokens.gray300 }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Orders Component ────────────────────────────────────────────────────
export default function Orders({ onBack, isLoggedIn, onSignIn, onLogout, onOrders, onLogoClick, cartCount }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get(`${API}/orders`, { headers: authHeader() })
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError("Unable to load orders."); setLoading(false); });
  }, []);

  const totalSpent = orders.reduce((sum, o) => {
    const price = o.price_at_purchase ?? o.price ?? 0;
    return sum + price * (o.quantity || 1);
  }, 0);

  const allStatuses = ['All', ...STATUS_MAP];
  const filtered = filter === 'All' ? orders : orders.filter(o => getStatus(o) === filter);

  // Show detail view
  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        onSignIn={onSignIn}
        onLogout={onLogout}
        onOrders={onOrders}
        onLogoClick={onLogoClick || onBack}
      />
    );
  }

  const cellLabel = {
    fontFamily: font, fontSize: '9px', letterSpacing: '2px',
    textTransform: 'uppercase', color: tokens.gray400,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.white, fontFamily: font }}>
      <Navbar
        isLoggedIn={isLoggedIn} cartCount={cartCount || 0}
        onLogoClick={onLogoClick || onBack} onSignIn={onSignIn} onLogout={onLogout}
        onCartOpen={() => {}} onOrders={onOrders}
      />

      {/* Page header */}
      <div style={{ padding: '56px 24px 40px', borderBottom: `1px solid ${tokens.gray200}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '14px' }}>
            Purchase History
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <h1 style={{
              fontFamily: font, fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700,
              color: tokens.black, textTransform: 'uppercase', letterSpacing: '-2px',
              lineHeight: 0.9, margin: 0,
            }}>
              YOUR<br />ARCHIVE
            </h1>

            {!loading && orders.length > 0 && (
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ ...cellLabel, marginBottom: '6px' }}>Total Orders</p>
                  <p style={{ fontFamily: font, fontSize: '28px', fontWeight: 700, margin: 0, color: tokens.black }}>
                    {orders.length}
                  </p>
                </div>
                <div style={{ width: '1px', backgroundColor: tokens.gray200 }} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ ...cellLabel, marginBottom: '6px' }}>Total Invested</p>
                  <p style={{ fontFamily: font, fontSize: '28px', fontWeight: 700, margin: 0, color: tokens.black }}>
                    ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      {!loading && orders.length > 0 && (
        <div style={{ borderBottom: `1px solid ${tokens.gray200}`, padding: '0 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0' }}>
            {allStatuses.map(s => {
              const count = s === 'All' ? orders.length : orders.filter(o => getStatus(o) === s).length;
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    fontFamily: font, fontSize: '10px', letterSpacing: '1.5px',
                    textTransform: 'uppercase', background: 'none', border: 'none',
                    borderBottom: `2px solid ${active ? tokens.black : 'transparent'}`,
                    color: active ? tokens.black : tokens.gray400,
                    padding: '16px 20px', cursor: 'pointer',
                    fontWeight: active ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                  {count > 0 && (
                    <span style={{
                      marginLeft: '6px', fontSize: '9px',
                      backgroundColor: active ? tokens.black : tokens.gray200,
                      color: active ? tokens.white : tokens.gray600,
                      padding: '2px 6px',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {loading && (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '3px', color: tokens.gray300, textTransform: 'uppercase' }}>
              Loading archive…
            </p>
          </div>
        )}

        {error && (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: font, fontSize: '13px', color: tokens.gray600 }}>{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && <EmptyState onBack={onBack} />}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 160px 120px 48px',
              padding: '12px 24px',
              borderBottom: `1px solid ${tokens.gray200}`,
              backgroundColor: tokens.offwhite,
            }}>
              {['Order', 'Product', 'Qty', 'Status', 'Amount', ''].map(h => (
                <span key={h} style={cellLabel}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <p style={{ fontFamily: font, fontSize: '12px', color: tokens.gray400 }}>No {filter.toLowerCase()} orders.</p>
              </div>
            ) : (
              filtered.map((order, idx) => {
                const status = getStatus(order);
                const price = order.price_at_purchase ?? order.price ?? 0;
                const lineTotal = price * (order.quantity || 1);
                const date = (order.date || order.timestamp || '').split(' ')[0];

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 100px 160px 120px 48px',
                      padding: '22px 24px',
                      borderBottom: `1px solid ${tokens.gray100}`,
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = tokens.offwhite}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Order # */}
                    <span style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                      #{String(order.id).padStart(4, '0')}
                    </span>

                    {/* Product */}
                    <div>
                      <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', margin: '0 0 3px', color: tokens.black }}>
                        {order.product_name}
                      </p>
                      <p style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, margin: 0, letterSpacing: '0.5px' }}>
                        {date}
                      </p>
                    </div>

                    {/* Qty */}
                    <span style={{ fontFamily: font, fontSize: '12px', color: tokens.gray600 }}>
                      × {order.quantity || 1}
                    </span>

                    {/* Status */}
                    <div>
                      <StatusBadge status={status} />
                    </div>

                    {/* Amount */}
                    <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: tokens.black }}>
                      ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>

                    {/* Arrow */}
                    <span style={{ fontFamily: font, fontSize: '18px', color: tokens.gray300, textAlign: 'right' }}>›</span>
                  </div>
                );
              })
            )}

            {/* Footer total */}
            {filtered.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 24px', borderTop: `1px solid ${tokens.gray200}` }}>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                  <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: tokens.gray400 }}>
                    {filtered.length} order{filtered.length !== 1 ? 's' : ''}
                  </span>
                  <div style={{ width: '1px', height: '20px', backgroundColor: tokens.gray200 }} />
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '4px' }}>Total invested</p>
                    <p style={{ fontFamily: font, fontSize: '18px', fontWeight: 700, margin: 0, color: tokens.black }}>
                      ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
