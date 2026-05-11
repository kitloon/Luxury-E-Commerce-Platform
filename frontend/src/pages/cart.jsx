import React, { useState } from 'react';
import { tokens, font } from '../styles';

// ─── Reusable field components ────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '', required = false, half = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ width: half ? 'calc(50% - 8px)' : '100%', marginBottom: '28px' }}>
      <label style={{
        display: 'block', fontFamily: font, fontSize: '9px',
        letterSpacing: '2px', textTransform: 'uppercase',
        color: focused ? tokens.black : tokens.gray400,
        marginBottom: '8px', transition: 'color 0.2s',
      }}>
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: '44px', border: 'none',
          borderBottom: `1px solid ${focused ? tokens.black : tokens.gray200}`,
          outline: 'none', fontSize: '13px', backgroundColor: 'transparent',
          fontFamily: font, color: tokens.black, boxSizing: 'border-box',
          letterSpacing: '0.3px', borderRadius: 0, transition: 'border-color 0.2s',
          padding: '0',
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ width: '100%', marginBottom: '28px' }}>
      <label style={{
        display: 'block', fontFamily: font, fontSize: '9px',
        letterSpacing: '2px', textTransform: 'uppercase',
        color: focused ? tokens.black : tokens.gray400, marginBottom: '8px', transition: 'color 0.2s',
      }}>
        {label}{required && ' *'}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: '44px', border: 'none',
          borderBottom: `1px solid ${focused ? tokens.black : tokens.gray200}`,
          outline: 'none', fontSize: '13px', backgroundColor: 'transparent',
          fontFamily: font, color: value ? tokens.black : tokens.gray400,
          boxSizing: 'border-box', letterSpacing: '0.3px', borderRadius: 0,
          cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23333'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center',
          transition: 'border-color 0.2s', padding: '0',
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Order Summary sidebar (shared across steps 2-4) ─────────────────────────
function OrderSummary({ cart, subtotal, shipping, total, step }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ backgroundColor: tokens.offwhite, padding: '32px' }}>
      {/* Toggle on mobile feel */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '20px' }}
      >
        <span style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray600 }}>
          ORDER SUMMARY ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </span>
        <span style={{ fontFamily: font, fontSize: '16px', color: tokens.black, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>∧</span>
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid ${tokens.gray200}`, paddingTop: '20px', marginBottom: '20px' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '72px', backgroundColor: tokens.gray100, flexShrink: 0, position: 'relative' }}>
                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: tokens.gray400, color: tokens.white,
                  fontSize: '9px', fontFamily: font, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>{item.quantity}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 2px', letterSpacing: '0.5px' }}>{item.name}</p>
                <p style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, margin: 0 }}>{item.category}</p>
              </div>
              <span style={{ fontFamily: font, fontSize: '12px', fontWeight: 700 }}>${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: `1px solid ${tokens.gray200}`, paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontFamily: font, fontSize: '12px', color: tokens.gray600 }}>Subtotal</span>
          <span style={{ fontFamily: font, fontSize: '12px' }}>${subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontFamily: font, fontSize: '12px', color: tokens.gray600 }}>Shipping</span>
          <span style={{ fontFamily: font, fontSize: '12px', color: shipping === 0 && step >= 3 ? '#2D7A2D' : tokens.black }}>
            {step < 3 ? '—' : shipping === 0 ? 'COMPLIMENTARY' : `$${shipping}`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${tokens.gray200}`, paddingTop: '20px' }}>
          <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total</span>
          <span style={{ fontFamily: font, fontSize: '18px', fontWeight: 700 }}>${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Breadcrumb navigation ────────────────────────────────────────────────────
function Breadcrumb({ step, onBack, onGoStep }) {
  const crumbs = ['Cart', 'Information', 'Shipping', 'Payment'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '48px', flexWrap: 'wrap' }}>
      {crumbs.map((c, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isPast = stepNum < step;
        return (
          <React.Fragment key={c}>
            <span
              onClick={() => isPast && onGoStep(stepNum)}
              style={{
                fontFamily: font, fontSize: '10px', letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: isActive ? tokens.black : isPast ? tokens.gray600 : tokens.gray400,
                fontWeight: isActive ? 700 : 400,
                cursor: isPast ? 'pointer' : 'default',
                textDecoration: isPast ? 'underline' : 'none',
                textDecorationColor: tokens.gray400,
              }}
            >
              {c}
            </span>
            {i < crumbs.length - 1 && (
              <span style={{ fontFamily: font, fontSize: '9px', color: tokens.gray400 }}>›</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Validation helpers ───────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^\+?[\d\s\-()]{7,}$/.test(phone);
}

// ─── Main Cart Component ──────────────────────────────────────────────────────
export default function Cart({ cart, onBack, onIncrement, onDecrement, onRemove, onCheckout }) {
  const [step, setStep] = useState(1);

  // ── Information form state ──
  const [info, setInfo] = useState({
    email: '', firstName: '', lastName: '', phone: '',
    address: '', apt: '', city: '', state: '', postcode: '', country: 'MY',
    saveInfo: false,
  });

  // ── Shipping state ──
  const SHIPPING_OPTIONS = [
    { id: 'standard', label: 'Standard Delivery', desc: '5–7 business days', price: 50 },
    { id: 'express', label: 'Express Delivery', desc: '2–3 business days', price: 120 },
    { id: 'overnight', label: 'Overnight Delivery', desc: 'Next business day', price: 250 },
  ];
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const freeShippingThreshold = 500;
  const qualifiesFreeShipping = subtotal > freeShippingThreshold;

  const [selectedShipping, setSelectedShipping] = useState('standard');

  // ── Payment state ──
  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    billingDiff: false,
  });
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'applepay'

  // ── Errors ──
  const [errors, setErrors] = useState({});

  const shippingCost = qualifiesFreeShipping ? 0 : (SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.price || 50);
  const total = subtotal + shippingCost;

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const goStep = (n) => { if (n < step) setStep(n); };

  // ── Decrement with confirm ──
  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      if (window.confirm(`Remove ${item.name} from bag?`)) onRemove(item.id);
    } else {
      onDecrement(item.id);
    }
  };

  // ── Step 2 validation ──
  const validateInfo = () => {
    const e = {};
    if (!info.email) e.email = 'Required';
    else if (!validateEmail(info.email)) e.email = 'Invalid email';
    if (!info.firstName) e.firstName = 'Required';
    if (!info.lastName) e.lastName = 'Required';
    if (!info.phone) e.phone = 'Required';
    else if (!validatePhone(info.phone)) e.phone = 'Invalid phone number';
    if (!info.address) e.address = 'Required';
    if (!info.city) e.city = 'Required';
    if (!info.postcode) e.postcode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Step 4 validation ──
  const validatePayment = () => {
    if (paymentMethod !== 'card') return true;
    const e = {};
    if (!payment.cardName) e.cardName = 'Required';
    if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Invalid card number';
    if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = 'Invalid (MM/YY)';
    if (!payment.cvv || payment.cvv.length < 3) e.cvv = 'Invalid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinueInfo = () => {
    if (validateInfo()) nextStep();
  };

  const handleContinuePayment = () => {
    if (validatePayment()) onCheckout();
  };

  // ── Format card number with spaces ──
  const formatCardNumber = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(.{4})/g, '$1 ').trim();
  };

  // ── Format expiry MM/YY ──
  const formatExpiry = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) return raw.slice(0, 2) + '/' + raw.slice(2);
    return raw;
  };

  const COUNTRIES = [
    { value: '', label: 'Select country', disabled: true },
    { value: 'MY', label: 'Malaysia' },
    { value: 'SG', label: 'Singapore' },
    { value: 'AU', label: 'Australia' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'US', label: 'United States' },
    { value: 'JP', label: 'Japan' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'IT', label: 'Italy' },
    { value: 'AE', label: 'United Arab Emirates' },
  ];

  // ── Common button style ──
  const primaryBtn = {
    width: '100%', height: '56px', backgroundColor: tokens.black,
    color: tokens.white, border: 'none', fontFamily: font, fontSize: '11px',
    letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700,
    cursor: 'pointer', marginTop: '32px',
  };
  const ghostBtn = {
    background: 'none', border: 'none', fontFamily: font, fontSize: '11px',
    letterSpacing: '1px', textTransform: 'uppercase', color: tokens.gray600,
    cursor: 'pointer', marginTop: '16px', textDecoration: 'underline',
    textDecorationColor: tokens.gray200,
  };

  const errStyle = {
    fontFamily: font, fontSize: '10px', color: '#C0392B',
    letterSpacing: '0.5px', marginTop: '-20px', marginBottom: '16px', display: 'block',
  };

  return (
    <div style={{ backgroundColor: tokens.white, minHeight: '100vh', color: tokens.black, paddingTop: '60px', paddingBottom: '80px' }}>

      {/* ── Step 1: Bag ── */}
      {step === 1 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '80px' }}>
            {['CART', 'INFORMATION', 'SHIPPING', 'PAYMENT'].map((label, i) => (
              <div key={label} style={{ position: 'relative', paddingBottom: '10px' }}>
                <span style={{
                  fontFamily: font, fontSize: '10px', letterSpacing: '2px',
                  fontWeight: step === i + 1 ? 700 : 400,
                  color: step === i + 1 ? tokens.black : tokens.gray400,
                }}>
                  0{i + 1} {label}
                </span>
                {step === i + 1 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1.5px', backgroundColor: tokens.black }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '100px' }}>
            <div>
              <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '60px', textTransform: 'uppercase', fontFamily: font }}>Your Bag</h1>
              {cart.length === 0 ? (
                <div style={{ padding: '40px 0' }}>
                  <p style={{ color: tokens.gray400, fontFamily: font }}>Your bag is empty.</p>
                  <button onClick={onBack} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', marginTop: '20px', fontFamily: font }}>
                    Return to Shop
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '32px', paddingBottom: '40px', borderBottom: `1px solid ${tokens.gray100}`, marginBottom: '40px' }}>
                    <div style={{ width: '140px', height: '180px', backgroundColor: tokens.offwhite, flexShrink: 0 }}>
                      <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', margin: 0, fontFamily: font }}>{item.name}</h3>
                          <p style={{ fontSize: '11px', color: tokens.gray400, margin: '4px 0 0', fontFamily: font }}>{item.category || 'Product'}</p>
                        </div>
                        <span style={{ fontWeight: 700, fontFamily: font }}>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${tokens.gray200}` }}>
                          <button onClick={() => handleDecrement(item)} style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: font, fontSize: '16px' }}>−</button>
                          <span style={{ fontSize: '12px', width: '30px', textAlign: 'center', fontFamily: font }}>{item.quantity}</span>
                          <button onClick={() => onIncrement(item.id)} style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: font, fontSize: '16px' }}>+</button>
                        </div>
                        <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', fontSize: '10px', textDecoration: 'underline', cursor: 'pointer', color: tokens.gray400, fontFamily: font, letterSpacing: '1px' }}>
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
              <div style={{ backgroundColor: tokens.offwhite, padding: '40px' }}>
                <h2 style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '30px', fontFamily: font, textTransform: 'uppercase' }}>SUMMARY</h2>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: font, fontSize: '12px', color: tokens.gray600 }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontFamily: font, fontSize: '12px' }}>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {subtotal > 0 && (
                  <p style={{ fontFamily: font, fontSize: '10px', color: qualifiesFreeShipping ? '#2D7A2D' : tokens.gray400, marginTop: '12px', letterSpacing: '0.5px' }}>
                    {qualifiesFreeShipping ? '✓ Complimentary shipping included' : `Add $${(freeShippingThreshold - subtotal).toLocaleString()} more for free shipping`}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${tokens.gray200}`, paddingTop: '24px', marginTop: '16px', marginBottom: '40px' }}>
                  <span style={{ fontWeight: 700, fontFamily: font, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>SUBTOTAL</span>
                  <span style={{ fontWeight: 700, fontSize: '20px', fontFamily: font }}>${subtotal.toLocaleString()}</span>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={nextStep}
                  style={{ ...primaryBtn, marginTop: 0, opacity: cart.length === 0 ? 0.3 : 1 }}
                >
                  CONTINUE TO INFORMATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Information ── */}
      {step === 2 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <Breadcrumb step={step} onGoStep={goStep} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '80px' }}>
            <div>
              {/* Contact */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: font, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px', color: tokens.gray600, fontWeight: 400 }}>
                  01 — CONTACT
                </h2>
                <Field label="Email" value={info.email} onChange={v => setInfo(p => ({ ...p, email: v }))} type="email" required placeholder="your@email.com" />
                {errors.email && <span style={errStyle}>{errors.email}</span>}
                <Field label="Phone" value={info.phone} onChange={v => setInfo(p => ({ ...p, phone: v }))} type="tel" required placeholder="+60 12 345 6789" />
                {errors.phone && <span style={errStyle}>{errors.phone}</span>}
              </div>

              {/* Shipping Address */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: font, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px', color: tokens.gray600, fontWeight: 400 }}>
                  02 — SHIPPING ADDRESS
                </h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ width: 'calc(50% - 8px)' }}>
                    <Field label="First Name" value={info.firstName} onChange={v => setInfo(p => ({ ...p, firstName: v }))} required />
                    {errors.firstName && <span style={errStyle}>{errors.firstName}</span>}
                  </div>
                  <div style={{ width: 'calc(50% - 8px)' }}>
                    <Field label="Last Name" value={info.lastName} onChange={v => setInfo(p => ({ ...p, lastName: v }))} required />
                    {errors.lastName && <span style={errStyle}>{errors.lastName}</span>}
                  </div>
                </div>

                <Field label="Address" value={info.address} onChange={v => setInfo(p => ({ ...p, address: v }))} required placeholder="Street address" />
                {errors.address && <span style={errStyle}>{errors.address}</span>}

                <Field label="Apartment / Suite / Unit (optional)" value={info.apt} onChange={v => setInfo(p => ({ ...p, apt: v }))} placeholder="Apt, suite, etc." />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ width: 'calc(50% - 8px)' }}>
                    <Field label="City" value={info.city} onChange={v => setInfo(p => ({ ...p, city: v }))} required />
                    {errors.city && <span style={errStyle}>{errors.city}</span>}
                  </div>
                  <div style={{ width: 'calc(50% - 8px)' }}>
                    <Field label="Postcode" value={info.postcode} onChange={v => setInfo(p => ({ ...p, postcode: v }))} required />
                    {errors.postcode && <span style={errStyle}>{errors.postcode}</span>}
                  </div>
                </div>

                <Select
                  label="Country"
                  value={info.country}
                  onChange={v => setInfo(p => ({ ...p, country: v }))}
                  options={COUNTRIES}
                  required
                />
              </div>

              {/* Save info checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '40px' }}>
                <div
                  onClick={() => setInfo(p => ({ ...p, saveInfo: !p.saveInfo }))}
                  style={{
                    width: '18px', height: '18px', border: `1px solid ${info.saveInfo ? tokens.black : tokens.gray300}`,
                    backgroundColor: info.saveInfo ? tokens.black : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                  }}
                >
                  {info.saveInfo && <span style={{ color: tokens.white, fontSize: '11px', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontFamily: font, fontSize: '11px', color: tokens.gray600, letterSpacing: '0.3px' }}>
                  Save my information for a faster checkout next time
                </span>
              </label>

              <button onClick={handleContinueInfo} style={primaryBtn}>CONTINUE TO SHIPPING</button>
              <div style={{ textAlign: 'center' }}>
                <button onClick={prevStep} style={ghostBtn}>← Return to cart</button>
              </div>
            </div>

            {/* Summary */}
            <div style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
              <OrderSummary cart={cart} subtotal={subtotal} shipping={shippingCost} total={total} step={step} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Shipping ── */}
      {step === 3 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <Breadcrumb step={step} onGoStep={goStep} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '80px' }}>
            <div>
              {/* Contact & Address recap */}
              <div style={{ border: `1px solid ${tokens.gray200}`, padding: '20px 24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray400, textTransform: 'uppercase', width: '64px' }}>Contact</span>
                      <span style={{ fontFamily: font, fontSize: '12px', color: tokens.black }}>{info.email}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray400, textTransform: 'uppercase', width: '64px' }}>Ship to</span>
                      <span style={{ fontFamily: font, fontSize: '12px', color: tokens.black }}>
                        {info.address}{info.apt ? `, ${info.apt}` : ''}, {info.city} {info.postcode}, {COUNTRIES.find(c => c.value === info.country)?.label || info.country}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} style={{ ...ghostBtn, marginTop: 0, fontSize: '10px' }}>Change</button>
                </div>
              </div>

              <h2 style={{ fontFamily: font, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px', color: tokens.gray600, fontWeight: 400 }}>
                SHIPPING METHOD
              </h2>

              {qualifiesFreeShipping && (
                <div style={{ backgroundColor: '#F0F7F0', border: '1px solid #C3E0C3', padding: '14px 20px', marginBottom: '24px' }}>
                  <p style={{ fontFamily: font, fontSize: '11px', color: '#2D7A2D', letterSpacing: '0.5px', margin: 0 }}>
                    ✓ Your order qualifies for complimentary shipping
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {SHIPPING_OPTIONS.map(opt => {
                  const effectivePrice = qualifiesFreeShipping && opt.id === 'standard' ? 0 : opt.price;
                  const isSelected = selectedShipping === opt.id;
                  return (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '20px 24px', cursor: 'pointer',
                        border: `1px solid ${isSelected ? tokens.black : tokens.gray200}`,
                        backgroundColor: isSelected ? tokens.offwhite : tokens.white,
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: `1.5px solid ${isSelected ? tokens.black : tokens.gray300}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tokens.black }} />}
                        </div>
                        <div>
                          <p style={{ fontFamily: font, fontSize: '12px', fontWeight: isSelected ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>{opt.label}</p>
                          <p style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, margin: 0, letterSpacing: '0.5px' }}>{opt.desc}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {qualifiesFreeShipping && opt.id === 'standard'
                          ? <span style={{ fontFamily: font, fontSize: '11px', fontWeight: 700, color: '#2D7A2D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FREE</span>
                          : <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 700 }}>${opt.price}</span>
                        }
                      </div>
                      <input type="radio" name="shipping" value={opt.id} checked={isSelected} onChange={() => setSelectedShipping(opt.id)} style={{ display: 'none' }} />
                    </label>
                  );
                })}
              </div>

              <button onClick={nextStep} style={primaryBtn}>CONTINUE TO PAYMENT</button>
              <div style={{ textAlign: 'center' }}>
                <button onClick={prevStep} style={ghostBtn}>← Return to information</button>
              </div>
            </div>

            {/* Summary */}
            <div style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
              <OrderSummary cart={cart} subtotal={subtotal} shipping={shippingCost} total={total} step={step} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Payment ── */}
      {step === 4 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <Breadcrumb step={step} onGoStep={goStep} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '80px' }}>
            <div>
              {/* Recap bar */}
              <div style={{ border: `1px solid ${tokens.gray200}`, padding: '20px 24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray400, textTransform: 'uppercase', width: '64px', flexShrink: 0 }}>Contact</span>
                    <span style={{ fontFamily: font, fontSize: '12px' }}>{info.email}</span>
                    <button onClick={() => setStep(2)} style={{ ...ghostBtn, marginTop: 0, marginLeft: 'auto', fontSize: '10px' }}>Change</button>
                  </div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray400, textTransform: 'uppercase', width: '64px', flexShrink: 0 }}>Ship to</span>
                    <span style={{ fontFamily: font, fontSize: '12px' }}>{info.address}, {info.city}, {COUNTRIES.find(c => c.value === info.country)?.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray400, textTransform: 'uppercase', width: '64px', flexShrink: 0 }}>Method</span>
                    <span style={{ fontFamily: font, fontSize: '12px' }}>
                      {SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.label} — {qualifiesFreeShipping && selectedShipping === 'standard' ? 'FREE' : `$${SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.price}`}
                    </span>
                  </div>
                </div>
              </div>

              <h2 style={{ fontFamily: font, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px', color: tokens.gray600, fontWeight: 400 }}>
                PAYMENT METHOD
              </h2>

              {/* Payment method selector */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '32px' }}>
                {[
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'paypal', label: 'PayPal' },
                  { id: 'applepay', label: 'Apple Pay' },
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      flex: 1, height: '48px', fontFamily: font, fontSize: '10px',
                      letterSpacing: '1px', textTransform: 'uppercase',
                      border: `1px solid ${paymentMethod === pm.id ? tokens.black : tokens.gray200}`,
                      backgroundColor: paymentMethod === pm.id ? tokens.black : tokens.white,
                      color: paymentMethod === pm.id ? tokens.white : tokens.gray600,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Card form */}
              {paymentMethod === 'card' && (
                <div style={{ border: `1px solid ${tokens.gray200}`, padding: '32px' }}>
                  {/* Security badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                    <span style={{ fontSize: '14px' }}>🔒</span>
                    <span style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, letterSpacing: '0.5px' }}>
                      Your payment information is encrypted and secure
                    </span>
                  </div>

                  <Field
                    label="Name on Card"
                    value={payment.cardName}
                    onChange={v => setPayment(p => ({ ...p, cardName: v }))}
                    required
                    placeholder="As it appears on your card"
                  />
                  {errors.cardName && <span style={errStyle}>{errors.cardName}</span>}

                  {/* Card number with visual */}
                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '8px' }}>
                      Card Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={payment.cardNumber}
                        onChange={e => setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        style={{
                          width: '100%', height: '44px', border: 'none',
                          borderBottom: `1px solid ${tokens.gray200}`, outline: 'none',
                          fontSize: '14px', letterSpacing: '2px', backgroundColor: 'transparent',
                          fontFamily: font, color: tokens.black, boxSizing: 'border-box', padding: '0',
                        }}
                      />
                      {/* Card type indicator */}
                      <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '6px' }}>
                        {['VISA', 'MC', 'AMEX'].map(t => (
                          <span key={t} style={{ fontFamily: font, fontSize: '8px', letterSpacing: '1px', color: tokens.gray300, border: `1px solid ${tokens.gray200}`, padding: '2px 5px' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {errors.cardNumber && <span style={errStyle}>{errors.cardNumber}</span>}

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '8px' }}>
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={payment.expiry}
                        onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM / YY"
                        maxLength={5}
                        style={{ width: '100%', height: '44px', border: 'none', borderBottom: `1px solid ${tokens.gray200}`, outline: 'none', fontSize: '13px', letterSpacing: '1px', backgroundColor: 'transparent', fontFamily: font, color: tokens.black, boxSizing: 'border-box', padding: '0' }}
                      />
                      {errors.expiry && <span style={{ ...errStyle, marginTop: '4px' }}>{errors.expiry}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '8px' }}>
                        Security Code *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={payment.cvv}
                        onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="CVV"
                        maxLength={4}
                        style={{ width: '100%', height: '44px', border: 'none', borderBottom: `1px solid ${tokens.gray200}`, outline: 'none', fontSize: '13px', backgroundColor: 'transparent', fontFamily: font, color: tokens.black, boxSizing: 'border-box', padding: '0', letterSpacing: '2px' }}
                      />
                      {errors.cvv && <span style={{ ...errStyle, marginTop: '4px' }}>{errors.cvv}</span>}
                    </div>
                  </div>

                  {/* Different billing address toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginTop: '28px' }}>
                    <div
                      onClick={() => setPayment(p => ({ ...p, billingDiff: !p.billingDiff }))}
                      style={{
                        width: '18px', height: '18px',
                        border: `1px solid ${payment.billingDiff ? tokens.black : tokens.gray300}`,
                        backgroundColor: payment.billingDiff ? tokens.black : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                      }}
                    >
                      {payment.billingDiff && <span style={{ color: tokens.white, fontSize: '11px', fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontFamily: font, fontSize: '11px', color: tokens.gray600 }}>
                      Use a different billing address
                    </span>
                  </label>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div style={{ border: `1px solid ${tokens.gray200}`, padding: '48px 32px', textAlign: 'center' }}>
                  <p style={{ fontFamily: font, fontSize: '13px', color: tokens.gray600, marginBottom: '8px' }}>
                    You will be redirected to PayPal to complete your purchase.
                  </p>
                  <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, letterSpacing: '0.5px' }}>
                    Your order details will be sent to your PayPal account.
                  </p>
                </div>
              )}

              {paymentMethod === 'applepay' && (
                <div style={{ border: `1px solid ${tokens.gray200}`, padding: '48px 32px', textAlign: 'center' }}>
                  <p style={{ fontFamily: font, fontSize: '48px', marginBottom: '8px' }}>🍎</p>
                  <p style={{ fontFamily: font, fontSize: '13px', color: tokens.gray600, marginBottom: '8px' }}>
                    Complete your purchase using Apple Pay.
                  </p>
                  <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, letterSpacing: '0.5px' }}>
                    Use Touch ID or Face ID to confirm.
                  </p>
                </div>
              )}

              {/* Order total recap */}
              <div style={{ backgroundColor: tokens.offwhite, padding: '20px 24px', marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: tokens.gray600 }}>
                  Total due today
                </span>
                <span style={{ fontFamily: font, fontSize: '20px', fontWeight: 700 }}>${total.toLocaleString()}</span>
              </div>

              <button onClick={handleContinuePayment} style={{ ...primaryBtn, fontSize: '12px', letterSpacing: '3px' }}>
                PLACE ORDER — ${total.toLocaleString()}
              </button>

              <p style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, textAlign: 'center', marginTop: '16px', letterSpacing: '0.3px', lineHeight: 1.6 }}>
                By placing your order you agree to our Terms & Conditions and Privacy Policy.
              </p>

              <div style={{ textAlign: 'center' }}>
                <button onClick={prevStep} style={ghostBtn}>← Return to shipping</button>
              </div>
            </div>

            {/* Summary */}
            <div style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
              <OrderSummary cart={cart} subtotal={subtotal} shipping={shippingCost} total={total} step={step} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        input::placeholder { color: #AAAAAA; }
        select option { color: #000; }
      `}</style>
    </div>
  );
}
