<div align="center">

<br/>

```
██╗     ██╗   ██╗██╗  ██╗██╗   ██╗██████╗ ██╗   ██╗
██║     ██║   ██║╚██╗██╔╝██║   ██║██╔══██╗╚██╗ ██╔╝
██║     ██║   ██║ ╚███╔╝ ██║   ██║██████╔╝ ╚████╔╝ 
██║     ██║   ██║ ██╔██╗ ██║   ██║██╔══██╗  ╚██╔╝  
███████╗╚██████╔╝██╔╝ ██╗╚██████╔╝██║  ██║   ██║   
╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝  
```

### *A Full-Stack Luxury E-Commerce Experience*

<br/>

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](LICENSE)

<br/>

> *"Design is not just what it looks like and feels like. Design is how it works."*
> — Steve Jobs

<br/>

---

</div>

## &nbsp;&nbsp;Overview

A minimalist, high-end e-commerce platform engineered for luxury brands. Every interaction — from product discovery to checkout — is crafted with a singular focus: **elegant simplicity**. Inspired by the visual language of Balenciaga, Bottega Veneta, and Loro Piana, this platform translates haute couture aesthetics into a seamless digital experience.

**Black. Gold. Deliberate.**

<br/>

---

## &nbsp;&nbsp;✦ &nbsp;Features

<br/>

### &nbsp;&nbsp;🛍️ &nbsp;Client Experience

| Feature | Description |
|---|---|
| **Minimalist Interface** | Typographic-first design with a refined Black & Gold palette |
| **Guided Checkout** | Frictionless multi-step flow engineered for high conversion |
| **Product Gallery** | High-resolution imagery with interactive `ProductCard` components |
| **Responsive Cart Drawer** | Sleek `CartDrawer` for instant item management without page interruption |
| **Authentication** | Secure JWT-based signup and login with session persistence |

<br/>

### &nbsp;&nbsp;🛡️ &nbsp;Technical Architecture

| Feature | Description |
|---|---|
| **Full-Stack Integration** | FastAPI (Python) backend serving a high-performance React + Vite frontend |
| **Secure Auth System** | JWT (JSON Web Tokens) with protected routes and role-based access |
| **Admin Dashboard** | Dedicated panel for inventory management and real-time order tracking |
| **OCR Integration Ready** | Engineered to integrate with **ClaimMaster** for automated receipt & invoice recognition |
| **RESTful API Design** | Clean, versioned endpoints following industry-standard conventions |

<br/>

---

## &nbsp;&nbsp;🛠️ &nbsp;Tech Stack

<br/>

```
┌─────────────────────────────────────────────────────┐
│                    ARCHITECTURE                      │
├──────────────┬──────────────────────────────────────┤
│  Frontend    │  React 18 · Vite · React Router       │
│              │  Axios · Tailwind CSS                 │
├──────────────┼──────────────────────────────────────┤
│  Backend     │  FastAPI · Python 3.10+ · Uvicorn     │
├──────────────┼──────────────────────────────────────┤
│  Database    │  PostgreSQL · SQLAlchemy (ORM)        │
│              │  MongoDB Atlas (via Motor) [optional] │
├──────────────┼──────────────────────────────────────┤
│  Auth        │  JWT · OAuth2 Password Flow           │
├──────────────┼──────────────────────────────────────┤
│  DevOps      │  Git · RESTful API · CORS Middleware  │
└──────────────┴──────────────────────────────────────┘
```

<br/>

---

## &nbsp;&nbsp;🚀 &nbsp;Getting Started

<br/>

### &nbsp;&nbsp;Prerequisites

- Python `3.10+`
- Node.js `18+`
- PostgreSQL (running instance)

<br/>

### &nbsp;&nbsp;1 · Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Luxury-E-Commerce-Platform.git
cd Luxury-E-Commerce-Platform
```

<br/>

### &nbsp;&nbsp;2 · Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# .\venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# → Edit .env with your DATABASE_URL and SECRET_KEY

# Start the development server
uvicorn main:app --reload
```

> API will be live at **`http://localhost:8000`** · Swagger docs at **`/docs`**

<br/>

### &nbsp;&nbsp;3 · Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

> App will be live at **`http://localhost:5173`**

<br/>

---

## &nbsp;&nbsp;📸 &nbsp;UI Showcase

<br/>

<div align="center">

*Screenshots coming soon — stay tuned.*

<!-- Replace the comments below with your actual screenshots -->
<!--
<img src="./assets/screenshot-home.png" width="80%" alt="Homepage" />
<br/><br/>
<img src="./assets/screenshot-product.png" width="80%" alt="Product Page" />
<br/><br/>
<img src="./assets/screenshot-checkout.png" width="80%" alt="Checkout Flow" />
-->

</div>

<br/>

---

## &nbsp;&nbsp;📁 &nbsp;Project Structure

```
Luxury-E-Commerce-Platform/
├── backend/
│   ├── main.py               # FastAPI entry point
│   ├── models/               # SQLAlchemy models
│   ├── routers/              # API route handlers
│   ├── schemas/              # Pydantic schemas
│   ├── auth/                 # JWT authentication logic
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ProductCard/
│   │   │   ├── CartDrawer/
│   │   │   └── AdminDashboard/
│   │   ├── pages/            # Route-level page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # Axios API service layer
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

<br/>

---

## &nbsp;&nbsp;🗺️ &nbsp;Roadmap

- [x] Core product listing & detail pages
- [x] Shopping cart with persistent state
- [x] JWT authentication & protected routes
- [x] Admin dashboard — inventory & orders
- [ ] Payment gateway integration (Stripe)
- [ ] OCR receipt scanning via ClaimMaster
- [ ] Wishlist & saved items
- [ ] Product reviews & ratings
- [ ] Email notifications (order confirmation)
- [ ] Deployment — Railway / Vercel / Docker

<br/>

---

## &nbsp;&nbsp;🤝 &nbsp;Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or raise an issue to start a discussion.

<br/>

---

<div align="center">

<br/>

**Crafted with precision by**

### Tang Kit Loon

[![GitHub](https://img.shields.io/badge/GitHub-@YOUR__USERNAME-181717?style=flat-square&logo=github)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/YOUR_PROFILE)

<br/>

*© 2025 Tang Kit Loon · MIT License*

<br/>

</div>
