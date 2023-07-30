import React, { useEffect } from 'react';
import { useState } from 'react';
import './SearchBar.css';
import { Result } from './Result';


export const SearchBar = () => {
    
    const [plot, setPlot] = useState('');
    const [movies, setMovies] = useState([]);

    const changePlot = (e) => {
        setPlot(e.target.value);
    }

    const handleSearch = () => {

        const staticMovieData = [
            { id: 1, title: 'Iron Man', rating: 7.9, plot: 'Plot of Movie 1', year: 2008, country: 'USA', lang: 'English' },
            { id: 2, title: 'The Island of Dr. More', rating: 5.8, plot: 'Plot of Movie 2', year: 1977, country: 'USA', lang: 'English' },
            { id: 3, title: 'The Invincible Iron Man', rating: 6, plot: 'Plot of Movie 3', year: 2007, country: 'USA', lang: 'English' },
            { id: 4, title: 'Dark Man', rating: 6.4, plot: 'Plot of Movie 4', year: 1990, country: 'USA', lang: 'English' },
            { id: 5, title: '7 Aum Arivu', rating: 5.8, plot: 'Plot of Movie 5', year: 2011, country: 'India', lang: 'Tamil' },
        ];
        setMovies(staticMovieData);
    }

    useEffect(
        () => {
            console.log("Hello");
        },
        [plot]
    )
    return (
        <div>
            <div className="input-wrapper">
                <input 
                className='input' 
                type='search'
                value={plot} 
                onChange={changePlot} 
                placeholder="Enter plot here..."/>
                <input 
                type='button'
                className="search-button"
                value="Search"
                onClick={handleSearch}/>
            </div>
            <Result movies={movies} />
        </div>
    );
}