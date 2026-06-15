import React, { useEffect, useState } from 'react';
import './MovieDetailModalPro.css';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiCheck, HiX } from 'react-icons/hi';
import { PosterPlaceHolder } from '../Result'; 

const TMDB_BASE = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080' 
    : '/tmdb-api';

const IMG_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/image/w500'
    : '/tmdb-images/w500';

const BACKDROP_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/image/original'
    : '/tmdb-images/original';

const LOGO_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/image/original'
    : '/tmdb-images/original';

export const MovieDetailModalTMDB = ({ isOpen, onClose, movieId, mediaType, favorites, onToggleFavorite }) => {
    const [details, setDetails] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

    const isFavorite = favorites?.some(fav => String(fav.id) === String(movieId));

    useEffect(() => {
        if (!isOpen || !movieId) {
            setDetails(null);
            setProviders([]);
            setTrailerKey(null);
            setShowVideo(false);
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            setImgError(false);
            const category = mediaType === 'tv' ? 'tv' : 'movie';

            try {
                const [detailRes, providerRes, videoRes] = await Promise.all([
                    fetch(`${TMDB_BASE}/${category}/${movieId}`),
                    fetch(`${TMDB_BASE}/${category}/${movieId}/watch/providers`),
                    fetch(`${TMDB_BASE}/${category}/${movieId}/videos`)
                ]);

                const detailData = await detailRes.json();
                const providerData = await providerRes.json();
                const videoData = await videoRes.json();
                
                setDetails(detailData);
                setProviders(providerData.results?.IN?.flatrate || []);
                
                const trailer = videoData.results?.find(
                    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
                );
                setTrailerKey(trailer ? trailer.key : null);
            } catch (err) {
                console.error('Discovery Bureau Fetch Error:', err);
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
        if (details.episode_run_time?.length > 0) return `Average runtime per episode: ${details.episode_run_time[0]} min`;
        if (details.last_episode_to_air?.runtime) return `Average runtime per episode: ${details.last_episode_to_air.runtime} min`;
        return 'N/A';
    };
    
    if (!isOpen) return null;

    return (
        <div className='tmdb-modal-backdrop' onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className='tmdb-modal-card' 
                onClick={e => e.stopPropagation()}
            >
                <button className='tmdb-modal-close' onClick={onClose}><HiX size={24}/></button>

                {loading ? (
                    <div className='tmdb-modal-loading'>
                        <div className='tmdb-spinner'></div>
                        <p>Fetching Details...</p>
                    </div>
                ) : details && (
                    <div className='tmdb-modal-body'>
                        <div className='tmdb-modal-hero' style={{ 
                            backgroundImage: `linear-gradient(to bottom, rgba(26, 27, 30, 0) 0%, rgba(26, 27, 30, 0.8) 70%, #1A1B1E 100%), url(${BACKDROP_BASE}${details.backdrop_path})` 
                        }}>
                            <div className='tmdb-hero-content'>
                                <h2 className='tmdb-modal-title'>{details.title || details.name}</h2>
                                <div className='tmdb-modal-meta'>
                                    <span>{(details.release_date || details.first_air_date)?.split('-')[0]}</span>
                                    <span className='tmdb-modal-rating'>★ {details.vote_average?.toFixed(1)}</span>
                                    <span>{getRuntimeDisplay()}</span>
                                    {details.number_of_seasons && (
                                        <span className='tmdb-modal-seasons'>
                                            {details.number_of_seasons} {details.number_of_seasons === 1 ? 'Season': 'Seasons'}
                                        </span>
                                    )}
                                    {details.status && <span className='status-badge'>{details.status}</span>}
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
                                        loading='eager'
                                        crossOrigin='anonymous'
                                        onError={() => setImgError(true)}
                                    />
                                )}
                            </div>

                            <div className='tmdb-right-col'>
                                <div className='tmdb-action-bar'>
                                    <button 
                                        className={`tmdb-watchlist-btn ${isFavorite ? 'active' : ''}`}
                                        onClick={handleToggle}
                                    >
                                        <AnimatePresence mode='wait' initial={false}>
                                            <motion.div
                                                key={isFavorite ? 'check' : 'plus'}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                className='modal-icon-wrapper'
                                            >
                                                {isFavorite ? <HiCheck size={20} /> : <HiPlus size={20} />}
                                            </motion.div>
                                        </AnimatePresence>
                                        <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
                                    </button>

                                    {trailerKey && (
                                        <button className='tmdb-trailer-btn' onClick={() => setShowVideo(true)}>
                                            <svg viewBox='0 0 24 24' fill='currentColor' className='play-svg'>
                                                <path d='M8 5v14l11-7z' />
                                            </svg>
                                            Watch Trailer
                                        </button>
                                    )}
                                </div>

                                {providers.length > 0 && (
                                    <div className='streaming-container'>
                                        <p className='streaming-label'>Where to Watch</p>
                                        <div className='streaming-list'>
                                            {providers.map(p => (
                                                <img 
                                                    key={p.provider_id}
                                                    src={`${LOGO_BASE}${p.logo_path}`} 
                                                    alt={p.provider_name}
                                                    className='provider-logo'
                                                    title={p.provider_name}
                                                    crossOrigin='anonymous'
                                                    loading='eager' 
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
                
                {showVideo && (
                    <div className='tmdb-video-overlay' onClick={() => setShowVideo(false)}>
                        <div className='tmdb-video-container' onClick={e => e.stopPropagation()}>
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                                title='YouTube trailer'
                                allow='autoplay; encrypted-media'
                                allowFullScreen
                            ></iframe>
                            <button className='close-video' onClick={() => setShowVideo(false)}>
                                <HiX size={22} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};