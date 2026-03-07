import React, { useState } from 'react';
import './App.css';
import { SearchBar } from './components/SearchBar';

function App() {
  const [view, setView] = useState('home');
  const [favCount, setFavCount] = useState(0);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo" onClick={() => setView('home')}>
            <img src="/logo1.png" alt="CineStream Logo" className="logo-img" />
            CineStream
          </div>
          <div className="nav-links">
            <button
              className={`nav-btn ${view === 'home' ? 'active' : ''}`}
              onClick={() => setView('home')}
            >
              Home
            </button>
            <button
              className={`nav-btn ${view === 'favorites' ? 'active' : ''}`}
              onClick={() => setView('favorites')}
            >
              WatchList ({favCount})
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
        />
      </div>
    </div>
  );
}

export default App;