import { useEffect, useState } from 'react';
import styles, { tokens, font } from '../styles';

export default function CartDrawer({ cart, onClose, onRemove, onIncrement, onDecrement, onViewCart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => { 
    requestAnimationFrame(() => setVisible(true)); 
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleClose = () => { 
    setVisible(false); 
    setTimeout(onClose, 300); 
  };

  const goToCartPage = () => {
    setVisible(false); 
    setTimeout(() => {  
      onClose(); 
      if (onViewCart) {
        onViewCart(); // This triggers setView('cart') in App.jsx
      }
    }, 300);
  };

  const handleRemove = (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove ${productName} from your cart?`)) {
      onRemove(productId);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      if (window.confirm(`Are you sure you want to remove ${item.name} from your cart?`)) {
        onDecrement(item.id);
      }
    } else {
      onDecrement(item.id);
    }
  };

  const labelStyle = {
    fontFamily: font,
    fontSize: '10px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: tokens.gray600,
    fontWeight: 400,
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1400,
        backgroundColor: `rgba(0,0,0,${visible ? 0.3 : 0})`,
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...styles.cartDrawer,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          width: 'min(480px, 100vw)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: tokens.white,
        }}
      >
        {/* 1. STICKY HEADER */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 24px', height: '48px', borderBottom: `1px solid ${tokens.gray200}`,
          backgroundColor: tokens.white, zIndex: 10,
        }}>
          <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ATELIER
          </span>
          <span 
            style={{ fontFamily: font, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }} 
            onClick={handleClose}
          >
            Close
          </span>
        </div>

        {/* 2. SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '24px 24px 0', borderBottom: `1px solid ${tokens.gray200}` }}>
            <div style={{ 
              padding: '12px 0', fontFamily: font, fontSize: '10px', letterSpacing: '0.5px',
              color: tokens.black, borderBottom: `2px solid ${tokens.black}`, display: 'inline-block'
            }}>
              01. CART
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <p style={{ ...labelStyle, marginBottom: '20px' }}>Your Items ({totalQty})</p>
            
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontFamily: font, fontSize: '11px', textTransform: 'uppercase', margin: 0, fontWeight: 500 }}>
                      {item.name}
                    </p>
                    <button 
                      onClick={() => handleRemove(item.id, item.name)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 0 0 10px', color: tokens.gray400 }}
                    >
                      ×
                    </button>
                  </div>
                  <p style={{ fontFamily: font, fontSize: '12px', margin: '6px 0', color: tokens.gray600 }}>
                    ${item.price.toLocaleString()}
                  </p>
                  
                  {/* IMPROVED BUTTONS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${tokens.gray200}`, borderRadius: '2px' }}>
                      <button 
                        onClick={() => handleDecrement(item)} 
                        style={{ padding: '4px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '11px', width: '24px', textAlign: 'center', fontFamily: font }}>{item.quantity}</span>
                      <button 
                        onClick={() => onIncrement(item.id)} 
                        style={{ padding: '4px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. FIXED BOTTOM FOOTER */}
        {cart.length > 0 && (
          <div style={{ 
            padding: '24px', 
            borderTop: `1px solid ${tokens.gray200}`,
            backgroundColor: tokens.white,
            boxShadow: '0 -4px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={labelStyle}>Subtotal</span>
              <span style={{ fontFamily: font, fontSize: '14px', fontWeight: 600 }}>${total.toLocaleString()} USD</span>
            </div>
            <button
              onClick={goToCartPage}
              style={{ 
                ...styles.btnBlack, 
                width: '100%', 
                height: '52px', 
                fontSize: '11px', 
                letterSpacing: '2px', 
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              VIEW CART & CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}