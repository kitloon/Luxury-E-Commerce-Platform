import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const CATEGORIES = ["Leather Goods", "Timepieces", "Footwear", "Jewellery"];

const font = "'Georgia', 'Times New Roman', serif";
const mono = "'Courier New', monospace";

const tok = {
  bg: "#F9F8F5",
  white: "#FFFFFF",
  black: "#0A0A0A",
  gold: "#B8955A",
  goldLight: "#F0E8D8",
  gray100: "#F0EEE9",
  gray200: "#E0DDD6",
  gray300: "#C8C5BC",
  gray400: "#9E9B93",
  gray500: "#6E6B63",
  gray600: "#4A4843",
  red: "#C0392B",
  redLight: "#FDECEA",
  green: "#1E6B45",
  greenLight: "#E8F5EE",
  amber: "#B8760A",
  amberLight: "#FDF4E3",
};

// ── Tiny helpers ────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
const badge = (label, bg, color) => (
  <span style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: bg, color, padding: "3px 8px", borderRadius: "2px" }}>
    {label}
  </span>
);

// ── Modal ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: tok.white, width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", border: `1px solid ${tok.gray200}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${tok.gray200}` }}>
          <span style={{ fontFamily: font, fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: tok.black }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: tok.gray400, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ── Form Field ──────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: tok.gray500, display: "block", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", fontFamily: font, fontSize: "14px", padding: "10px 12px",
  border: `1px solid ${tok.gray300}`, background: tok.white, color: tok.black,
  outline: "none", boxSizing: "border-box",
};

