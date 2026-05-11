import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { tokens, font } from '../styles';

const LOOKBOOK = [
  {
    id: 1, label: '01', title: 'WINTER 25\nCAMPAIGN',
    sub: 'The Architecture of Restraint',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800',
    desc: 'A study in proportion, volume, and monochromatic precision.',
    accent: '#C4A882',
  },
  {
    id: 2, label: '02', title: 'LEATHER\nCHAPTER',
    sub: 'Objects That Age With You',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1800',
    desc: 'Every bag carries the mark of its maker. Every scratch tells a story.',
    accent: '#8B7355',
  },
  {
    id: 3, label: '03', title: 'THE\nTIMEPIECE EDIT',
    sub: 'Precision Over Everything',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1800',
    desc: 'Time measured not in seconds, but in craftsmanship.',
    accent: '#B8B8B8',
  },
  {
    id: 4, label: '04', title: 'FOOTWEAR\nMANIFESTO',
    sub: 'Walk With Purpose',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1800',
    desc: 'Ground yourself in something exceptional.',
    accent: '#A0856C',
  },
  {
    id: 5, label: '05', title: 'JEWELLERY\nAS SCULPTURE',
    sub: 'Form, Weight, Presence',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1800',
    desc: 'Adornment that commands attention without asking for it.',
    accent: '#D4AF8A',
  },
];

const INTERVAL = 6000;

