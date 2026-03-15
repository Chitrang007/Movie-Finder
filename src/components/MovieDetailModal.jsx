import React, { useEffect, useState } from 'react';
import './MovieDetailModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiCheck } from 'react-icons/hi';
import { API_KEY } from './SearchBar';
import { PosterPlaceHolder } from './Result';

export const MovieDetailModal = ({ isOpen, onClose, movieId, favorites, onToggleFavorite }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imgError, setImgError] = useState(false);

    const isFavorite = favorites?.some(fav => fav.id === movieId);

    useEffect(() => {
        if (!isOpen || !movieId) {
            setDetails(null);
            setError(null);
            setImgError(false);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            setImgError(false);
            try {
                const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${API_KEY}`);
                const data = await res.json();
                if (data.Response === "True") {
                    setDetails(data);
                } else {
                    setError("Could not load details.");
                }
            } catch (err) {
                setError("Failed to fetch movie details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [isOpen, movieId]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleToggle = () => {
        if (details) {
            onToggleFavorite({
                id: details.imdbID,
                title: details.Title,
                year: details.Year,
                image: details.Poster !== "N/A" ? details.Poster : "",
                plot: details.Plot,
                rating: details.imdbRating
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="movie-modal-backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="movie-modal-card" 
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="movie-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                {loading && (
                    <div className="movie-modal-loading">
                        <div className="modal-spinner"></div>
                        <p>Loading details...</p>
                    </div>
                )}

                {error && <div className="movie-modal-error">{error}</div>}

                {details && !loading && (
                    <div className="movie-modal-content">
                        <div className="movie-modal-poster-wrap">
                            {(!details.Poster || details.Poster === 'N/A' || imgError) ? (
                                <PosterPlaceHolder />
                            ) : (
                                <img
                                    src={details.Poster}
                                    alt={details.Title}
                                    className="movie-modal-poster"
                                    onError={() => setImgError(true)}
                                />
                            )}
                        </div>

                        <div className="movie-modal-info">
                            <h2 className="movie-modal-title">{details.Title}</h2>
                            
                            <div className="movie-modal-meta">
                                <span className="movie-modal-type">
                                    {details.Type === 'series' ? 'TV Series' : 'Movie'}
                                </span>
                                <span className="movie-modal-year">{details.Year}</span>
                                <span className="movie-modal-imdb">IMDb {details.imdbRating}</span>
                                {details.Rated && details.Rated !== 'N/A' && (
                                    <span className="movie-modal-rated">{details.Rated}</span>
                                )}
                            </div>

                            {/* --- THE NETFLIX STYLE BUTTON --- */}
                            <button 
                                className={`modal-watchlist-btn ${isFavorite ? 'active' : ''}`}
                                onClick={handleToggle}
                            >
                                <div className="modal-icon-container">
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isFavorite ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <HiCheck size={24} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="plus"
                                                initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <HiPlus size={24} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
                            </button>

                            <div className="movie-modal-details-grid">
                                {details.Actors !== 'N/A' && (
                                    <div className="movie-modal-row">
                                        <strong>Starring</strong>
                                        <p>{details.Actors}</p>
                                    </div>
                                )}
                                {details.Genre !== 'N/A' && (
                                    <div className="movie-modal-row">
                                        <strong>Genre</strong>
                                        <p>{details.Genre}</p>
                                    </div>
                                )}
                                {details.Director !== 'N/A' && (
                                    <div className="movie-modal-row">
                                        <strong>Director</strong>
                                        <p>{details.Director}</p>
                                    </div>
                                )}
                            </div>

                            {details.Plot !== 'N/A' && (
                                <div className="movie-modal-plot-section">
                                    <strong>Plot</strong>
                                    <p className="movie-modal-plot-text">{details.Plot}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};