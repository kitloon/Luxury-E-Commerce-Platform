import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { tokens, font } from '../styles';

const API = "http://127.0.0.1:8000";

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'asc',     label: 'Price ↑' },
  { value: 'desc',    label: 'Price ↓' },
  { value: 'name',    label: 'Name A–Z' },
];

// Banner fallback image if a category has no specific one
const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400';

export default function Collection({
  isLoggedIn, onSignIn, onLogout, onNeedAuth, onOrders, onProductClick,
  onLogoClick, onCampaign, onAbout, cart, onCartOpen, onAddToCart,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) { onNeedAuth(); return; }
    await onAddToCart(product);
    onCartOpen();
  };

  // Dynamic categories derived from DB — no hardcode
  const categories = ['All', ...[...new Set(products.map(p => p.category))]];

  let displayed = filter === 'All' ? products : products.filter(p => p.category === filter);
  displayed = [...displayed].sort((a, b) => {
    if (sort === 'asc')  return a.price - b.price;
    if (sort === 'desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Use first product image of that category as banner, fallback to default
  const getBannerImg = () => {
    if (filter === 'All') return FALLBACK_BANNER;
    const first = products.find(p => p.category === filter);
    return first?.image_url?.replace('w=700', 'w=1400') || FALLBACK_BANNER;
  };

  return (
    <div style={{ fontFamily: font, backgroundColor: tokens.white, minHeight: '100vh' }}>
      <Navbar
        isLoggedIn={isLoggedIn} cartCount={totalCount}
        onLogoClick={onLogoClick} onSignIn={onSignIn} onLogout={onLogout}
        onCartOpen={onCartOpen} onOrders={onOrders}
        onCollections={() => setFilter('All')} onCampaign={onCampaign} onAbout={onAbout}
      />

      {/* Banner */}
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: tokens.black }}>
        <img src={getBannerImg()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(25%) brightness(0.38)', transition: 'opacity 0.5s' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '0 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '36px' }}>
          <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>
            {filter === 'All' ? 'Winter 2025 — Full Collection' : `Atelier — ${filter}`}
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-2px', color: tokens.white, margin: 0, lineHeight: 0.9 }}>
            {filter === 'All' ? 'The Collection' : filter}
          </h1>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{ borderBottom: `1px solid ${tokens.gray200}`, position: 'sticky', top: '52px', backgroundColor: tokens.white, zIndex: 100 }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Category tabs — dynamic from DB */}
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {categories.map(cat => {
              const cnt = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
              const active = filter === cat;
              return (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  fontFamily: font, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                  background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  borderBottom: `2px solid ${active ? tokens.black : 'transparent'}`,
                  color: active ? tokens.black : tokens.gray400,
                  padding: '16px 20px', fontWeight: active ? 700 : 400, transition: 'all 0.15s',
                }}>
                  {cat} <span style={{ fontSize: '9px', color: active ? tokens.gray600 : tokens.gray300, marginLeft: '4px' }}>{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* Sort + view toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              fontFamily: font, fontSize: '10px', letterSpacing: '0.5px',
              border: 'none', borderBottom: `1px solid ${tokens.gray200}`,
              background: 'transparent', cursor: 'pointer', padding: '4px 20px 4px 0',
              color: tokens.black, outline: 'none', appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23aaa'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 2px center',
            }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setViewMode('grid')} title="3 columns" style={{ width: '28px', height: '28px', border: `1px solid ${viewMode === 'grid' ? tokens.black : tokens.gray200}`, background: viewMode === 'grid' ? tokens.black : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 11 11">
                  {[[0,0],[5,0],[0,5],[5,5]].map(([x,y],i) => <rect key={i} x={x} y={y} width="4" height="4" fill={viewMode==='grid'?'white':'#aaa'}/>)}
                </svg>
              </button>
              <button onClick={() => setViewMode('large')} title="2 columns" style={{ width: '28px', height: '28px', border: `1px solid ${viewMode === 'large' ? tokens.black : tokens.gray200}`, background: viewMode === 'large' ? tokens.black : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 11 11">
                  {[[0],[6]].map((x,i) => <rect key={i} x={x} y={0} width="4" height="11" fill={viewMode==='large'?'white':'#aaa'}/>)}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product area */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ padding: '20px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${tokens.gray100}`, marginBottom: '2px' }}>
          <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray400, margin: 0 }}>
            {loading ? 'Loading…' : `${displayed.length} ${displayed.length === 1 ? 'item' : 'items'}`}
          </p>
          {filter !== 'All' && (
            <button onClick={() => setFilter('All')} style={{ fontFamily: font, fontSize: '10px', color: tokens.gray400, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear filter ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ fontFamily: font, fontSize: '11px', color: tokens.gray300, letterSpacing: '2px', textTransform: 'uppercase' }}>Loading Collection…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ fontFamily: font, fontSize: '13px', color: tokens.gray300 }}>No items in this category.</p>
          </div>
        ) : (
          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'large' ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
            gap: '2px', backgroundColor: tokens.gray100,
          }}>
            {displayed.map(p => (
              <div key={p.id} style={{ backgroundColor: tokens.white }}>
                <ProductCard product={p} onAddToCart={() => handleAddToCart(p)} onClick={() => onProductClick(p)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#080808', padding: '52px 32px 36px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, color: tokens.white, letterSpacing: '6px', margin: 0, textTransform: 'uppercase' }}>ATELIER</p>
          <p style={{ fontFamily: font, fontSize: '8px', color: '#2A2A2A', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' }}>© {new Date().getFullYear()} Atelier. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 900px) { .product-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 540px) { .product-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
