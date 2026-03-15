import React, { useEffect, useState } from 'react';
import './SearchBarTMDB.css';
import { Result } from '../Result';
import { MovieDetailModalTMDB } from './MovieDetailModalTMDB';
import { MovieDetailModal } from '../MovieDetailModal';

export const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY; 
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export const SearchBarTMDB = ({ placeholder, onFavoritesChange, betaResetKey, currentView }) => {
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
        if (onFavoritesChange) onFavoritesChange(favorites.length);
    }, [favorites, onFavoritesChange]);

    useEffect(() => {
        if (betaResetKey > 0) {
            setQuery('');
            setMovies([]);
            setHasSearched(false);
        }
    }, [betaResetKey]);

    const toggleFavorite = (movie) => {
        setFavorites((prev) => {
            const isFav = prev.find((m) => String(m.id) === String(movie.id));
            return isFav ? prev.filter((m) => String(m.id) !== String(movie.id)) : [...prev, movie];
        });
    };

    const formatTMDBMovie = (movie) => ({
        id: movie.id,
        title: movie.title || movie.name,
        year: (movie.release_date || movie.first_air_date || '').split('-')[0],
        image: movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '',
        plot: movie.overview,
        rating: movie.vote_average?.toFixed(1)
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [trendRes, featRes, topMoviesRes, topTVRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}`),
                    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`),
                    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}`),
                    fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_KEY}`)
                ]);

                const trendData = await trendRes.json();
                const featData = await featRes.json();
                const topMoviesData = await topMoviesRes.json();
                const topTVData = await topTVRes.json();

                setTrending(trendData.results.slice(0, 7).map(formatTMDBMovie));
                setFeatured(featData.results.slice(0, 7).map(formatTMDBMovie));
                setAllTimeMovies(topMoviesData.results.slice(0, 5).map(formatTMDBMovie));
                setAllTimeSeries(topTVData.results.slice(0, 5).map(formatTMDBMovie));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
            );
            const data = await res.json();
            if (data.results) {
                setMovies(data.results.filter(item => item.media_type !== 'person').map(formatTMDBMovie));
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const ModalOverlay = () => {
        if(!selectedMovieId) return null;

        const isOmdbId = String(selectedMovieId).startsWith('tt');
        
        return isOmdbId ? (
            <MovieDetailModal
                isOpen={!!selectedMovieId}
                onClose={() => setSelectedMovieId(null)}
                movieId={selectedMovieId}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />
        ) : (
            <MovieDetailModalTMDB
                isOpen={!!selectedMovieId}
                onClose={() => setSelectedMovieId(null)}
                movieId={selectedMovieId}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />
        )
    };

    if (currentView === 'favorites') {
        return (
            <div className='tmdb-search-parent'>
                <div className='tmdb-favorites-container'>
                    <Result
                        movies={favorites}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onMovieClick={(id) => setSelectedMovieId(id)}
                    />
                </div>
                <ModalOverlay />
            </div>
        );
    }

    return (
        <div className='tmdb-search-parent'>
            <div className="tmdb-beta-banner">
                Plot Search
            </div>

            <div className='tmdb-input-wrapper'>
                <input
                    className='tmdb-input-field'
                    type='text'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={placeholder || 'Describe a plot or story...'}
                />
                <button className='tmdb-search-button' onClick={handleSearch} disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </div>
            
            {hasSearched ? (
                loading ? (
                    <div className='tmdb-search-loading'>
                        <div className='tmdb-search-spinner' />
                        <p className='tmdb-search-loading-text'>Analyzing Universe...</p>
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
                    <div className='tmdb-content-section tmdb-section-featured'>
                        <h3 className='tmdb-section-title'>Featured Picks</h3>
                        <Result movies={featured} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={setSelectedMovieId} />
                    </div>

                    <div className='tmdb-content-section tmdb-section-trending'>
                        <h3 className='tmdb-section-title'>Trending Right Now</h3>
                        <Result movies={trending} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={setSelectedMovieId} />
                    </div>
                    
                    <div className='tmdb-all-time-break'>
                        <h2 className='tmdb-all-time-break-title'>All Time Fan Favorites</h2>
                    </div>

                    <div className='tmdb-content-section tmdb-section-movies'>
                        <h3 className='tmdb-section-title'>Top Rated Movies</h3>
                        <Result movies={allTimeMovies} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={setSelectedMovieId} />
                    </div>

                    <div className='tmdb-content-section tmdb-section-series'>
                        <h3 className='tmdb-section-title'>Top TV Series</h3>
                        <Result movies={allTimeSeries} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={setSelectedMovieId} />
                    </div>
                </>
            )}
            <ModalOverlay />
        </div>
    );
};