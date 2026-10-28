# Dish Cult Redesign — Hand-Crafted Agency Build

A premium redesign and modern frontend engineering of [Dish Cult](https://dishcult.com) — the table-booking and culinary discovery platform powered by **ResDiary**, operating across the UK, Ireland, Australia, New Zealand, and Asia.

Crafted with an **"Ember Night"** aesthetic (candle-lit dining ambience, rich `#0B0B0D` ink background, Fraunces editorial serif typography, and tactile Framer Motion micro-interactions), designed mobile-first for discerning diners and restaurateurs.

---

## 🌟 Key Features

- **Editorial Culinary Experience**:
  - Bespoke **"Ember Night"** visual identity with custom radial embers, subtle film grain noise, and high-contrast typography.
  - Interactive loader with SVG brand gradient draw-in, animated progress counter, and circular expansion reveal.
  - Sticky glass navbar with adaptive scroll detection, route transitions, and responsive mobile navigation sheet.
- **Search & Discovery**:
  - Global Command Palette (`Cmd+K` / search button) with instant restaurant, city, dish, and dietary filtering.
  - ResDiary-inspired table booking bar with party size, date picker, sitting time, and quick location search.
  - Explore view with interactive grid/list view and **Google Maps Platform** dynamic pins with real-time infowindows.
- **Restaurant Showcase**:
  - Comprehensive restaurant detail view featuring Glasgow's **vin18** (Rutherglen) and curated dining institutions across Dublin, London, Edinburgh, Melbourne, Sydney, and Singapore.
  - Interactive time-slot reservation system with instant confirmation.
  - Signature dish ordering rail with instant cart drawer integration.
- **E-Commerce & Experiences**:
  - Chef's tasting masterclasses, pairing dinners, and digital gift voucher purchasing.
  - Slide-out Cart Drawer with item counters, promo code support (`DISHCULT10` for 10% off), service charge breakdown, and undo notifications.
  - One-click checkout simulation with celebratory confetti burst.
- **Google Maps Platform Integration**:
  - High-performance, secure serverless proxy endpoints (`/api/places`, `/api/place`, `/api/photo`) keeping server API keys hidden from client-side bundles.
  - Built with `@vis.gl/react-google-maps` supporting custom dark-mode styling, markers, and attribution.
  - Graceful typed local mock fallback ensuring a flawless experience even in offline or unauthenticated environments.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Local Development

Start the full-stack Express + Vite development server:

```bash
npm run dev
```

The applet will boot at `http://localhost:3000`.

### 3. Production Build

Verify TypeScript compilation and generate the optimized production bundle:

```bash
npm run build
```

To run the production server:

```bash
npm start
```

---

## 🗺️ Google Maps Platform Setup

This project uses Google Maps Platform for restaurant geocoding, nearby discovery, and interactive maps.

### Environment Variables

Configure your keys in your `.env` or deployment environment:

```env
# 1. Server-Side Key (For Places API New serverless proxy)
GOOGLE_PLACES_SERVER_KEY="YOUR_SERVER_API_KEY"

# 2. Browser Key (For @vis.gl/react-google-maps client rendering)
VITE_GOOGLE_MAPS_BROWSER_KEY="YOUR_BROWSER_API_KEY"
VITE_GOOGLE_MAPS_API_KEY="YOUR_BROWSER_API_KEY"
VITE_GOOGLE_MAP_ID="DEMO_MAP_ID"
```

### Recommended Key Restrictions

1. **Browser Key (`VITE_GOOGLE_MAPS_BROWSER_KEY`)**:
   - **Application Restriction**: HTTP Referrers (`https://your-domain.vercel.app/*`, `http://localhost:3000/*`).
   - **API Restriction**: Restrict to **Maps JavaScript API**.
2. **Server Key (`GOOGLE_PLACES_SERVER_KEY`)**:
   - **Application Restriction**: IP addresses of your hosting environment or unrestricted server environment.
   - **API Restriction**: Restrict to **Places API (New)**.

---

## ☁️ Vercel Deployment Guide

This project includes a pre-configured `vercel.json` with SPA routing rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps to Deploy:

1. **Push to GitHub / GitLab / Bitbucket**.
2. **Import Project into Vercel**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Set Environment Variables**:
   - Add `GOOGLE_PLACES_SERVER_KEY` and `VITE_GOOGLE_MAPS_BROWSER_KEY` in **Project Settings > Environment Variables**.
4. **Deploy**:
   - Click **Deploy**. Vercel will bundle the client assets and configure the SPA rewrite rules.

---

## 📂 Project Structure

```
├── api/                  # Serverless proxy functions for Google Places API (New)
│   ├── photo.ts          # Photo relay proxy with 86400s CDN caching
│   ├── place.ts          # Place details proxy with field masking
│   └── places.ts         # Places search & nearby query proxy
├── public/               # Static assets & official Dish Cult vector logos
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── cart/         # Cart drawer, vouchers, & checkout slide-overs
│   │   ├── layout/       # Sticky Navbar, footer, breadcrumbs, scroll indicators
│   │   ├── map/          # @vis.gl/react-google-maps interactive components
│   │   ├── sections/     # Modular editorial landing & marketing sections
│   │   └── ui/           # Logo, SmartImage, CustomCursor, SearchModal, Toast
│   ├── data/             # Typed datasets: cities, restaurants, dishes, experiences
│   ├── hooks/            # Scroll, lock-body, and responsive media hooks
│   ├── lib/              # Google Places API client with mock fallback
│   ├── pages/            # Multi-page views (Home, Explore, Detail, City, Checkout, etc.)
│   ├── store/            # Zustand stores (Cart with localStorage, Favorites, Toasts)
│   ├── types/            # Strict TypeScript interfaces and schemas
│   ├── App.tsx           # Route definitions, suspense boundaries, & theme wrapper
│   ├── index.css         # Tailwind CSS imports & bespoke utility classes
│   └── main.tsx          # Application entrypoint
├── server.ts             # Express development & production server
├── tailwind.config.ts    # Custom "Ember Night" color & typography theme tokens
├── vercel.json           # Vercel SPA rewrite configuration
└── vite.config.ts        # Vite configuration with React & Tailwind plugins
```

---

## 📄 License & Attribution

- Powered by **ResDiary** reservation integration architecture.
- Built for **Dish Cult** (an Access Group company).
- Code licensed under Apache 2.0.
