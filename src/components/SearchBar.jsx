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
            { id: 1, title: 'Iron Man', rating: 7.9, plot: 'Plot of Movie 1', year: 2008, country: 'USA', lang: 'English', image: "https://picsum.photos/200/300?random=1" },
            { id: 2, title: 'The Island of Dr. More', rating: 5.8, plot: 'Plot of Movie 2', year: 1977, country: 'USA', lang: 'English', image: "https://picsum.photos/200/300?random=2" },
            { id: 3, title: 'The Invincible Iron Man', rating: 6, plot: 'Plot of Movie 3', year: 2007, country: 'USA', lang: 'English', image: "https://picsum.photos/200/300?random=3" },
            { id: 4, title: 'Dark Man', rating: 6.4, plot: 'Plot of Movie 4', year: 1990, country: 'USA', lang: 'English', image: "https://picsum.photos/200/300?random=4" },
            { id: 5, title: '7 Aum Arivu', rating: 5.8, plot: 'Plot of Movie 5', year: 2011, country: 'India', lang: 'Tamil', image: "https://picsum.photos/200/300?random=5" },
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
        <div className='parent'>
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