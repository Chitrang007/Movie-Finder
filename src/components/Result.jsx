import React from 'react';
import './Result.css';

export const Result = ({ movies }) => {
    if (movies.length === 0) {
        return <div className="no-results">No movies found. Try searching for something else!</div>;
    }

    return (
        <div className='res-grid'>
            {movies.map((movie) => (
                <Box key={movie.id} movie={movie}/>
            ))}
        </div>
    );
}

const Box = ({ movie }) => {
    return (
        <div className='MovieBox'>
            <div className='movie-image-container'>
                <img src={movie.image} alt={movie.title} />
                <span className='rating-badge'>{movie.rating}</span>
            </div>
            <div className='movie-content'>
                <h3 className='movie-title'>{movie.title}</h3>
                <p className='movie-info'>{movie.year} • {movie.country} • {movie.lang}</p>
                <p className='movie-plot'>{movie.plot}</p>
            </div>
        </div>
    );
}