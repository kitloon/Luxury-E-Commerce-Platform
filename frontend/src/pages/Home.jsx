import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { tokens, font } from '../styles';

const API = "http://127.0.0.1:8000";

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Section({ children, dark = false }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ backgroundColor: dark ? '#080808' : tokens.white, padding: '80px 0', overflow: 'hidden' }}>
      <div style={{
        maxWidth: '1440px', margin: '0 auto', padding: '0 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ label, title, dark, onViewAll }) {
  return (
    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: dark ? '#444' : tokens.gray400, margin: '0 0 10px' }}>
          {label}
        </p>
        <h2 style={{
          fontFamily: font, fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-1px', color: dark ? tokens.white : tokens.black,
          margin: 0, lineHeight: 1,
        }}>
          {title}
        </h2>
      </div>
      {onViewAll && (
        <button onClick={onViewAll} style={{
          fontFamily: font, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
          background: 'none', border: `1px solid ${dark ? '#333' : tokens.gray200}`,
          color: dark ? '#666' : tokens.gray600, padding: '8px 20px', cursor: 'pointer',
        }}>
          View All
        </button>
      )}
    </div>
  );
}

export default function Home({
  isLoggedIn, onSignIn, onLogout, onNeedAuth, onOrders, onProductClick,
  onCollections, onCampaign, onAbout, cart, onCartOpen, onAddToCart,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    setTimeout(() => setHeroVisible(true), 80);
  }, []);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) { onNeedAuth(); return; }
    await onAddToCart(product);
    onCartOpen();
  };

  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Get unique categories from DB data (dynamic — no hardcode)
  const categories = [...new Set(products.map(p => p.category))];
  const byCategory = (cat) => products.filter(p => p.category === cat);

  return (
    <div style={{ fontFamily: font, backgroundColor: tokens.white }}>
      <Navbar
        isLoggedIn={isLoggedIn}
        cartCount={totalCount}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSignIn={onSignIn}
        onLogout={onLogout}
        onCartOpen={onCartOpen}
        onOrders={onOrders}
        onCollections={onCollections}
        onShop={onCollections}
        onCampaign={onCampaign}
        onAbout={onAbout}
      />

      {/* Hero */}
      <div style={{ position: 'relative', height: 'calc(100vh - 48px)', backgroundColor: tokens.black, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) brightness(0.45)', transition: 'opacity 1s ease', opacity: heroVisible ? 1 : 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%)' }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(40px)',
          transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s',
        }}>
          <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '20px' }}>
            Fall / Winter 25
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-3px', lineHeight: 0.88, color: tokens.white, margin: '0 0 32px' }}>
            ATELIER
          </h1>
          <button
            onClick={onCollections}
            style={{ fontFamily: font, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.35)', color: tokens.white, padding: '0 32px', height: '44px', cursor: 'pointer' }}
            onMouseEnter={e => { e.target.style.backgroundColor = tokens.white; e.target.style.color = tokens.black; }}
            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = tokens.white; }}
          >
            Shop Winter 25 Collection
          </button>
        </div>
      </div>

      {/* Ticker — dynamic categories from DB */}
      <div style={{ backgroundColor: tokens.black, padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'inline-flex', animation: 'ticker 30s linear infinite', gap: 0 }}>
          {[...categories, ...categories].map((t, i) => (
            <span key={i} style={{ fontFamily: font, fontSize: '8px', letterSpacing: '4px', color: '#2A2A2A', textTransform: 'uppercase', marginRight: '56px' }}>
              {t} &nbsp;·
            </span>
          ))}
        </div>
      </div>

      {/* Editorial */}
      <div style={{ backgroundColor: tokens.offwhite, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }} className="editorial-grid">
          <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: tokens.gray100 }}>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(15%)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px', backgroundColor: tokens.white }}>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '20px' }}>The Collection</p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-1.5px', lineHeight: 0.9, color: tokens.black, margin: '0 0 28px' }}>
              WINTER<br />COLLECTION<br />2025
            </h2>
            <button onClick={onCollections} style={{ fontFamily: font, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: tokens.black, border: 'none', color: tokens.white, padding: '0 32px', height: '44px', cursor: 'pointer', alignSelf: 'flex-start' }}>
              View Collection
            </button>
          </div>
        </div>
      </div>

      {/* Category sections — fully dynamic from DB */}
      {loading ? (
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, letterSpacing: '2px', textTransform: 'uppercase' }}>Loading…</p>
        </div>
      ) : (
        categories.map((cat, idx) => {
          const items = byCategory(cat);
          if (items.length === 0) return null;
          const dark = idx % 2 === 1;
          return (
            <Section key={cat} dark={dark}>
              <SectionHeader label="Atelier Collection" title={cat} dark={dark} onViewAll={onCollections} />
              <div className="home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                {items.slice(0, 3).map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onClick={onProductClick} />
                ))}
              </div>
            </Section>
          );
        })
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: '#080808', padding: '64px 24px 40px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, color: tokens.white, letterSpacing: '6px', margin: 0, textTransform: 'uppercase' }}>ATELIER</p>
          <p style={{ fontFamily: font, fontSize: '8px', color: '#222', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' }}>© {new Date().getFullYear()} Atelier. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (max-width: 900px) { .home-grid { grid-template-columns: repeat(2, 1fr) !important; } .editorial-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 540px) { .home-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
