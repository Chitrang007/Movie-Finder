import React from 'react';
import './Result.css';

export const Result = (props) => {

    const {movies} = props;

    const boxes = movies.map(
        (movie) => {
            return <Box key={movie.id} movie={movie}/>
        }
    )

    return (
        <div className='res'>
            {boxes}
        </div>
    )
}

const Box = (props) => {
    
    const {movie} = props;

    return (
        <div className='Box'>
            <div className='items'>
                <span style={{display: 'flex',  flex: '1'}}>{movie.title}</span>
                <span className='rating'>{movie.rating}<br/></span>
            </div>
            <div className='Additional'>
                <br/>
                {movie.year} | {movie.country} | {movie.lang}
            </div>
            <div className='plot'>
                <br/>
                {movie.plot}
            </div>
            <img src={movie.image} alt="" style={{paddingTop: '10px'}}/>
        </div>
    )
}