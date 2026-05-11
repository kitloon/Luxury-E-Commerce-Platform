import { useState } from 'react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { tokens, font } from '../styles';

const PRODUCT_DETAILS = {
  'Structured Tote':       { desc: 'Crafted from full-grain calfskin, this architectural tote exemplifies modern minimalism. Gold-tone hardware, interior suede lining, and a detachable pouch define its utilitarian luxury.', details: ['Full-grain calfskin', 'Suede interior lining', 'Gold-tone hardware', 'Detachable zip pouch', 'Magnetic closure'], care: 'Wipe gently with a dry cloth. Avoid prolonged exposure to sunlight.', images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800'] },
  'Mini Crossbody':        { desc: 'The Mini Crossbody condenses the house signature into a compact silhouette. Adjustable chain strap, top-zip closure, and a single interior slip pocket for essentials.', details: ['Smooth lambskin leather', 'Gold chain strap', 'Top-zip closure', 'Interior card slot', 'Dust bag included'], care: 'Store in the provided dust bag. Stuff with tissue paper to maintain shape.', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800','https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800'] },
  'Leather Clutch':        { desc: 'An evening essential, this slim clutch is constructed from buttery soft nappa leather. Hidden snap closure and a polished engraved logo plaque.', details: ['Nappa leather', 'Satin lining', 'Hidden snap closure', 'Engraved logo plaque', 'Optional wrist strap'], care: 'Spot clean only with leather conditioner.', images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'] },
  'Auric Chronograph':     { desc: 'Swiss-made movement with a 72-hour power reserve. Sapphire crystal glass, exhibition caseback, and a hand-stitched leather strap that ages beautifully.', details: ['Swiss ETA movement', 'Sapphire crystal', '72-hour power reserve', 'Exhibition caseback', '5 ATM water resistance'], care: 'Service every 5 years. Avoid magnets and extreme temperatures.', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800','https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800','https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  'Rose Complication':     { desc: 'A tourbillon complication in an 18k rose gold case. Hand-engraved rotor, skeletonised dial exposing the beating heart of haute horlogerie.', details: ['18k rose gold case', 'Tourbillon complication', 'Skeletonised dial', 'Hand-engraved rotor', 'Alligator strap'], care: 'Annual service recommended. Handle with care.', images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800','https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  'Slim Dress Watch':      { desc: 'Ultra-thin at 5.8mm, this dress watch is built for the discerning collector. White lacquered dial, applied indices, and a brushed stainless steel bracelet.', details: ['5.8mm ultra-thin case', 'White lacquered dial', 'Applied hour indices', 'Stainless steel bracelet', '3 ATM water resistance'], care: 'Wipe with a soft microfibre cloth after each wear.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800','https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800'] },
  'Derby Oxford':          { desc: 'Goodyear-welted construction with a full-grain calf upper. Blake-stitched leather sole and a hand-burnished toe cap for effortless elegance.', details: ['Full-grain calf upper', 'Goodyear-welted', 'Blake-stitched leather sole', 'Hand-burnished toe', 'Cedar shoe trees included'], care: 'Polish with matching cream. Use cedar trees when stored.', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800','https://images.unsplash.com/photo-1584000302558-756da5109f5b?w=800'] },
  'Suede Chelsea Boot':    { desc: 'Supple suede upper with an elastic gore for a perfect fit. Stacked leather heel and a rubber-tipped sole for durability without compromising elegance.', details: ['Premium suede upper', 'Elastic gore panel', 'Stacked leather heel', 'Rubber-tipped sole', 'Pull tab at back'], care: 'Brush with a suede brush after each wear. Use a water repellent spray.', images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800','https://images.unsplash.com/photo-1584000302558-756da5109f5b?w=800'] },
  'White Leather Sneaker': { desc: 'The house take on the classic low-top. Tumbled leather upper, perforated toe box, and a vulcanised rubber sole with tonal branding.', details: ['Tumbled leather upper', 'Perforated toe box', 'Vulcanised rubber sole', 'Tonal logo branding', 'Removable insole'], care: 'Clean with a damp cloth and mild soap.', images: ['https://images.unsplash.com/photo-1584000302558-756da5109f5b?w=800','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800'] },
  'Pavé Bangle':           { desc: 'Set with 48 round-cut diamonds in an 18k white gold band. A statement of restraint — pure form, pure light.', details: ['18k white gold', '48 round-cut diamonds', 'Total: 1.2 ct', 'Certificate of authenticity', 'Gift box included'], care: 'Clean with ultrasonic cleaner. Store separately.', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800','https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800','https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800'] },
  'Chain Necklace':        { desc: 'A hand-assembled elongated chain in vermeil gold. Each link individually inspected — structured fluidity at its most precise.', details: ['Sterling silver vermeil', '24k gold plating', 'Lobster claw clasp', '80cm length', 'Adjustable'], care: 'Avoid contact with perfume and water. Store in a pouch.', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800','https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800'] },
  'Statement Ring':        { desc: 'A bold architectural form set in blackened sterling silver. Inspired by brutalist structure — jewellery as sculpture.', details: ['Sterling silver', 'Blackened finish', 'Sizes 5-11', 'Hallmarked 925', 'Sizing available in store'], care: 'Polish with a silver cloth. Remove before washing hands.', images: ['https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800','https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'] },
};

const DEFAULT_DETAIL = {
  desc: 'A considered object, designed with precision and crafted to endure.',
  details: ['Premium materials', 'Artisan craftsmanship', 'Dust bag included'],
  care: 'Handle with care. Store in the provided dust bag.',
  images: [],
};

export default function ProductDetail({
  product,
  isLoggedIn,
  onBack,
  onNeedAuth,
  onSignIn,
  onLogout,
  onOrders,
  cart,
  onCartOpen,
  onViewCart,
  // ── All cart mutations come from App.jsx ──
  onAddToCart,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState('description');

  const detail = PRODUCT_DETAILS[product?.name] || DEFAULT_DETAIL;
  const images = detail.images.length > 0
    ? detail.images
    : [product?.image_url, product?.image_url, product?.image_url].filter(Boolean);

  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Wraps App.jsx's onAddToCart with local loading/added state for button UX
  const handleAddToCart = async () => {
    if (!isLoggedIn) { onNeedAuth(); return; }
    setAdding(true);
    try {
      await onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      setShowCart(true); // open local drawer after adding
    } catch {
      // onAddToCart already shows alert on failure
    } finally {
      setAdding(false);
    }
  };

  const AccordionSection = ({ id, label, children }) => (
    <div style={{ borderTop: `1px solid ${tokens.gray200}` }}>
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: font, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
          color: tokens.black,
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: '18px', fontWeight: 300 }}>{openSection === id ? '−' : '+'}</span>
      </button>
      {openSection === id && (
        <div style={{ paddingBottom: '24px' }}>{children}</div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: font, backgroundColor: tokens.white, minHeight: '100vh' }}>
      <Navbar
        isLoggedIn={isLoggedIn}
        cartCount={totalCount}
        onLogoClick={onBack}
        onSignIn={onSignIn}
        onLogout={onLogout}
        onCartOpen={() => setShowCart(true)}
        onOrders={onOrders}
      />

      <div
        className="product-detail-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 48px)', paddingTop: '48px' }}
      >
        {/* ── Left: Images ── */}
        <div style={{ position: 'sticky', top: '48px', height: 'calc(100vh - 48px)', display: 'flex', gap: '12px', padding: '24px' }}>
          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '72px' }}>
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImg(i)}
                style={{
                  width: '72px', height: '90px', cursor: 'pointer', overflow: 'hidden',
                  outline: selectedImg === i ? `2px solid ${tokens.black}` : `1px solid ${tokens.gray100}`,
                  outlineOffset: selectedImg === i ? '2px' : '0',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          {/* Main image */}
          <div style={{ flex: 1, overflow: 'hidden', backgroundColor: tokens.offwhite }}>
            <img
              src={images[selectedImg]}
              alt={product?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.2s ease' }}
            />
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div style={{ padding: '60px 48px', overflowY: 'auto' }}>
          {/* Breadcrumb */}
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: font, fontSize: '10px', letterSpacing: '1px', color: tokens.gray400, textTransform: 'uppercase', padding: 0, marginBottom: '32px' }}>
            ← Back
          </button>

          <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: tokens.gray400, margin: '0 0 12px' }}>
            {product?.category}
          </p>

          <h1 style={{ fontFamily: font, fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 0.95, color: tokens.black, margin: '0 0 24px' }}>
            {product?.name}
          </h1>

          <p style={{ fontFamily: font, fontSize: '18px', fontWeight: 400, color: tokens.black, margin: '0 0 32px' }}>
            ${product?.price?.toLocaleString()} USD
          </p>

          {/* Colour swatches */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: tokens.gray600, marginBottom: '10px' }}>
              Colour: <span style={{ color: tokens.black }}>{product?.category || 'Black'}</span>
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: tokens.black, cursor: 'pointer', outline: `2px solid ${tokens.black}`, outlineOffset: '2px' }} />
              <div style={{ width: '24px', height: '24px', backgroundColor: '#8B7355', cursor: 'pointer' }} />
              <div style={{ width: '24px', height: '24px', backgroundColor: '#2C4A3E', cursor: 'pointer' }} />
            </div>
          </div>

          {/* Add to cart — calls handleAddToCart which calls App.jsx's onAddToCart */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            style={{
              width: '100%', height: '50px',
              backgroundColor: added ? tokens.gray800 : tokens.black,
              color: tokens.white, border: 'none', fontFamily: font, fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
              fontWeight: 500, marginBottom: '12px', transition: 'background-color 0.2s ease',
              opacity: adding ? 0.7 : 1,
            }}
          >
            {adding ? 'Adding...' : added ? 'Added to Cart' : 'Add to Cart'}
          </button>

          <button style={{
            width: '100%', height: '50px', backgroundColor: tokens.white,
            color: tokens.black, border: `1px solid ${tokens.black}`,
            fontFamily: font, fontSize: '11px', letterSpacing: '2px',
            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, marginBottom: '32px',
          }}>
            Add to Wishlist
          </button>

          {/* Accordion */}
          <AccordionSection id="description" label="Description">
            <p style={{ fontFamily: font, fontSize: '12px', color: tokens.gray600, lineHeight: 1.7, margin: 0 }}>
              {detail.desc}
            </p>
          </AccordionSection>

          <AccordionSection id="details" label="Details & Materials">
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {detail.details.map((d, i) => (
                <li key={i} style={{ fontFamily: font, fontSize: '11px', color: tokens.gray600, letterSpacing: '0.3px', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '3px', height: '3px', backgroundColor: tokens.gray400, borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
                  {d}
                </li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection id="care" label="Shipping & Returns">
            <p style={{ fontFamily: font, fontSize: '12px', color: tokens.gray600, lineHeight: 1.7, margin: '0 0 12px' }}>
              {detail.care}
            </p>
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
              {[
                { icon: '→', label: 'Complimentary Shipping', sub: 'On all orders' },
                { icon: '↩', label: 'Easy Returns', sub: '30-day return policy' },
                { icon: '◎', label: 'Client Service', sub: "We're here to help" },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontFamily: font, fontSize: '16px', margin: '0 0 4px', color: tokens.black }}>{item.icon}</p>
                  <p style={{ fontFamily: font, fontSize: '9px', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 2px', color: tokens.black, fontWeight: 600 }}>{item.label}</p>
                  <p style={{ fontFamily: font, fontSize: '9px', color: tokens.gray600, margin: 0 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </AccordionSection>

          <div style={{ borderTop: `1px solid ${tokens.gray200}` }} />
        </div>
      </div>

      {/* CartDrawer — uses App.jsx handlers passed as props */}
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={onRemove}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onViewCart={onViewCart}
          onCheckout={onCheckout}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
