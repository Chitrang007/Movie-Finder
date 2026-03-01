import React, { useState } from 'react';
import './SearchBar.css';
import { Result } from './Result';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); 
    
    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const searchResponse = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
            const searchData = await searchResponse.json();
            if (searchData.Search) {
                const detailedMovies = await Promise.all(searchData.Search.map(async (movie) => {
                    const detailResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
                    const detailData = await detailResponse.json();
                    return {
                        id: movie.imdbID,
                        title: movie.Title,
                        year: movie.Year,
                        image: movie.Poster !== "N/A" ? movie.Poster : "",
                        plot: detailData.Plot,
                        rating: detailData.imdbRating
                    };
                }));
                setMovies(detailedMovies);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };
    
    return ( 
        <div className='search-parent'>
            <div className="input-wrapper">
                <input
                className='input-field'
                type='text'
                value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search any movie..."/>
                <button 
                className="search-button"
                onClick={handleSearch}
                disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </div>
        {hasSearched ? 
        ( <Result movies={movies} /> ) :
        ( <div className="welcome-msg"> <p>Search for your favorite movie to get started!</p> </div> )} 
    </div>
    );
};