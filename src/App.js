import React, { useState } from 'react';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { SearchBarTMDB } from './components/tmdb/SearchBarTMDB';

function App() {
  const [view, setView] = useState('beta');
  const [favCount, setFavCount] = useState(0);
  const [homeResetKey, setHomeResetKey] = useState(0);
  const [betaResetKey, setBetaResetKey] = useState(0);

  const goHome = () => {
    setView('home');
    setHomeResetKey((k) => k + 1);
  };

  const goPro = () => {
    setView('beta');
    setBetaResetKey((k) => k + 1);
  };

  return (
    <div className='App'>
      <nav className='navbar'>
        <div className='nav-content'>
          <div className='logo' onClick={goPro} style={{ cursor: 'pointer' }}>
            <img src='/logo1.png' alt='CineStream Logo' className='logo-img' />
            CMDB | Chitrang's Movie Database
          </div>
          <div className='nav-links'>
            <button
              className={`nav-btn beta-nav-btn ${view === 'beta' ? 'active' : ''}`}
              onClick={goPro}
            >
              CMDB Pro
            </button>
            
            <button
              className={`nav-btn ${view === 'home' ? 'active' : ''}`}
              onClick={goHome}
            >
              CMDB
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

      <div className='main-container'>
        {/* Header Logic: Ordered to match the new flow */}
        {view === 'beta' && <div className='Header Header-beta'>CMDB Pro: Plot Based Discovery.</div>}
        {view === 'home' && <div className='Header'>Classic CMDB Search. Find a stream.</div>}
        {view === 'favorites' && <div className='Header'>Your CMDB Vault.</div>}

        {view === 'beta' ? (
          <SearchBarTMDB 
            key="pro-engine-active" 
            currentView={view}
            onFavoritesChange={(count) => setFavCount(count)}
            betaResetKey={betaResetKey}
          />
        ) : view === 'favorites' ? (
          <SearchBarTMDB 
            key="favorites-engine-active"
            currentView='favorites'
            onFavoritesChange={(count) => setFavCount(count)}
            betaResetKey={betaResetKey}
          />
        ) : (
          <SearchBar
            placeholder='Browse movies or series titles...'
            currentView={view}
            onFavoritesChange={(count) => setFavCount(count)}
            homeResetKey={homeResetKey}
          />
        )}
      </div>
    </div>
  );
}

export default App;