import React, { useState } from 'react';
import './App.css';
import { SearchBar } from './components/classic/SearchBar';
import { SearchBarTMDB } from './components/pro/SearchBarPro';

function App() {
  const [view, setView] = useState('home');
  const [favCount, setFavCount] = useState(0);
  const [classicResetKey, setClassicResetKey] = useState(0);
  const [homeResetKey, setHomeResetKey] = useState(0);

  const goHome = () => {
    setView('home');
    setHomeResetKey((k) => k + 1);
  };

  const goClassic = () => {
    setView('classic');
    setClassicResetKey((k) => k + 1);
  };

  return (
    <div className='App'>
      <nav className='navbar'>
        <div className='nav-content'>
          <div className='logo' onClick={goHome} style={{ cursor: 'pointer' }}>
            <img src='/logo1.png' alt='CineStream Logo' className='logo-img' />
            CMDB | Cinematic Movie Discovery Bureau
          </div>
          
          <div className='nav-links'>
            <button
              className={`nav-btn beta-nav-btn ${view === 'home' ? 'active' : ''}`}
              onClick={goHome}
            >
              CMDB Pro
            </button>
            
            <button
              className={`nav-btn ${view === 'classic' ? 'active' : ''}`}
              onClick={goClassic}
            >
              CMDB Classic
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
        {view === 'home' && (
          <div className='Header Header-beta'>
            CMDB Pro: Plot Based Discovery Bureau.
          </div>
        )}
        {view === 'classic' && (
          <div className='Header Header-classic'>
            CMDB Classic: Multi-Source API Orchestration.
          </div>
        )}
        {view === 'favorites' && (
          <div className='Header Header-favorites'>Your Cinematic Vault.</div>
        )}

        {view === 'home' ? (
          <SearchBarTMDB 
            key='pro-engine-active' 
            currentView='home'
            onFavoritesChange={(count) => setFavCount(count)}
            betaResetKey={homeResetKey}
          />
        ) : view === 'favorites' ? (
          <SearchBarTMDB 
            key='favorites-engine-active'
            currentView='favorites'
            onFavoritesChange={(count) => setFavCount(count)}
            betaResetKey={homeResetKey}
          />
        ) : (
          <SearchBar
            placeholder='Browse movies or series titles...'
            currentView='classic'
            onFavoritesChange={(count) => setFavCount(count)}
            homeResetKey={classicResetKey}
          />
        )}
      </div>
    </div>
  );
}

export default App;