// ── Confirm Dialog ──────────────────────────────────────────────────────────
function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: tok.white, padding: "32px", maxWidth: "400px", width: "90%", border: `1px solid ${tok.gray200}` }}>
        <p style={{ fontFamily: font, fontSize: "15px", color: tok.black, margin: "0 0 24px", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onConfirm} style={{ flex: 1, fontFamily: mono, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", background: tok.black, color: tok.white, border: "none", padding: "11px", cursor: "pointer" }}>Confirm</button>
          <button onClick={onCancel} style={{ flex: 1, fontFamily: mono, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", background: "none", color: tok.gray500, border: `1px solid ${tok.gray300}`, padding: "11px", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 3000, display: "flex", flexDirection: "column", gap: "8px" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ fontFamily: mono, fontSize: "11px", letterSpacing: "0.5px", padding: "12px 20px", background: t.type === "error" ? tok.red : tok.black, color: tok.white, borderLeft: `3px solid ${t.type === "error" ? "#FF6B6B" : tok.gold}`, minWidth: "240px" }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Login Screen ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const res = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", form.username);
      onLogin(form.username);
    } catch { setErr("Authentication failed. Check your credentials."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: tok.black, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "4px", color: tok.gold, textTransform: "uppercase", margin: "0 0 12px" }}>Admin Portal</p>
          <h1 style={{ fontFamily: font, fontSize: "36px", fontWeight: 700, color: tok.white, margin: 0, letterSpacing: "-1px", textTransform: "uppercase" }}>ATELIER</h1>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1.5px", color: tok.gray400, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Username</label>
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required style={{ ...inputStyle, background: "#111", color: tok.white, border: `1px solid #333` }} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1.5px", color: tok.gray400, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ ...inputStyle, background: "#111", color: tok.white, border: `1px solid #333` }} />
          </div>
          {err && <p style={{ fontFamily: mono, fontSize: "11px", color: "#FF6B6B", marginBottom: "16px" }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", background: tok.gold, color: tok.white, border: "none", padding: "14px", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing In..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Product Form (Add / Edit) ────────────────────────────────────────────────
function ProductForm({ product, onSave, onClose, toast }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || CATEGORIES[0],
    image_url: product?.image_url || "",
    limited: product?.limited || false,
    stock: product?.stock ?? 999,
    description: product?.description || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.price || !form.image_url) { toast("Fill in all required fields.", "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      const url = isEdit ? `${API}/products/${product.id}` : `${API}/products`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      toast(isEdit ? "Product updated." : "Product added.", "success");
      onSave(saved);
    } catch { toast("Save failed. Please retry.", "error"); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? `Edit — ${product.name}` : "Add New Product"} onClose={onClose}>
      <Field label="Product Name *">
        <input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="e.g. Pavé Clutch" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Field label="Price (USD) *">
          <input type="number" value={form.price} onChange={e => set("price", e.target.value)} style={inputStyle} placeholder="0.00" min="0" />
        </Field>
        <Field label="Stock Quantity">
          <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} style={inputStyle} min="0" />
        </Field>
      </div>
      <Field label="Category">
        <select value={form.category} onChange={e => set("category", e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Image URL *">
        <input value={form.image_url} onChange={e => set("image_url", e.target.value)} style={inputStyle} placeholder="https://..." />
      </Field>
      {form.image_url && (
        <div style={{ marginBottom: "16px", border: `1px solid ${tok.gray200}` }}>
          <img src={form.image_url} alt="" style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
        </div>
      )}
      <Field label="Description (optional)">
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: font }} placeholder="Brief product description…" />
      </Field>
      <Field label="Limited Edition">
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.limited} onChange={e => set("limited", e.target.checked)} style={{ width: "16px", height: "16px", accentColor: tok.gold, cursor: "pointer" }} />
          <span style={{ fontFamily: font, fontSize: "14px", color: tok.black }}>Mark as Limited Edition</span>
          {form.limited && badge("Limited", tok.goldLight, tok.gold)}
        </label>
      </Field>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button onClick={submit} disabled={saving} style={{ flex: 1, fontFamily: mono, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", background: tok.black, color: tok.white, border: "none", padding: "13px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </button>
        <button onClick={onClose} style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", background: "none", color: tok.gray500, border: `1px solid ${tok.gray300}`, padding: "13px 20px", cursor: "pointer" }}>Cancel</button>
      </div>
    </Modal>
  );
}

// ── Bulk Price Modal ─────────────────────────────────────────────────────────
function BulkPriceModal({ products, onClose, onDone, toast }) {
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("percent"); // percent | fixed
  const [value, setValue] = useState("");
  const [applying, setApplying] = useState(false);

  const affected = category === "All" ? products : products.filter(p => p.category === category);

  const apply = async () => {
    if (!value) { toast("Enter a value.", "error"); return; }
    setApplying(true);
    try {
      await Promise.all(affected.map(async p => {
        const newPrice = mode === "percent"
          ? Math.round(p.price * (1 + parseFloat(value) / 100))
          : Math.round(p.price + parseFloat(value));
        if (newPrice <= 0) return;
        await fetch(`${API}/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify({ ...p, price: newPrice }) });
      }));
      toast(`Updated ${affected.length} products.`, "success");
      onDone();
    } catch { toast("Bulk update failed.", "error"); }
    finally { setApplying(false); }
  };

  const previewPrice = (p) => {
    const v = parseFloat(value) || 0;
    return mode === "percent" ? Math.round(p.price * (1 + v / 100)) : Math.round(p.price + v);
  };

  return (
    <Modal title="Bulk Price Adjustment" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Adjustment Type">
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </Field>
      </div>
      <Field label={mode === "percent" ? "Change % (use negative to decrease)" : "Amount to Add (negative to subtract)"}>
        <input type="number" value={value} onChange={e => setValue(e.target.value)} style={inputStyle} placeholder={mode === "percent" ? "e.g. 10 or -5" : "e.g. 50 or -100"} />
      </Field>
      <div style={{ border: `1px solid ${tok.gray200}`, marginBottom: "20px", maxHeight: "220px", overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: "13px" }}>
          <thead>
            <tr style={{ background: tok.gray100 }}>
              <th style={{ padding: "8px 12px", textAlign: "left", fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: tok.gray500, fontWeight: 400 }}>Product</th>
              <th style={{ padding: "8px 12px", textAlign: "right", fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: tok.gray500, fontWeight: 400 }}>Current</th>
              <th style={{ padding: "8px 12px", textAlign: "right", fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: tok.gray500, fontWeight: 400 }}>New</th>
            </tr>
          </thead>
          <tbody>
            {affected.map((p, i) => {
              const np = previewPrice(p);
              const up = np > p.price;
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? tok.white : tok.gray100, borderBottom: `1px solid ${tok.gray200}` }}>
                  <td style={{ padding: "8px 12px", color: tok.black }}>{p.name}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", color: tok.gray500 }}>{fmt(p.price)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", color: value ? (up ? tok.green : tok.red) : tok.gray500, fontWeight: value ? 700 : 400 }}>{value ? fmt(np) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={apply} disabled={applying} style={{ flex: 1, fontFamily: mono, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", background: tok.black, color: tok.white, border: "none", padding: "13px", cursor: "pointer", opacity: applying ? 0.6 : 1 }}>
          {applying ? "Applying..." : `Apply to ${affected.length} Products`}
        </button>
        <button onClick={onClose} style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", background: "none", color: tok.gray500, border: `1px solid ${tok.gray300}`, padding: "13px 20px", cursor: "pointer" }}>Cancel</button>
      </div>
    </Modal>
  );
}

// ── Orders Panel ─────────────────────────────────────────────────────────────
function OrdersPanel({ toast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulate admin orders endpoint using the existing /orders
    fetch(`${API}/orders`, { headers: authHeader() })
      .then(r => r.json()).then(setOrders).catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    o.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  );

  const total = orders.reduce((s, o) => s + o.price_at_purchase * o.quantity, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Revenue", value: fmt(total) },
          { label: "Avg Order Value", value: orders.length ? fmt(total / orders.length) : "$0" },
        ].map(s => (
          <div key={s.label} style={{ background: tok.gray100, padding: "20px", border: `1px solid ${tok.gray200}` }}>
            <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: tok.gray500, margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ fontFamily: font, fontSize: "24px", fontWeight: 700, color: tok.black, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: "16px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or product…" style={{ ...inputStyle, maxWidth: "360px" }} />
      </div>
      {loading ? (
        <p style={{ fontFamily: mono, fontSize: "11px", color: tok.gray400 }}>Loading orders…</p>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: mono, fontSize: "11px", color: tok.gray400 }}>No orders found.</p>
      ) : (
        <div style={{ border: `1px solid ${tok.gray200}`, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: "13px" }}>
            <thead>
              <tr style={{ background: tok.gray100, borderBottom: `1px solid ${tok.gray200}` }}>
                {["Order ID", "Product", "Qty", "Price", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: tok.gray500, fontWeight: 400, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} style={{ background: i % 2 === 0 ? tok.white : tok.bg, borderBottom: `1px solid ${tok.gray100}` }}>
                  <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: "12px", color: tok.gray500 }}>#{o.id}</td>
                  <td style={{ padding: "10px 14px", color: tok.black }}>{o.product_name}</td>
                  <td style={{ padding: "10px 14px", color: tok.gray600 }}>{o.quantity}</td>
                  <td style={{ padding: "10px 14px", color: tok.black, fontWeight: 700 }}>{fmt(o.price_at_purchase * o.quantity)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    {badge(o.status, o.status === "Paid" ? tok.greenLight : tok.amberLight, o.status === "Paid" ? tok.green : tok.amber)}
                  </td>
                  <td style={{ padding: "10px 14px", color: tok.gray500, fontFamily: mono, fontSize: "11px" }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [user, setUser] = useState(() => localStorage.getItem("username") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "bulk" | "confirm"
  const [editProduct, setEditProduct] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      setProducts(await res.json());
    } catch { toast("Could not load products.", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchProducts(); }, [user]);

  if (!user) return <AdminLogin onLogin={setUser} />;

  // ── Derived ────────────────────────────────────────────────────────────────
  const displayed = products
    .filter(p => catFilter === "All" || p.category === catFilter)
    .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = products.reduce((s, p) => s + p.price, 0);
  const avgPrice = products.length ? totalRevenue / products.length : 0;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDelete = (p) => {
    setConfirmData({
      message: `Remove "${p.name}" from the catalogue? This cannot be undone.`,
      onConfirm: async () => {
        setModal(null); setConfirmData(null);
        try {
          await fetch(`${API}/products/${p.id}`, { method: "DELETE", headers: authHeader() });
          setProducts(ps => ps.filter(x => x.id !== p.id));
          toast("Product removed.");
        } catch { toast("Delete failed.", "error"); }
      }
    });
    setModal("confirm");
  };

  const handleSave = (saved) => {
    setProducts(ps => {
      const idx = ps.findIndex(x => x.id === saved.id);
      if (idx >= 0) { const n = [...ps]; n[idx] = saved; return n; }
      return [...ps, saved];
    });
    setModal(null); setEditProduct(null);
  };

  const handleBulkDone = () => { setModal(null); fetchProducts(); };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: tok.bg, fontFamily: font }}>

      {/* Top Bar */}
      <div style={{ background: tok.black, height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontFamily: font, fontSize: "14px", fontWeight: 700, color: tok.white, letterSpacing: "4px", textTransform: "uppercase" }}>ATELIER</span>
          <span style={{ fontFamily: mono, fontSize: "9px", color: tok.gold, letterSpacing: "2px", textTransform: "uppercase" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontFamily: mono, fontSize: "10px", color: tok.gray400, letterSpacing: "0.5px" }}>{user}</span>
          <button onClick={logout} style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: "none", border: `1px solid #333`, color: tok.gray400, padding: "6px 14px", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      {/* Page Header */}
      <div style={{ background: tok.white, borderBottom: `1px solid ${tok.gray200}`, padding: "0 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                fontFamily: mono, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
                background: "none", border: "none", cursor: "pointer", padding: "18px 24px",
                borderBottom: `2px solid ${tab === t.key ? tok.black : "transparent"}`,
                color: tab === t.key ? tok.black : tok.gray400,
              }}>
                {t.label}
              </button>
            ))}
          </div>
          <span style={{ fontFamily: mono, fontSize: "9px", color: tok.gray400, letterSpacing: "1px" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Total Products", value: products.length },
                { label: "Categories", value: CATEGORIES.length },
                { label: "Avg Price", value: fmt(avgPrice) },
                { label: "Limited Editions", value: products.filter(p => p.limited).length },
              ].map(s => (
                <div key={s.label} style={{ background: tok.white, border: `1px solid ${tok.gray200}`, padding: "20px 24px" }}>
                  <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: tok.gray400, margin: "0 0 10px" }}>{s.label}</p>
                  <p style={{ fontFamily: font, fontSize: "26px", fontWeight: 700, color: tok.black, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ ...inputStyle, maxWidth: "280px" }} />
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inputStyle, maxWidth: "200px", appearance: "none", cursor: "pointer" }}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                <button onClick={() => setModal("bulk")} style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: "none", border: `1px solid ${tok.gray300}`, color: tok.gray600, padding: "9px 18px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  Bulk Adjust Prices
                </button>
                <button onClick={() => { setEditProduct(null); setModal("add"); }} style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: tok.black, color: tok.white, border: "none", padding: "9px 20px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  + Add Product
                </button>
              </div>
            </div>

            {/* Count */}
            <p style={{ fontFamily: mono, fontSize: "10px", color: tok.gray400, marginBottom: "12px" }}>
              {displayed.length} {displayed.length === 1 ? "item" : "items"}{catFilter !== "All" ? ` in ${catFilter}` : ""}
            </p>

            {/* Product Grid */}
            {loading ? (
              <p style={{ fontFamily: mono, fontSize: "11px", color: tok.gray400, padding: "40px 0" }}>Loading catalogue…</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2px", background: tok.gray200 }}>
                {displayed.map(p => (
                  <div key={p.id} style={{ background: tok.white, padding: "0" }}>
                    {/* Image */}
                    <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: tok.gray100 }}>
                      <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "6px" }}>
                        {p.limited && badge("Limited", tok.gold, tok.white)}
                        {(p.stock !== undefined && p.stock < 10) && badge("Low Stock", tok.redLight, tok.red)}
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: "16px 16px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                        <p style={{ fontFamily: font, fontSize: "15px", fontWeight: 700, color: tok.black, margin: 0, lineHeight: 1.2 }}>{p.name}</p>
                        <p style={{ fontFamily: mono, fontSize: "13px", color: tok.black, margin: 0, fontWeight: 700, whiteSpace: "nowrap", marginLeft: "8px" }}>{fmt(p.price)}</p>
                      </div>
                      <p style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: tok.gray400, margin: "0 0 12px" }}>{p.category}</p>
                      {p.stock !== undefined && (
                        <p style={{ fontFamily: mono, fontSize: "10px", color: p.stock < 10 ? tok.red : tok.gray400, margin: "0 0 12px" }}>Stock: {p.stock}</p>
                      )}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => { setEditProduct(p); setModal("edit"); }} style={{ flex: 1, fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: tok.black, color: tok.white, border: "none", padding: "8px", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDelete(p)} style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: "none", color: tok.red, border: `1px solid ${tok.red}`, padding: "8px 14px", cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && <OrdersPanel toast={toast} />}

      </div>

      {/* Modals */}
      {modal === "add" && <ProductForm onSave={handleSave} onClose={() => setModal(null)} toast={toast} />}
      {modal === "edit" && editProduct && <ProductForm product={editProduct} onSave={handleSave} onClose={() => { setModal(null); setEditProduct(null); }} toast={toast} />}
      {modal === "bulk" && <BulkPriceModal products={products} onClose={() => setModal(null)} onDone={handleBulkDone} toast={toast} />}
      {modal === "confirm" && confirmData && <Confirm message={confirmData.message} onConfirm={confirmData.onConfirm} onCancel={() => { setModal(null); setConfirmData(null); }} />}

      <Toast toasts={toasts} />

      <style>{`
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${tok.gold}; outline-offset: -1px; }
        @media (max-width: 768px) {
          [data-stat-grid] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
