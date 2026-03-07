import React from 'react';
import './Result.css';

export const Result = ({ movies, favorites, onToggleFavorite }) => {
    if (movies.length === 0) {
        return <div className="no-results">No results found. Try something else!</div>;
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
                    />
                );
            })}
        </div>
    );
}

const Box = ({ movie, isFavorite, onToggle }) => {
    return (
        <div className='MovieBox'>
            <div className='movie-image-container'>
                <img src={movie.image || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={movie.title} />
                <span className='rating-badge'>{movie.rating}</span>
                
                <button 
                    className={`fav-btn ${isFavorite ? 'active' : ''}`} 
                    onClick={() => onToggle(movie)}
                    aria-label="Toggle Favorite"
                >
                    {isFavorite ? '❤️' : '🤍'}
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