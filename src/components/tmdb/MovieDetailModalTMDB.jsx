import React, { useEffect, useState } from 'react';
import './MovieDetailModalTMDB.css';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiCheck, HiX } from 'react-icons/hi';
import { PosterPlaceHolder } from '../Result'; 
import { TMDB_KEY, IMG_BASE } from './SearchBarTMDB';

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

export const MovieDetailModalTMDB = ({ isOpen, onClose, movieId, mediaType, favorites, onToggleFavorite }) => {
    const [details, setDetails] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgError, setImgError] = useState(false);

    const isFavorite = favorites?.some(fav => String(fav.id) === String(movieId));

    useEffect(() => {
        if (!isOpen || !movieId) {
            setDetails(null);
            setProviders([]);
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            setImgError(false);

            const category = mediaType === 'tv' ? 'tv' : 'movie';

            try {
                const [detailRes, providerRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/${category}/${movieId}?api_key=${TMDB_KEY}`),
                    fetch(`https://api.themoviedb.org/3/${category}/${movieId}/watch/providers?api_key=${TMDB_KEY}`)
                ]);

                const detailData = await detailRes.json();
                const providerData = await providerRes.json();
                
                setDetails(detailData);
                setProviders(providerData.results?.IN?.flatrate || []);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [isOpen, movieId, mediaType]);

    const handleToggle = () => {
        if (details) {
            onToggleFavorite({
                id: details.id,
                title: details.title || details.name,
                year: (details.release_date || details.first_air_date)?.split('-')[0],
                image: details.poster_path ? `${IMG_BASE}${details.poster_path}` : '',
                plot: details.overview,
                rating: details.vote_average?.toFixed(1),
                media_type: mediaType
            });
        }
    };

    const getRuntimeDisplay = () => {
        if (!details) return '';
        if (details.runtime) return `${details.runtime} min`;
        if (details.episode_run_time && details.episode_run_time.length > 0) {
            return `Average run time: ${details.episode_run_time[0]} min`;
        }
        if (details.last_episode_to_air?.runtime) {
            return `Average run time: ${details.last_episode_to_air.runtime} min`;
        }
        return 'N/A';
    };
    
    if (!isOpen) return null;

    return (
        <div className='tmdb-modal-backdrop' onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className='tmdb-modal-card' 
                onClick={e => e.stopPropagation()}
            >
                <button className='tmdb-modal-close' onClick={onClose}><HiX /></button>

                {loading ? (
                    <div className='tmdb-modal-loading'>
                        <div className='tmdb-spinner'></div>
                        <p>Fetching Cinematic Details...</p>
                    </div>
                ) : details && (
                    <div className='tmdb-modal-body'>
                        <div className='tmdb-modal-hero' style={{ 
                            backgroundImage: `linear-gradient(to bottom, rgba(37,38,43,0.2), #25262B), url(${BACKDROP_BASE}${details.backdrop_path})` 
                        }}>
                            <div className='tmdb-hero-content'>
                                <h2 className='tmdb-modal-title'>{details.title || details.name}</h2>
                                
                                <div className='tmdb-modal-meta'>
                                    <span className='tmdb-modal-year'>
                                        {(details.release_date || details.first_air_date)?.split('-')[0]}
                                    </span>
                                    <span className='tmdb-modal-rating'>★ {details.vote_average?.toFixed(1)}</span>
                                    <span className='tmdb-modal-runtime'>{getRuntimeDisplay()}</span>
                                    {details.number_of_seasons && (
                                        <span className='tmdb-modal-seasons'>
                                            {details.number_of_seasons} {details.number_of_seasons === 1 ? 'Season': 'Seasons'}
                                        </span>
                                    )}
                                    {details.status && (
                                        <span className="status-badge">{details.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='tmdb-modal-main'>
                            <div className='tmdb-left-col'>
                                {(!details.poster_path || imgError) ? (
                                    <PosterPlaceHolder />
                                ) : (
                                    <img 
                                        src={`${IMG_BASE}${details.poster_path}`} 
                                        className='tmdb-modal-poster' 
                                        alt={details.title || details.name}
                                        onError={() => setImgError(true)}
                                    />
                                )}
                            </div>

                            <div className='tmdb-right-col'>
                                <button 
                                    className={`tmdb-watchlist-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={handleToggle}
                                >
                                    <div className='modal-icon-container'>
                                        <AnimatePresence mode='wait' initial={false}>
                                            <motion.div
                                                key={isFavorite ? 'check' : 'plus'}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {isFavorite ? <HiCheck size={24} /> : <HiPlus size={24} />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
                                </button>

                                {providers.length > 0 && (
                                    <div className='streaming-container'>
                                        <p className='streaming-label'>Where to Watch</p>
                                        <div className='streaming-list'>
                                            {providers.map(p => (
                                                <img 
                                                    key={p.provider_id}
                                                    src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                                                    alt={p.provider_name}
                                                    className='provider-logo'
                                                    title={p.provider_name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className='tmdb-plot-box'>
                                    <strong>Overview</strong>
                                    <p>{details.overview}</p>
                                </div>

                                <div className='tmdb-genre-pills'>
                                    {details.genres?.map(g => (
                                        <span key={g.id} className='genre-pill'>{g.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};