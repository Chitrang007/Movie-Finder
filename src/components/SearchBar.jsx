import React from 'react';
import './SearchBar.css';

export const SearchBar = () => {
    return (
        <div className="input-wrapper">
            <input placeholder="Enter plot here..."/>
            <button className="search-button">Search</button>
        </div>
    );
}