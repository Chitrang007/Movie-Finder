import React, { useEffect, useState } from 'react';
import './SearchBarTMDB.css';
import { Result } from '../Result';
import { MovieDetailModalTMDB } from './MovieDetailModalTMDB';
import { MovieDetailModal } from '../MovieDetailModal';

const TMDB_BASE = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080' 
    : '/tmdb-api';

const IMG_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/image/w500'
    : '/tmdb-images/w500';

export const SearchBarTMDB = ({ onFavoritesChange, betaResetKey, currentView }) => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [trending, setTrending] = useState([]);
    const [allTimeMovies, setAllTimeMovies] = useState([]);
    const [allTimeSeries, setAllTimeSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedMediaType, setSelectedMediaType] = useState('movie');
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('cine-favs');
        return saved ? JSON.parse(saved) : [];
    });

    const suggestions = [
        { label: 'Inception', plot: 'Dream inside dream'},
        { label: 'Loki', plot: 'God of Mischief mystery' },
        { label: 'Harry Potter', plot: 'Kid wizard school'},
        { label: 'The Office', plot: 'Mockumentry office life'},
        { label: 'Friends', plot: 'Six friends new york sitcom '},
        { label: 'Infinity War', plot: 'Infinity stones Thanos' },
        { label: 'Wednesday', plot: 'Gothic girl Nevermore Academy' },
    ];

    const plotDictionary = {
        'billionaire armored suit': 'iron man',
        'infinity stones thanos': 'avengers infinity war',
        'god of mischief': 'loki',
        'gothic girl nevermore': 'wednesday',
        'wizard school': 'harry potter',
        'dream inside dream': 'inception',
        'time travel paradox': 'dark'
    };

    const handleItemClick = (id, type) => {
        setSelectedMediaType(type || 'movie');
        setSelectedMovieId(id);
    };

    const formatTMDBMovie = (movie) => ({
        id: movie.id,
        title: movie.title || movie.name,
        year: (movie.release_date || movie.first_air_date || '').split('-')[0],
        image: movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '',
        plot: movie.overview,
        rating: movie.vote_average?.toFixed(1),
        media_type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie')
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
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [betaResetKey]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [trendRes, featRes, topMoviesRes, topTVRes] = await Promise.all([
                    fetch(`${TMDB_BASE}/trending/all/day`),
                    fetch(`${TMDB_BASE}/movie/popular`),
                    fetch(`${TMDB_BASE}/movie/top_rated`),
                    fetch(`${TMDB_BASE}/tv/top_rated`)
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

        const lowerQuery = finalQuery.toLowerCase();
        Object.keys(plotDictionary).forEach(plot => {
            if(lowerQuery.includes(plot)) finalQuery = plotDictionary[plot];
        });

        try {
            const words = finalQuery
                .toLowerCase()
                .replace(/[.,/#!$%^&*;:{}=\-_~()]/g, '')
                .split(' ')
                .filter(w => w.length > 3)
                .slice(0,5);

            let candidateMovies = [];
            const requests = words.map(word =>
                fetch(`${TMDB_BASE}/search/multi?query=${encodeURIComponent(word)}`)
            );

            const responses = await Promise.all(requests);
            const dataResults = await Promise.all(responses.map(r => r.json()));

            dataResults.forEach(data => {
                if(data.results) candidateMovies.push(...data.results.filter(i => i.media_type !== 'person'));
            });

            const uniqueMovies = Array.from(new Map(candidateMovies.map(m => [m.id, m])).values());

            const scoredResults = uniqueMovies.map(movie => {
                let score = movie.popularity || 0;
                const plotText = (movie.overview || '').toLowerCase();
                const titleText = (movie.title || movie.name || '').toLowerCase();
                words.forEach(word => {
                    if(titleText.includes(word)) score += 200;
                    if(plotText.includes(word)) score += 120;
                });
                return { ...movie, searchScore: score };
            });

            const finalResults = scoredResults
                .filter(m => m.poster_path)
                .sort((a,b)=> b.searchScore - a.searchScore)
                .slice(0,20);

            setMovies(finalResults.map(formatTMDBMovie));
        } catch (error) {
            console.error('Search Accuracy Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (plotText) => {
        setQuery(plotText);
        handleSearch(plotText);
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
        const proList = favorites.filter(f => !String(f.id).startsWith('tt'));
        const cmdbList = favorites.filter(f => String(f.id).startsWith('tt'));
        return (
            <div className='tmdb-search-parent'>
                <div className='tmdb-favorites-container'>
                    {proList.length > 0 && (
                        <div className='tmdb-content-section pro-list'>
                            <h3 className='tmdb-section-title ribbon-red'>CMDB Pro List</h3>
                            <Result movies={proList} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={(id) => handleItemClick(id, proList.find(f => f.id === id)?.media_type)} />
                        </div>
                    )}
                    {cmdbList.length > 0 && (
                        <div className='tmdb-content-section classic-list'>
                            <h3 className='tmdb-section-title ribbon-gold'>CMDB List</h3>
                            <Result movies={cmdbList} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={(id) => handleItemClick(id, 'movie')} />
                        </div>
                    )}
                </div>
                <ModalOverlay />
            </div>
        );
    }

    return (
        <div className='tmdb-search-parent'>
            <div className='tmdb-beta-banner'>✨ PRO ENGINE ACTIVE</div>
            
            <div className='tmdb-input-wrapper'>
                <input
                    className='tmdb-input-field'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder='Describe a plot...'
                />
                <button className='tmdb-search-button' onClick={() => handleSearch()} disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </div>

            {!hasSearched && (
                <div className='tmdb-suggestions'>
                    <span className='tmdb-suggestions-label'>Try searching:</span>
                    {suggestions.map((item, index) => (
                        <button key={index} className='tmdb-suggestion-pill' onClick={() => handleSuggestionClick(item.plot)}>
                            '{item.plot}'
                        </button>
                    ))}
                </div>
            )}

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
                        onMovieClick={(id) => handleItemClick(id, movies.find(m => m.id === id)?.media_type)}
                    />
                )
            ) : (
                <>
                    <Section title='Featured Picks' data={featured} onMovieClick={handleItemClick} favorites={favorites} toggleFavorite={toggleFavorite} className='tmdb-section-featured' />
                    <Section title='Trending Right Now' data={trending} onMovieClick={handleItemClick} favorites={favorites} toggleFavorite={toggleFavorite} className='tmdb-section-trending' />
                    <div className='tmdb-all-time-break'><h2 className='tmdb-all-time-break-title'>All Time Fan Favorites</h2></div>
                    <Section title='Top Rated Movies' data={allTimeMovies} onMovieClick={(id)=>handleItemClick(id, 'movie')} favorites={favorites} toggleFavorite={toggleFavorite} className='tmdb-section-movies' />
                    <Section title='Top TV Series' data={allTimeSeries} onMovieClick={(id)=>handleItemClick(id, 'tv')} favorites={favorites} toggleFavorite={toggleFavorite} className='tmdb-section-series' />
                </>
            )}
            <ModalOverlay />
        </div>
    );
};

const Section = ({ title, data, onMovieClick, favorites, toggleFavorite, className }) => (
    <div className={`tmdb-content-section ${className}`}>
        <h3 className='tmdb-section-title'>{title}</h3>
        <Result 
            movies={data} 
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
            onMovieClick={(id) => onMovieClick(id, data.find(m => m.id === id)?.media_type)} 
        />
    </div>
);