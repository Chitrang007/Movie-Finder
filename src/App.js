import React, { useState } from 'react';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { SearchBarTMDB } from './components/tmdb/SearchBarTMDB';

function App() {
  // 'home' is now the TMDB Pro view, 'classic' is the OMDb view
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
            CMDB | Chitrang's Movie Database
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
        {/* Header Logic: Highlighting the Pro and Classic distinction */}
        {view === 'home' && <div className='Header Header-beta'>CMDB Pro: Plot Based Discovery.</div>}
        {view === 'classic' && <div className='Header'>CMDB Classic: Title Search. Find a stream.</div>}
        {view === 'favorites' && <div className='Header'>Your CMDB Vault.</div>}

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