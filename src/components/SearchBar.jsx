import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { Result } from './Result';
import { MovieDetailModal } from './MovieDetailModal';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export const SearchBar = ({ placeholder, currentView, onFavoritesChange, homeResetKey }) => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [trending, setTrending] = useState([]);
    const [allTimeMovies, setAllTimeMovies] = useState([]);
    const [allTimeSeries, setAllTimeSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
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

    useEffect(() => {
        if (homeResetKey > 0) {
            setQuery('');
            setMovies([]);
            setHasSearched(false);
        }
    }, [homeResetKey]);

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
        const fetchFeatured = async () => {
            const titles = ['Breaking Bad', 'Interstellar', 'The Dark Knight', 'Game of Thrones', 'Iron Man', 'Loki', 'Top Gun: Maverick'];
            try {
                const results = await Promise.all(titles.map(async (title) => {
                    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
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
                setFeatured(results.filter(m => m?.id));
            } catch (error) {
                console.error("Featured fetch error:", error);
            }
        };
        fetchFeatured();
    }, []);

    useEffect(() => {
        const fetchTrending = async () => {
            const titles = ['Dune: Part Two', 'Oppenheimer', 'Stranger Things', 'Squid Game', 'Wednesday', 'One Piece', 'The Last of Us'];
            try {
                const results = await Promise.all(titles.map(async (title) => {
                    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
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
                setTrending(results.filter(m => m?.id));
            } catch (error) {
                console.error("Trending fetch error:", error);
            }
        };
        fetchTrending();
    }, []);

    useEffect(() => {
        const fetchAllTimeMovies = async () => {
            const titles = ['The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'The Godfather Part II', '12 Angry Men'];
            try {
                const results = await Promise.all(titles.map(async (title) => {
                    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
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
                setAllTimeMovies(results.filter(m => m?.id));
            } catch (error) {
                console.error("Movies fetch error:", error);
            }
        };
        fetchAllTimeMovies();
    }, []);

    useEffect(() => {
        const fetchAllTimeSeries = async () => {
            const titles = ['Friends', 'The Office', 'Breaking Bad', 'Game of Thrones', 'Modern Family'];
            try {
                const results = await Promise.all(titles.map(async (title) => {
                    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
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
                setAllTimeSeries(results.filter(m => m?.id));
            } catch (error) {
                console.error("TV series fetch error:", error);
            }
        };
        fetchAllTimeSeries();
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

    // Shared Modal Component to avoid repetition
    const ModalOverlay = () => (
        <MovieDetailModal
            isOpen={!!selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
            movieId={selectedMovieId}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
        />
    );
    
    if(currentView === 'favorites') {
        return (
            <>
            <div className="favorites-container">
                <h2 className='view-title'>My List</h2>
                <Result 
                    movies={favorites}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onMovieClick={(id) => setSelectedMovieId(id)}
                />
            </div>
            <ModalOverlay />
            </>
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
                placeholder={placeholder || "Search movies or series..."} />
                <button 
                className="search-button"
                onClick={handleSearch}
                disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </div>
        {hasSearched ? ( 
            loading ? (
                <div className="search-loading">
                    <div className="search-spinner" aria-hidden="true" />
                    <p className="search-loading-text">Loading...</p>
                </div>
            ) : (
            <Result 
                movies={movies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onMovieClick={(id) => setSelectedMovieId(id)}
            />
            )
        ) : ( 
            <>
            <div className="content-section">
                <h3 className="section-title section-title-featured">Featured Picks</h3>
                <Result 
                    movies={featured}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onMovieClick={(id) => setSelectedMovieId(id)}
                />
            </div>
            <div className="content-section">
                <h3 className="section-title section-title-trending">Trending Now</h3>
                <Result 
                    movies={trending}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onMovieClick={(id) => setSelectedMovieId(id)}
                />
            </div>
            <div className="all-time-break">
                <h2 className="all-time-break-title">All Time Fan Favorites</h2>
            </div>
            <div className="content-section">
                <h3 className="section-title section-title-movies">Movies</h3>
                <Result 
                    movies={allTimeMovies}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onMovieClick={(id) => setSelectedMovieId(id)}
                />
            </div>
            <div className="content-section">
                <h3 className="section-title section-title-series">TV Series</h3>
                <Result 
                    movies={allTimeSeries}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onMovieClick={(id) => setSelectedMovieId(id)}
                />
            </div>
            </>
        )} 
        <ModalOverlay />
    </div>
    );
};