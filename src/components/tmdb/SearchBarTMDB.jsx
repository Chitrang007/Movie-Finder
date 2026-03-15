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
    
    // SOURCE OF TRUTH FOR MODAL
    const [selectedMediaType, setSelectedMediaType] = useState('movie');
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('cine-favs');
        return saved ? JSON.parse(saved) : [];
    });

    // Helper to open modal with specific type
    const handleItemClick = (id, type) => {
        setSelectedMediaType(type || 'movie');
        setSelectedMovieId(id);
    };

    // FORMATTER: Now injects media_type into every object
    const formatTMDBMovie = (movie) => ({
        id: movie.id,
        title: movie.title || movie.name,
        year: (movie.release_date || movie.first_air_date || '').split('-')[0],
        image: movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '',
        plot: movie.overview,
        rating: movie.vote_average?.toFixed(1),
        // Crucial for solving the mismatch
        media_type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie')
    });

    useEffect(() => {
        localStorage.setItem('cine-favs', JSON.stringify(favorites));
        if (onFavoritesChange) onFavoritesChange(favorites.length);
    }, [favorites, onFavoritesChange]);

    // Initial Fetch
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
            } catch (err) { console.error(err); }
        };
        fetchInitialData();
    }, []);

    const toggleFavorite = (movie) => {
        setFavorites((prev) => {
            const isFav = prev.find((m) => String(m.id) === String(movie.id));
            return isFav ? prev.filter((m) => String(m.id) !== String(movie.id)) : [...prev, movie];
        });
    };

    const handleSearch = async (overrideQuery) => {
        let finalQuery = overrideQuery || query;
        if (!finalQuery.trim()) return;
        setLoading(true);
        setHasSearched(true);

        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(finalQuery)}`);
            const data = await res.json();
            const filtered = (data.results || []).filter(i => i.media_type !== "person" && i.poster_path);
            setMovies(filtered.map(formatTMDBMovie));
        } catch (error) {
            console.error('Search Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const ModalOverlay = () => {
        if (!selectedMovieId) return null;
        const isOmdbId = String(selectedMovieId).startsWith('tt');
        const ModalComponent = isOmdbId ? MovieDetailModal : MovieDetailModalTMDB;
        return (
            <ModalComponent
                isOpen={!!selectedMovieId}
                onClose={() => setSelectedMovieId(null)}
                movieId={selectedMovieId}
                mediaType={selectedMediaType}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />
        );
    };

    if (currentView === 'favorites') {
        return (
            <div className='tmdb-search-parent'>
                <Result movies={favorites} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={(id) => {
                    const item = favorites.find(f => f.id === id);
                    handleItemClick(id, item?.media_type);
                }} />
                <ModalOverlay />
            </div>
        );
    }

    return (
        <div className='tmdb-search-parent'>
            {/* Input and suggestions UI ... */}
            <div className='tmdb-input-wrapper'>
                <input className='tmdb-input-field' value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && handleSearch()} placeholder='Describe a plot...' />
                <button className='tmdb-search-button' onClick={() => handleSearch()} disabled={loading}>{loading ? '...' : 'Search'}</button>
            </div>

            {hasSearched ? (
                <Result movies={movies} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={(id) => {
                    const item = movies.find(m => m.id === id);
                    handleItemClick(id, item?.media_type);
                }} />
            ) : (
                <>
                    <Section title="Featured Picks" data={featured} onMovieClick={handleItemClick} favorites={favorites} toggleFavorite={toggleFavorite} />
                    <Section title="Trending Right Now" data={trending} onMovieClick={handleItemClick} favorites={favorites} toggleFavorite={toggleFavorite} />
                    <Section title="Top Rated Movies" data={allTimeMovies} onMovieClick={(id)=>handleItemClick(id, 'movie')} favorites={favorites} toggleFavorite={toggleFavorite} />
                    <Section title="Top TV Series" data={allTimeSeries} onMovieClick={(id)=>handleItemClick(id, 'tv')} favorites={favorites} toggleFavorite={toggleFavorite} />
                </>
            )}
            <ModalOverlay />
        </div>
    );
};

// Internal Helper for Sections
const Section = ({ title, data, onMovieClick, favorites, toggleFavorite }) => (
    <div className='tmdb-content-section'>
        <h3 className='tmdb-section-title'>{title}</h3>
        <Result 
            movies={data} 
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
            onMovieClick={(id) => {
                const item = data.find(m => m.id === id);
                onMovieClick(id, item?.media_type);
            }} 
        />
    </div>
);