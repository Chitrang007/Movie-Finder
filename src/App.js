import React, { useState } from 'react';
import './App.css';
import { SearchBar } from './components/SearchBar';

function App() {
  const [view, setView] = useState('home');
  const [favCount, setFavCount] = useState(0);
  const [homeResetKey, setHomeResetKey] = useState(0);

  const goHome = () => {
    setView('home');
    setHomeResetKey((k) => k + 1);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo" onClick={goHome}>
            <img src="/logo1.png" alt="CineStream Logo" className="logo-img" />
            CMDB | Chitrang's Movie Database
          </div>
          <div className="nav-links">
            <button
              className={`nav-btn ${view === 'home' ? 'active' : ''}`}
              onClick={goHome}
            >
              Home
            </button>
            <button
              className={`nav-btn ${view === 'favorites' ? 'active' : ''}`}
              onClick={() => setView('favorites')}
            >
              My List ({favCount})
            </button>
          </div>
        </div>
      </nav>
      <div className="main-container">
        {view === 'home' && <div className="Header">Search a movie. Find a stream.</div>}

        <SearchBar
          placeholder="Browse movies or series titles..."
          currentView={view}
          onFavoritesChange={(count) => setFavCount(count)}
          homeResetKey={homeResetKey}
        />
      </div>
    </div>
  );
}

export default App;