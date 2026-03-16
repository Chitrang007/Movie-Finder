import React, { useState } from 'react';
import './Result.css';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiCheck, HiOutlineFilm } from 'react-icons/hi';

export const PosterPlaceHolder = () => (
    <div className='poster-placeholder'>
        <HiOutlineFilm className='placeholder-icon' />
        <span className='placeholder-text'>Poster Unavailable</span>
    </div>
);

export const Result = ({ movies, favorites, onToggleFavorite, onMovieClick }) => {
    if (movies.length === 0) {
        return <div className='no-results'>No results found. Try something else!</div>;
    }

    return (
        <div className='res-grid results-container'> 
            {movies.map((movie) => {
                const isFav = favorites.some(fav => fav.id === movie.id);
                
                return (
                    <Box 
                        key={movie.id} 
                        movie={movie} 
                        isFavorite={isFav} 
                        onToggle={onToggleFavorite}
                        onMovieClick={onMovieClick}
                    />
                );
            })}
        </div>
    );
}

const Box = ({ movie, isFavorite, onToggle, onMovieClick }) => {
    const [imgError, setImgError] = useState(false);

    const handleCardClick = () => {
        if (onMovieClick) onMovieClick(movie.id);
    };

    const handleFavClick = (e) => {
        e.stopPropagation();
        onToggle(movie);
    };

    return (
        <div
            className='MovieBox movie-box-clickable'
            onClick={handleCardClick}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } }}
            aria-label={`View details for ${movie.title}`}
        >
            <div className='movie-image-container'>
                {(!movie.image || movie.image === 'N/A' || imgError) ? (
                    <PosterPlaceHolder />
                ) : (
                    <img
                        src={movie.image}
                        alt={movie.title}
                        loading='eager'
                        onError={() => setImgError(true)}
                    />
                )}
                <span className='rating-badge'>{movie.rating}</span>
                
                <button 
                    className={`fav-btn watchlist-btn ${isFavorite ? 'active' : ''}`} 
                    onClick={handleFavClick}
                    aria-label={isFavorite ? 'Remove from My List' : 'Add to My List'}
                >
                    <AnimatePresence mode='wait' initial={false}>
                        {isFavorite ? (
                            <motion.div
                                key='check'
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <HiCheck size={20} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key='plus'
                                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <HiPlus size={20} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
            <div className='movie-content'>
                <h3 className='movie-title'>{movie.title}</h3>
                <p className='movie-info'>{movie.year}</p>
                <p className='movie-plot'>{movie.plot}</p>
            </div>
        </div>
    );
}