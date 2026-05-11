import { useState } from 'react';
import { tokens, font } from '../styles';

export default function ProductCard({ product, onAddToCart, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleClick = () => {
    if (onClick) onClick(product);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', cursor: 'pointer', backgroundColor: tokens.offwhite }}
    >
      {/* Image — uniform aspect ratio 3:4 */}
      <div style={{ overflow: 'hidden', position: 'relative', aspectRatio: '3/4', backgroundColor: tokens.gray100 }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            filter: 'grayscale(8%)',
          }}
        />

        {/* Category tag */}
        {product.category && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '4px 8px',
            fontFamily: font,
            fontSize: '9px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: tokens.black,
          }}>
            {product.category}
          </div>
        )}

        {/* Quick add — appears on hover */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}>
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              backgroundColor: added ? tokens.gray800 : tokens.black,
              color: tokens.white,
              border: 'none',
              height: '40px',
              fontSize: '10px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: font,
              fontWeight: 500,
              transition: 'background-color 0.2s ease',
            }}
          >
            {added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div style={{ padding: '12px 0 16px', backgroundColor: tokens.white }}>
        <p style={{
          fontFamily: font,
          fontSize: '11px',
          fontWeight: 500,
          margin: '0 0 4px',
          color: tokens.black,
          letterSpacing: '0.3px',
          textTransform: 'uppercase',
        }}>{product.name}</p>
        <p style={{
          margin: 0,
          fontSize: '11px',
          color: tokens.gray600,
          fontFamily: font,
          fontWeight: 400,
        }}>
          ${product.price.toLocaleString()} USD
        </p>
      </div>
    </div>
  );
}
