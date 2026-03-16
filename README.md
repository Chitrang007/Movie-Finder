# CMDB PRO – Chitrang's Movie Database

**CMDB PRO** is a high-performance, React-based cinematic exploration platform. It goes beyond simple searching by utilizing a **Dual-Engine API system** (OMDb + TMDB) to provide deep metadata, streaming availability, and a professional-grade user interface.

---

## 🚀 Key Features

* **Dual-Engine Intelligence**: 
    * **CMDB Classic**: Powered by **OMDb** for lightweight, title-focused IMDb data.
    * **CMDB PRO**: Powered by **TMDB** for high-fidelity backdrops, trending lists, and multi-search capabilities.
* **Natural Language Plot Search**: Search using descriptions (e.g., "dream inside a dream") instead of just titles, powered by a custom scoring algorithm.
* **Cinematic Modal Experience**: 
    * Dynamic backdrop blurring and "Netflix-style" layout.
    * **Watch Availability**: Real-time "Where to Watch" data (Netflix, Prime, Disney+, etc.).
    * Season and Episode tracking for TV Series.
* **Persistent Collection**: A browser-based **Watchlist** that survives refreshes, categorized into "Classic" and "Pro" selections.
* **Smart State Management**: Synchronized watchlist counts across the Navbar and Search components.
* **ISP-Block Resilience**: Integrated a custom Reverse Proxy architecture to bypass regional DNS filtering and ensure 100% uptime for TMDB data and images.
* **Serverless API Shielding**: Implemented Vercel Serverless Functions to handle API requests securely, ensuring keys are never exposed in the client-side network tab.
* **Image Delivery Optimization**: Native browser **Lazy Loading** implemented for all movie posters and streaming logos to minimize bandwidth and maximize performance.
* **Environment-Aware Hybrid Routing**: Smart context-switching logic that automatically detects the environment and routes traffic through either the local Go microservice or Vercel Edge functions.

---

## 🛠 Tech Stack

* **Frontend**: React.js (Hooks, Functional Components)
* **Animations**: Framer Motion (Modals & Transitions)
* **Icons**: React Icons (HiPlus, HiCheck, HiX)
* **Data Sources**: 
    * **The Movie Database (TMDB) API v3** (Primary Pro Source)
    * **Open Movie Database (OMDb) API** (Classic Source)
* **Deployment**: Vercel (CI/CD)
* **Backend (Local Proxy)**: Go (Golang)
* **Backend (Production)**: Vercel Serverless Functions (Node.js)
* **Middleware**: `godotenv` for secure secrets management.

---

## 🏗 Architecture

* CMDB PRO utilizes a **Multi-Service Architecture**. Locally, a **Go-based microservice** acts as a secure bridge to bypass ISP-level restrictions. In production, requests are routed through **Vercel Edge Rewrites and Serverless Functions**, creating a "Forever Fix" for API connectivity issues while keeping sensitive metadata hidden from the browser.
* This hybrid approach ensures that the development experience is identical to the production environment, abstracting the complexity of API authentication and networking away from the UI layer.

---

## 🔒 Security & Best Practices
* **Zero-Leak Policy**: API keys are never exposed in the client-side JavaScript bundle or the browser's Network tab.
* **Backend Authentication**: All TMDB requests are authenticated server-side, preventing unauthorized use of API quotas.
* **Stateless Proxying**: Neither the Go proxy nor the Vercel function stores user data, ensuring a privacy-first experience.

---

## ⚡ Performance
* **Framer Motion Integration**: Optimized animations using AnimatePresence for smooth modal mounting/unmounting.
* **Asset Optimization**: High-fidelity backdrops are served via a delegated image proxy to handle resolution scaling effectively.
* **Scoring Logic**: Custom weighted algorithm that prioritizes title matches over overview descriptions for highly accurate search results.

---

## ⚙️ Environment Variables

To run this project locally, you must create a `.env` file in the root directory and add your API keys:

```env
REACT_APP_OMDB_API_KEY=your_omdb_key_here
REACT_APP_TMDB_API_KEY=your_tmdb_key_here

### Installation

# Clone the repository
git clone <repo-url>
cd Movie-Finder

# Install dependencies
npm install

# Initialize Go modules (if running for the first time)
cd proxy-server
go mod tidy
cd ..

# Terminal 1: Start the Go Proxy Tunnel
cd proxy-server
go run main.go

# Terminal 2: Start the React Frontend
npm start
