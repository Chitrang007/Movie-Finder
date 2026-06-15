# CMDB PRO – Cinematic Movie Discovery Bureau

Live - https://cmdb-engine.vercel.app/

**CMDB PRO** is a high-performance, React-based cinematic exploration platform. IIt operates as a sophisticated **Dual-Engine system** orchestrating data from both OMDb and TMDB to provide deep metadata, real-time streaming availability, and a professional-grade "Bureau" interface.

---
# Screenshots

**PRO**

<img width="1279" height="656" alt="image" src="https://github.com/user-attachments/assets/1f939d9e-8f82-4e94-aabc-ab55fced040d" />
<img width="1915" height="1010" alt="image" src="https://github.com/user-attachments/assets/2fac62a3-1d57-4c83-bbe6-4b507e2dfb76" />


**CLASSIC**
<img width="1277" height="650" alt="image" src="https://github.com/user-attachments/assets/d46d3c21-35f0-4431-8e60-002a9cf098a1" />
<img width="1278" height="651" alt="image" src="https://github.com/user-attachments/assets/51197f96-f8a7-4605-93f9-a8e2b4b23b43" />


**LIST VIEW**
<img width="1274" height="643" alt="image" src="https://github.com/user-attachments/assets/e6d3fe2d-e420-495a-b4ac-0800b6f53b89" />
<img width="1275" height="651" alt="image" src="https://github.com/user-attachments/assets/b17b75e1-549f-4445-8c09-381c78fafe59" />

# 🎥 Demo
<img width="1080" height="522" alt="cmdb-enigine_demo-1" src="https://github.com/user-attachments/assets/02105766-7795-4c5a-9faa-15f892061faa" />

---

## 🚀 Key Features

* **Dual-Engine Intelligence**: 
    * **CMDB Classic**: Leverages **OMDb** for lightweight, title-focused IMDb data.
    * **CMDB PRO**: Utilizes **TMDB** for high-fidelity backdrops, trending lists, and multi-search capabilities.
* **Natural Language Plot Search**: Search using descriptions (e.g., "dream inside a dream") instead of just titles, powered by a custom scoring algorithm.
* **Cinematic Modal Experience**: 
    * Dynamic backdrop blurring and "Netflix-style" layout.
    * **Watch Availability**: Real-time "Where to Watch" data (Netflix, Prime, Disney+, etc.).
    * **Series Intelligence**: Deep-link tracking for TV seasons and episode runtimes.
* **Persistent Collection**: A browser-based **Watchlist** that survives refreshes, categorized into "Classic" and "Pro" selections.
* **Smart State Management**: Synchronized watchlist counts across the Navbar and Search components.
* **ISP-Block Resilience**: Integrated a custom Reverse Proxy architecture to bypass regional DNS filtering and ensure 100% uptime for TMDB data and images.
* **Serverless API Shielding**: Implemented Vercel Serverless Functions to handle API requests securely, ensuring keys are never exposed in the client-side network tab.
* **Image Delivery Optimization**: mplemented **Eager Loading** for critical UI assets (Posters/Logos) within modals and lists to ensure instant rendering in production environments.
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
