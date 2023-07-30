import React from 'react';
import './App.css';
import { SearchBar } from './components/SearchBar';
 

function App() {
  return (
    <div className="App">
      <div className="Header"> What's that movie where...</div>
      <div className="Search-Bar">
        <SearchBar />
      </div>
    </div>
  );
}

export default App;
