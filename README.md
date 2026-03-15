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

---

## 🛠 Tech Stack

* **Frontend**: React.js (Hooks, Functional Components)
* **Animations**: Framer Motion (Modals & Transitions)
* **Icons**: React Icons (HiPlus, HiCheck, HiX)
* **Data Sources**: 
    * **The Movie Database (TMDB) API v3** (Primary Pro Source)
    * **Open Movie Database (OMDb) API** (Classic Source)
* **Deployment**: Vercel (CI/CD)

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
