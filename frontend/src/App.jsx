import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import Collection from './pages/Collection';
import Campaign from './pages/Campaign';
import About from './pages/About';
import Cart from './pages/cart';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './pages/admin/AdminDashboard';

const API = "http://127.0.0.1:8000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export default function App() {
  const [view, setView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);

  // ─── Fetch cart from backend (single source of truth) ───────────────────────
  // Returns a promise so handlers can `await fetchCart()` and be sure state is updated.
  const fetchCart = async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await axios.get(`${API}/cart`, { headers: authHeader() });
      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCart();
  }, [isLoggedIn, view]);

  // ─── Admin entry via URL param (?admin) ──────────────────────────────────────
  useEffect(() => {
    if (window.location.search.includes('admin')) {
      setView('admin');
    }
  }, []);

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setCart([]);
    setView('home');
  };

  // ─── Cart operations — ALL API calls live here only ──────────────────────────
  // Rule: after EVERY mutation, call fetchCart() so cart state = database truth.
  // No optimistic updates. Database is the single source of truth.

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) { setView('login'); return; }
    try {
      await axios.post(`${API}/cart`, { product_id: product.id }, { headers: authHeader() });
      await fetchCart(); // re-fetch: database now has the correct qty + correct product data
    } catch {
      alert("Failed to add item.");
    }
  };

  const handleIncrement = async (productId) => {
    try {
      await axios.post(`${API}/cart`, { product_id: productId }, { headers: authHeader() });
      await fetchCart();
    } catch {
      alert("Failed to update cart.");
    }
  };

  const handleDecrement = async (productId) => {
    try {
      await axios.delete(`${API}/cart/${productId}`, { headers: authHeader() });
      await fetchCart();
    } catch {
      alert("Failed to update cart.");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    try {
      // Fire all deletes sequentially (backend decrements by 1 each call)
      for (let i = 0; i < item.quantity; i++) {
        await axios.delete(`${API}/cart/${productId}`, { headers: authHeader() });
      }
      await fetchCart();
    } catch {
      await fetchCart(); // always re-sync on error too
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) { setView('login'); return; }
    try {
      await axios.post(`${API}/checkout`, {}, { headers: authHeader() });
      alert("Order placed successfully!");
      await fetchCart(); // will return [] since backend cleared the cart
      setShowCart(false);
      setView('home');
    } catch {
      alert("Checkout failed. Please try again.");
    }
  };

  // ─── Navigation ──────────────────────────────────────────────────────────────
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('product');
  };

  const navigateToCart = () => {
    setView('cart');
    setShowCart(false);
  };

  const openDrawer = () => setShowCart(true);

  // ─── Props bundles ────────────────────────────────────────────────────────────
  const commonProps = {
    isLoggedIn,
    cart,
    setCart,
    onSignIn: () => setView('login'),
    onLogout: handleLogout,
    onOrders: () => { isLoggedIn ? setView('orders') : setView('login'); },
    onLogoClick: () => setView('home'),
    onCartOpen: openDrawer,
    onViewCart: navigateToCart,
    onCollections: () => setView('collection'),   // ← 新加这行
    onCampaign: () => setView('campaign'),         // ← 新加这行
    onAbout: () => setView('about'),               // ← 新加这行
  };

  // Cart-specific handlers passed to pages that show cart items
  const cartHandlers = {
    onAddToCart: handleAddToCart,
    onIncrement: handleIncrement,
    onDecrement: handleDecrement,
    onRemove: handleRemoveFromCart,
    onCheckout: handleCheckout,
  };

  // ─── Routing ─────────────────────────────────────────────────────────────────
  let content;

  if (view === 'login') {
    content = <Login onSuccess={handleLoginSuccess} onGoSignup={() => setView('signup')} onBack={() => setView('home')} />;

  } else if (view === 'signup') {
    content = <Signup onSuccess={() => setView('login')} onGoLogin={() => setView('login')} onBack={() => setView('home')} />;

  } else if (view === 'cart') {
    content = (
      <Cart
        cart={cart}
        setCart={setCart}
        onBack={() => setView('home')}
        {...cartHandlers}
      />
    );

  } else if (view === 'orders') {
    content = (
      <Orders
        onBack={() => setView('home')}
        {...commonProps}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
      />
    );

  } else if (view === 'product') {
    content = (
      <ProductDetail
        {...commonProps}
        {...cartHandlers}
        product={selectedProduct}
        onBack={() => setView('home')}
        onNeedAuth={() => setView('login')}
      />
    );

  } else if (view === 'collection') {
    content = (
      <Collection
        {...commonProps}
        {...cartHandlers}
        onProductClick={handleProductClick}
        onNeedAuth={() => setView('login')}
      />
    );

  } else if (view === 'campaign') {
    content = <Campaign {...commonProps} onShop={() => setView('collection')} />;

  } else if (view === 'admin') {
    content = <AdminDashboard onExit={() => setView('home')} />;

  } else if (view === 'about') {
    content = <About {...commonProps} />;

  } else {
    content = (
      <Home
        {...commonProps}
        {...cartHandlers}
        onNeedAuth={() => setView('login')}
        onProductClick={handleProductClick}
        onCollections={() => setView('collection')}
        onCampaign={() => setView('campaign')}
        onAbout={() => setView('about')}
      />
    );
  }

  return (
    <>
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={handleRemoveFromCart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onViewCart={navigateToCart}
          onCheckout={handleCheckout}
        />
      )}
      {content}

      {/* 隐藏管理员入口 — 右下角透明点，点5次进入后台 */}
      <AdminEntry onEnter={() => setView('admin')} />
    </>
  );
}

function AdminEntry({ onEnter }) {
  const [clicks, setClicks] = React.useState(0);
  const timer = React.useRef(null);
  const handle = () => {
    const next = clicks + 1;
    setClicks(next);
    clearTimeout(timer.current);
    if (next >= 5) { setClicks(0); onEnter(); }
    else { timer.current = setTimeout(() => setClicks(0), 3000); }
  };
  return (
    <div
      onClick={handle}
      style={{
        position: 'fixed', bottom: '16px', right: '16px',
        width: '18px', height: '18px',
        borderRadius: '50%', background: 'transparent',
        cursor: 'pointer', zIndex: 9999,
      }}
      title=""
    />
  );
}