export default function Campaign({
  isLoggedIn, onSignIn, onLogout, onOrders, cart,
  onLogoClick, onShop, onCollections, onAbout, onCartOpen,
}) {
  const [active, setActive] = useState(0);
  const [prev, setPrev]     = useState(null);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const timerRef = useRef(null);

  const totalCount = (cart || []).reduce((s, i) => s + i.quantity, 0);
  const slide = LOOKBOOK[active];

  const advance = (to) => {
    const next = to !== undefined ? to : (active + 1) % LOOKBOOK.length;
    setTextVisible(false);
    setPrev(active);
    setTimeout(() => {
      setActive(next);
      setProgressKey(k => k + 1);
      setPrev(null);
      setTimeout(() => setTextVisible(true), 80);
    }, 700);
  };

  const goTo = (i) => {
    if (i === active) return;
    setPaused(true);
    advance(i);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => advance(), INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [active, paused]);

  const handleShop = onCollections || onShop;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', fontFamily: font }}>
      <Navbar
        isLoggedIn={isLoggedIn} cartCount={totalCount}
        onLogoClick={onLogoClick} onSignIn={onSignIn} onLogout={onLogout}
        onCartOpen={onCartOpen || (() => {})} onOrders={onOrders}
        onCollections={handleShop} onCampaign={() => {}} onAbout={onAbout}
      />

      {/* ═══════════════════════════════════════════════════
          HERO SLIDESHOW  (preserved + enhanced)
      ═══════════════════════════════════════════════════ */}
      <div
        style={{ position: 'relative', height: 'calc(100vh - 52px)', overflow: 'hidden', backgroundColor: '#050505', cursor: 'default' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); setProgressKey(k => k + 1); }}
      >
        {/* Slide layers */}
        {LOOKBOOK.map((s, i) => (
          <div key={s.id} style={{
            position: 'absolute', inset: 0, zIndex: i === active ? 2 : i === prev ? 1 : 0,
          }}>
            {/* Background image with Ken Burns on active */}
            <div style={{
              position: 'absolute', inset: '-4%',
              opacity: i === active ? 1 : i === prev ? 0 : 0,
              transition: i === prev ? 'opacity 0.8s ease' : 'opacity 0.8s ease 0.1s',
              animation: i === active ? 'kenBurns 7s ease-out forwards' : 'none',
            }}>
              <img
                src={s.image}
                alt={s.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(10%) brightness(0.48)' }}
              />
            </div>
          </div>
        ))}

        {/* Gradient layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />

        {/* Accent line — colour per slide */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', zIndex: 5,
          backgroundColor: slide.accent, transition: 'background-color 0.8s ease',
        }} />

        {/* ── Main content ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 60px 64px 68px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '60px', alignItems: 'flex-end' }}>

            {/* Left — text */}
            <div>
              {/* Slide counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', opacity: textVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
                <span style={{ fontFamily: font, fontSize: '11px', letterSpacing: '3px', color: slide.accent, fontWeight: 600 }}>
                  {slide.label}
                </span>
                <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.25)' }} />
                <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)' }}>
                  {String(LOOKBOOK.length).padStart(2,'0')}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: font,
                fontSize: 'clamp(52px, 7.5vw, 108px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '-3px',
                lineHeight: 0.87,
                margin: '0 0 28px',
                color: tokens.white,
                whiteSpace: 'pre-line',
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'none' : 'translateY(20px)',
                transition: 'opacity 0.55s ease 0.05s, transform 0.55s ease 0.05s',
              }}>
                {slide.title}
              </h1>

              {/* Sub */}
              <p style={{
                fontFamily: font, fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', margin: '0 0 10px',
                opacity: textVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.12s',
              }}>
                {slide.sub}
              </p>
              <p style={{
                fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.38)',
                lineHeight: 1.7, margin: '0 0 40px', maxWidth: '480px',
                opacity: textVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.18s',
              }}>
                {slide.desc}
              </p>

              {/* CTA */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', opacity: textVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.22s' }}>
                <button
                  onClick={handleShop}
                  style={{
                    fontFamily: font, fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
                    backgroundColor: slide.accent, border: 'none', color: '#050505',
                    padding: '0 36px', height: '50px', cursor: 'pointer', fontWeight: 700,
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { e.target.style.backgroundColor = tokens.white; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = slide.accent; }}
                >
                  Shop Collection →
                </button>
                <button
                  onClick={() => { setPaused(!paused); }}
                  style={{
                    fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                    backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.5)', padding: '0 20px', height: '50px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {paused ? '▶ Play' : '⏸ Pause'}
                </button>
              </div>
            </div>

            {/* Right — slide nav cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px' }}>
              {LOOKBOOK.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0',
                    borderLeft: `2px solid ${i === active ? slide.accent : 'rgba(255,255,255,0.1)'}`,
                    paddingLeft: '14px', transition: 'border-color 0.3s',
                    opacity: i === active ? 1 : 0.45,
                  }}
                  onMouseEnter={e => { if (i !== active) e.currentTarget.style.opacity = '0.8'; }}
                  onMouseLeave={e => { if (i !== active) e.currentTarget.style.opacity = '0.45'; }}
                >
                  <span style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', color: i === active ? slide.accent : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: i === active ? tokens.white : 'rgba(255,255,255,0.5)', fontWeight: i === active ? 600 : 400 }}>
                    {s.title.replace('\n', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            PROGRESS BAR  (preserved + enhanced)
        ═══════════════════════════════════════ */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          {/* Multi-segment progress (one segment per slide) */}
          <div style={{ display: 'flex', height: '2px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
            {LOOKBOOK.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRight: i < LOOKBOOK.length - 1 ? '1px solid rgba(0,0,0,0.4)' : 'none',
                  position: 'relative', overflow: 'hidden',
                  backgroundColor: i < active ? slide.accent : 'transparent',
                }}
              >
                {i === active && !paused && (
                  <div
                    key={`prog-${progressKey}`}
                    style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      backgroundColor: slide.accent,
                      animation: `fillBar ${INTERVAL}ms linear forwards`,
                    }}
                  />
                )}
                {i === active && paused && (
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', backgroundColor: slide.accent }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          LOOKBOOK GRID
      ═══════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: '#0A0A0A', padding: '88px 60px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '52px' }}>
            <div>
              <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                Fall / Winter 2025
              </p>
              <h2 style={{ fontFamily: font, fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-1.5px', color: tokens.white, margin: 0, lineHeight: 0.9 }}>
                Five Chapters.<br />One Vision.
              </h2>
            </div>
            <button onClick={handleShop} style={{
              fontFamily: font, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
              background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)',
              padding: '12px 28px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
              Browse All →
            </button>
          </div>

          {/* Asymmetric 2-row grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3px', marginBottom: '3px' }}>
            {/* Big left */}
            <LookCard slide={LOOKBOOK[0]} tall onShop={handleShop} />
            {/* Right stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <LookCard slide={LOOKBOOK[1]} onShop={handleShop} />
              <LookCard slide={LOOKBOOK[2]} onShop={handleShop} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
            <LookCard slide={LOOKBOOK[3]} wide onShop={handleShop} />
            <LookCard slide={LOOKBOOK[4]} wide onShop={handleShop} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          EDITORIAL STATEMENT
      ═══════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: tokens.white, padding: '96px 60px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="editorial-split">
          <div>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '20px' }}>
              The Creative Direction
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(32px, 4vw, 60px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: 0.88, margin: '0 0 36px', color: tokens.black }}>
              WE ARE DEFINING<br />THE SHAPE OF<br />NOW.
            </h2>
            <p style={{ fontFamily: font, fontSize: '15px', color: tokens.gray600, lineHeight: 1.85, margin: '0 0 20px' }}>
              The Winter 2025 collection is a meditation on permanence — objects designed not for the moment, but for the decades that follow. Each piece is a deliberate act of refusal: refusing the fleeting, the synthetic, the disposable.
            </p>
            <p style={{ fontFamily: font, fontSize: '15px', color: tokens.gray400, lineHeight: 1.85, margin: '0 0 40px' }}>
              Shot entirely in natural light, the campaign documents the objects as they were meant to be seen — unretouched, unhurried, undeniable.
            </p>
            <button onClick={handleShop} style={{
              fontFamily: font, fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase',
              backgroundColor: tokens.black, border: 'none', color: tokens.white,
              padding: '0 44px', height: '52px', cursor: 'pointer',
            }}>
              Shop the Collection
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900"
              alt=""
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(10%)', display: 'block' }}
            />
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', border: `1px solid ${tokens.gray200}`, zIndex: -1 }} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          QUOTE FULL-WIDTH
      ═══════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: '#060606', padding: '100px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontSize: '320px', fontWeight: 700, color: 'rgba(255,255,255,0.02)',
          fontFamily: font, letterSpacing: '-10px', pointerEvents: 'none', userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          ATELIER
        </div>
        <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '32px' }}>
          The House Belief
        </p>
        <p style={{
          fontFamily: font, fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 1.1,
          color: tokens.white, margin: '0 auto 36px', maxWidth: '820px',
        }}>
          "We do not make objects for the moment.<br />We make them to be handed down."
        </p>
        <div style={{ width: '1px', height: '60px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 auto' }} />
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#040404', padding: '52px 60px 36px', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, color: tokens.white, letterSpacing: '6px', margin: 0, textTransform: 'uppercase' }}>ATELIER</p>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Collection', 'Campaign', 'About'].map(l => (
              <button key={l} onClick={l === 'Collection' ? handleShop : undefined} style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
          <p style={{ fontFamily: font, fontSize: '8px', color: '#1A1A1A', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' }}>© {new Date().getFullYear()} Atelier</p>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes fillBar { from { width: 0% } to { width: 100% } }
        @keyframes kenBurns { from { transform: scale(1) } to { transform: scale(1.06) } }
        @media (max-width: 900px) {
          .editorial-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Lookbook card ───────────────────────────────────────────────────────────
function LookCard({ slide, tall, wide, onShop }) {
  const [hovered, setHovered] = useState(false);
  const aspect = tall ? '2/3' : wide ? '16/8' : '4/3';
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: aspect, cursor: 'pointer', backgroundColor: '#111' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onShop}
    >
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'grayscale(15%) brightness(0.55)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,${hovered ? 0.75 : 0.5}) 0%, transparent 60%)` , transition: 'background 0.4s' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}>
        <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: slide.accent, margin: '0 0 5px', transition: 'opacity 0.3s' }}>{slide.label}</p>
        <p style={{ fontFamily: font, fontSize: 'clamp(13px, 1.4vw, 18px)', fontWeight: 700, textTransform: 'uppercase', color: tokens.white, margin: '0 0 6px', letterSpacing: '-0.3px', whiteSpace: 'pre-line' }}>
          {slide.title}
        </p>
        <p style={{
          fontFamily: font, fontSize: '11px', color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.3px',
          maxHeight: hovered ? '40px' : '0', overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
          opacity: hovered ? 1 : 0,
        }}>
          {slide.desc}
        </p>
      </div>
    </div>
  );
}