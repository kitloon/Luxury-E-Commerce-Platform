import { useState } from 'react';
import styles, { tokens, font } from '../styles';

export default function Navbar({
  isLoggedIn, cartCount,
  onLogoClick, onSignIn, onLogout, onCartOpen, onOrders,
  onCollections, onShop, onCampaign, onAbout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = {
    fontFamily: font,
    fontSize: '11px',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    color: tokens.black,
    textTransform: 'uppercase',
    fontWeight: 400,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  const navLinks = [
    { label: 'Collections', action: onCollections },
    { label: 'Campaign', action: onCampaign },
    { label: 'About', action: onAbout },
  ];

  return (
    <>
      <nav style={styles.nav}>
        {/* Left: brand wordmark */}
        <div style={{ flex: 1 }}>
          <h1 style={styles.logo} onClick={onLogoClick}>ATELIER</h1>
        </div>

        {/* Center: main nav links */}
        <div className="nav-center" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navLinks.map(l => (
            <span key={l.label} style={linkStyle} onClick={l.action}>{l.label}</span>
          ))}
        </div>

        {/* Right: utility links */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
          <span className="nav-util" style={linkStyle}>Search</span>
          {isLoggedIn ? (
            <>
              <span className="nav-util" style={linkStyle} onClick={onOrders}>Orders</span>
              <span className="nav-util" style={linkStyle} onClick={onLogout}>Account</span>
            </>
          ) : (
            <span className="nav-util" style={linkStyle} onClick={onSignIn}>Account</span>
          )}
          <span style={{ ...linkStyle, cursor: 'pointer' }} onClick={onCartOpen}>
            Cart ({cartCount})
          </span>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="hamburger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'none', flexDirection: 'column', gap: '4px' }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: '18px', height: '1px', backgroundColor: tokens.black }} />
            <span style={{ display: 'block', width: '18px', height: '1px', backgroundColor: tokens.black }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '48px', left: 0, width: '100%',
          backgroundColor: tokens.white, borderBottom: `1px solid ${tokens.gray200}`,
          padding: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {navLinks.map(l => (
            <span key={l.label} style={{ ...linkStyle, fontSize: '13px' }}
              onClick={() => { l.action?.(); setMenuOpen(false); }}>{l.label}</span>
          ))}
          <div style={{ height: '1px', backgroundColor: tokens.gray200 }} />
          <span style={{ ...linkStyle, fontSize: '13px' }}>Search</span>
          {isLoggedIn ? (
            <>
              <span style={{ ...linkStyle, fontSize: '13px' }} onClick={() => { onOrders(); setMenuOpen(false); }}>Orders</span>
              <span style={{ ...linkStyle, fontSize: '13px' }} onClick={() => { onLogout(); setMenuOpen(false); }}>Account</span>
            </>
          ) : (
            <span style={{ ...linkStyle, fontSize: '13px' }} onClick={() => { onSignIn(); setMenuOpen(false); }}>Account</span>
          )}
          <span style={{ ...linkStyle, fontSize: '13px' }} onClick={() => { onCartOpen?.(); setMenuOpen(false); }}>Cart ({cartCount})</span>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-center { display: none !important; }
          .nav-util { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
