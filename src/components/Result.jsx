import React from 'react';
import './Result.css';

export const Result = () => {
    return (
        <div className='res'>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
        </div>
    )
}

const Box = () => {
    return (
        <div className='Box'>
            <div className='items'>
                <span style={{display: 'flex',  flex: '1', fontSize: 18}}>Title Here</span>
                <span className='rating'>9.0<br/></span>
            </div>
            <div><br/>Year | Country | Lang</div>
            <div style={{fontSize: 15}}>
                <br/>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam"
            </div>
            <img src="https://picsum.photos/200/300?random=1"/>
        </div>
    )
}