import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { tokens, font } from '../styles';

const TIMELINE = [
  { year: '1917', label: 'Foundation', desc: 'Established in Paris as a specialist atelier for bespoke leather goods.' },
  { year: '1937', label: 'Paris Maison', desc: 'Relocated to the 8th arrondissement, cementing our place in the fashion hierarchy.' },
  { year: '1968', label: 'Haute Couture', desc: 'Launch of the haute couture division — garments made entirely by hand.' },
  { year: '1997', label: 'The New Era', desc: 'A new creative director redefines the house with uncompromising minimalism.' },
  { year: 'NOW', label: 'Legacy', desc: 'Every object we produce carries the weight of over a century of mastery.' },
];

const STATS = [
  { n: '107', label: 'Years of craft' },
  { n: '48',  label: 'Artisans on staff' },
  { n: '12',  label: 'Countries we ship to' },
  { n: '100%', label: 'Hand-finished pieces' },
];

const PILLARS = [
  { title: 'Material Honesty', desc: 'We use only what belongs — full-grain leather, 18k gold, Swiss movements. No shortcuts, no synthetic substitutes.' },
  { title: 'Structural Precision', desc: 'Every seam, every edge, every clasp is engineered to endure. Form follows function without sacrificing either.' },
  { title: 'Restraint by Design', desc: 'Ornament is the enemy of permanence. We strip away until only the essential remains.' },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(24px)',
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function About({ isLoggedIn, onSignIn, onLogout, onOrders, cart, onLogoClick, onCollections, onCampaign, onCartOpen }) {
  const totalCount = (cart || []).reduce((s, i) => s + i.quantity, 0);
  const [activeYear, setActiveYear] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.white, fontFamily: font }}>
      <Navbar
        isLoggedIn={isLoggedIn} cartCount={totalCount}
        onLogoClick={onLogoClick} onSignIn={onSignIn} onLogout={onLogout}
        onCartOpen={onCartOpen || (() => {})} onOrders={onOrders}
        onCollections={onCollections} onCampaign={onCampaign} onAbout={() => {}}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '620px' }} className="about-hero">
        {/* Left — text */}
        <div style={{ backgroundColor: tokens.black, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '64px 52px' }}>
          <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>
            Story / Heritage / Philosophy
          </p>
          <h1 style={{
            fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 68px)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: 0.88,
            margin: '0 0 36px', color: tokens.white,
          }}>
            WE ARE<br />DEFINING<br />THE SHAPE<br />OF NOW.
          </h1>
          <p style={{ fontFamily: font, fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: '380px', margin: 0 }}>
            Atelier is a luxury fashion house founded in 1917 in Paris. The House has redefined fashion through bold creativity and uncompromising craftsmanship.
          </p>
        </div>

        {/* Right — image */}
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: tokens.gray100 }}>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(15%)' }}
          />
          {/* Est badge */}
          <div style={{
            position: 'absolute', bottom: '36px', right: '36px',
            backgroundColor: tokens.white, padding: '20px 28px',
          }}>
            <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, margin: '0 0 4px' }}>Established</p>
            <p style={{ fontFamily: font, fontSize: '36px', fontWeight: 700, color: tokens.black, margin: 0, letterSpacing: '-1px', lineHeight: 1 }}>1917</p>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: tokens.offwhite, borderBottom: `1px solid ${tokens.gray200}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: '1200px', margin: '0 auto' }} className="stats-grid">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div style={{
                padding: '52px 32px', textAlign: 'center',
                borderRight: i < STATS.length - 1 ? `1px solid ${tokens.gray200}` : 'none',
              }}>
                <p style={{ fontFamily: font, fontSize: 'clamp(40px, 4vw, 60px)', fontWeight: 700, color: tokens.black, margin: '0 0 8px', letterSpacing: '-2px', lineHeight: 1 }}>
                  {stat.n}
                </p>
                <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: tokens.gray600, margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Philosophy ───────────────────────────────────────────────────── */}
      <div style={{ padding: '88px 52px', maxWidth: '1200px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start', marginBottom: '72px' }} className="story-grid">
            <div>
              <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '16px' }}>Our Philosophy</p>
              <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-1px', color: tokens.black, lineHeight: 1, margin: 0 }}>
                Craft Over<br />Everything.
              </h2>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: '15px', color: tokens.gray600, lineHeight: 1.8, margin: '0 0 24px' }}>
                At Atelier, every object is the result of a deliberate choice — an insistence on material honesty, structural precision, and the kind of restraint that takes years to master. We do not follow trends. We build things that outlast them.
              </p>
              <p style={{ fontFamily: font, fontSize: '15px', color: tokens.gray600, lineHeight: 1.8, margin: 0 }}>
                Our artisans work in small ateliers in Paris and Florence, using techniques unchanged for generations. Each piece passes through no fewer than twelve pairs of hands before it reaches yours.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Three pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', backgroundColor: tokens.gray100 }} className="pillars-grid">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div style={{ backgroundColor: tokens.white, padding: '40px 32px', height: '100%' }}>
                <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '16px' }}>0{i + 1}</p>
                <h3 style={{ fontFamily: font, fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.5px', color: tokens.black, margin: '0 0 16px' }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: font, fontSize: '13px', color: tokens.gray600, lineHeight: 1.7, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Full-width quote image ────────────────────────────────────────── */}
      <div style={{ height: 'clamp(280px, 45vw, 520px)', overflow: 'hidden', position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1800"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) brightness(0.55)' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{
            fontFamily: font, fontSize: 'clamp(28px, 5vw, 76px)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '-2px', color: tokens.white,
            lineHeight: 0.9, textAlign: 'center', padding: '0 24px',
          }}>
            EVERY OBJECT<br />HAS A PURPOSE.
          </p>
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#060606', padding: '80px 52px' }}>
        <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '56px' }}>
          Our History
        </p>

        {/* Timeline — vertical on desktop */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {TIMELINE.map((item, i) => {
            const open = activeYear === item.year;
            return (
              <div
                key={item.year}
                onClick={() => setActiveYear(open ? null : item.year)}
                style={{
                  borderTop: `1px solid ${i === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
                  padding: '28px 0',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 24px',
                  gap: '32px',
                  alignItems: 'start',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = i === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}
              >
                <p style={{ fontFamily: font, fontSize: '28px', fontWeight: 700, color: tokens.white, margin: 0, letterSpacing: '-1px', lineHeight: 1 }}>
                  {item.year}
                </p>
                <div>
                  <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px' }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontFamily: font, fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0,
                    maxHeight: open ? '100px' : '0', overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.3s ease',
                    opacity: open ? 1 : 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', lineHeight: 1, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none', marginTop: '2px' }}>+</span>
              </div>
            );
          })}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
      </div>

      {/* ── Atelier values strip ──────────────────────────────────────────── */}
      <div style={{ backgroundColor: tokens.offwhite, padding: '64px 52px', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: tokens.gray400, marginBottom: '24px' }}>
            Paris · Florence · Since 1917
          </p>
          <p style={{ fontFamily: font, fontSize: 'clamp(14px, 2vw, 20px)', color: tokens.gray600, lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 36px' }}>
            "We do not make objects for the moment.<br />We make them to be handed down."
          </p>
          {onCollections && (
            <button onClick={onCollections} style={{
              fontFamily: font, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              backgroundColor: tokens.black, border: 'none', color: tokens.white,
              padding: '0 40px', height: '48px', cursor: 'pointer',
            }}>
              Explore the Collection
            </button>
          )}
        </Reveal>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#080808', padding: '56px 52px 40px', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontFamily: font, fontSize: '13px', fontWeight: 700, color: tokens.white, letterSpacing: '5px', margin: 0, textTransform: 'uppercase' }}>ATELIER</p>
          <p style={{ fontFamily: font, fontSize: '8px', color: '#2A2A2A', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' }}>© {new Date().getFullYear()} Atelier. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .about-hero { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .story-grid { grid-template-columns: 1fr !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
