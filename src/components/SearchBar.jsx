import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { Result } from './Result';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export const SearchBar = ({ placeholder, currentView, onFavoritesChange }) => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('cine-favs');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cine-favs', JSON.stringify(favorites));
        if (onFavoritesChange) {
            onFavoritesChange(favorites.length);
        }
    }, [favorites, onFavoritesChange]);

    const toggleFavorite = (movie) => {
        setFavorites((prev) => {
            const isFav = prev.find((m) => m.id === movie.id);
            if (isFav) {
                return prev.filter((m) => m.id !== movie.id);
            }
            else {
                return [...prev, movie];
            }
        });
    };
    
    useEffect(() => {
        const fetchHeroContent = async () => {
            const initialTitles = ['Breaking Bad', 'Interstellar', 'The Dark Knight', 'Game of Thrones', 'Iron Man', 'Loki'];
            try {
                const results = await Promise.all(initialTitles.map(async (title) => {
                    const res = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
                    const data = await res.json();
                    if (data.Response === "True") {
                        return {
                            id: data.imdbID,
                            title: data.Title,
                            year: data.Year,
                            image: data.Poster !== "N/A" ? data.Poster : "",
                            plot: data.Plot,
                            rating: data.imdbRating
                        };
                    }
                }));
                setFeatured(results.filter(m => m.id));
            } catch (error) {
                console.error("Hero fetch error:", error);
            }
        };
        fetchHeroContent();
    }, []);

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
    
    if(currentView === 'favorites') {
        return (
            <div className="favorites-container">
                <h2 className='view-title'>My Watchlist</h2>
                <Result 
                    movies={favorites}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                />
            </div>
        );
    }
    
    return ( 
        <div className='search-parent'>
            <div className="input-wrapper">
                <input
                className='input-field'
                type='text'
                value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Search moovies or series..."} />
                <button 
                className="search-button"
                onClick={handleSearch}
                disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </div>
        {hasSearched ? ( 
            <Result 
                movies={movies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />
        ) : ( 
            <div className="hero-section">
                <h3 className="hero-title">Featured Picks</h3>
                <Result 
                    movies={featured}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                />
            </div>
        )} 
    </div>
    );
};