// src/pages/Streaming/StreamingDonghua.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    ChevronDown,
    MonitorPlay,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Film,
    Calendar,
    SkipBack,
    SkipForward,
    Download,
    ExternalLink,
    Star,
    AlertTriangle
} from 'lucide-react';
import { useStreamingBase } from './StreamingBase';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';

const StreamingDonghua = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil URL dari query parameter
    const searchParams = new URLSearchParams(location.search);
    const episodeUrl = searchParams.get('url');

    console.log('Donghua episode URL from query:', episodeUrl);

    const [episodeData, setEpisodeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedServer, setSelectedServer] = useState(null);
    const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
    const [isIframeLoading, setIsIframeLoading] = useState(false);
    const [showAdsWarning, setShowAdsWarning] = useState(false);

    // Fetch data dari endpoint /api/donghua/episode
    useEffect(() => {
        const fetchEpisodeDetail = async () => {
            if (!episodeUrl) {
                setError('No episode URL provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching donghua episode from:', `${API_BASE}/donghua/episode?url=${encodeURIComponent(episodeUrl)}`);

                const response = await axios.get(`${API_BASE}/donghua/episode?url=${encodeURIComponent(episodeUrl)}`);

                console.log('Donghua episode data:', response.data);

                if (response.data.success) {
                    setEpisodeData(response.data.data);

                    // Set server pertama sebagai default (prioritas server tanpa iklan)
                    const streams = response.data.data.streams || [];
                    const noAdsServer = streams.find(s => !s.hasAds);
                    setSelectedServer(noAdsServer || streams[0] || null);
                } else {
                    setError(response.data.error || 'Failed to load episode');
                }
            } catch (err) {
                console.error('Error fetching donghua episode detail:', err);
                setError('Failed to load episode data');
            } finally {
                setLoading(false);
            }
        };

        if (episodeUrl) {
            fetchEpisodeDetail();
        }
    }, [episodeUrl]);

    // Effect untuk menampilkan warning jika server mengandung iklan
    useEffect(() => {
        if (selectedServer?.hasAds) {
            setShowAdsWarning(true);
            const timer = setTimeout(() => setShowAdsWarning(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [selectedServer]);

    // Gunakan streaming base dengan data dari API
    const streaming = useStreamingBase(
        episodeData?.donghua,
        episodeData?.currentEpisode,
        []
    );

    const handleServerChange = (server) => {
        setSelectedServer(server);
        setIsServerDropdownOpen(false);
    };

    const handleEpisodeClick = (ep) => {
        navigate(`/donghua/watch?url=${encodeURIComponent(ep.url)}`);
    };

    const handlePrev = () => {
        if (episodeData?.navigation?.prev) {
            navigate(`/donghua/watch?url=${encodeURIComponent(episodeData.navigation.prev)}`);
        }
    };

    const handleNext = () => {
        if (episodeData?.navigation?.next) {
            navigate(`/donghua/watch?url=${encodeURIComponent(episodeData.navigation.next)}`);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading donghua episode...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !episodeData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Error Loading Episode</h2>
                    <p className="text-gray-400 mb-4">{error || 'Unknown error'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-primary-400 text-black rounded-lg font-semibold hover:bg-primary-500 transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const { currentEpisode, donghua, streams, downloads, relatedEpisodes, navigation } = episodeData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black">
            {/* Navigation Bar */}
            <div className="sticky top-0 z-50 bg-dark-surface/95 backdrop-blur-sm border-b border-dark-border">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center h-16">
                        <button
                            onClick={streaming.handleBack}
                            className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-dark-card flex items-center justify-center group-hover:bg-primary-400/10">
                                <ChevronLeft size={18} className="group-hover:text-primary-400" />
                            </div>
                            <span className="text-sm font-medium hidden sm:block">Back</span>
                        </button>

                        <div className="flex-1 mx-4 min-w-0">
                            <h1 className="text-base sm:text-lg font-bold text-white truncate">
                                {donghua?.title || 'Donghua'}
                            </h1>
                            <p className="text-xs sm:text-sm text-primary-400 truncate">
                                {currentEpisode?.title}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                                Episode {currentEpisode?.number}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player Container */}
            <div
                ref={streaming.playerContainerRef}
                className="relative w-full bg-black aspect-video"
                onMouseMove={streaming.handleMouseMove}
                onMouseLeave={() => streaming.isPlaying && streaming.setShowControls(false)}
            >
                {selectedServer ? (
                    <>
                        {isIframeLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-dark-bg z-10">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-gray-400">Loading player...</p>
                                </div>
                            </div>
                        )}

                        {/* Ads Warning */}
                        {showAdsWarning && selectedServer.hasAds && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-500/90 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                                <AlertTriangle size={16} />
                                <span>This server may contain ads</span>
                            </div>
                        )}

                        <iframe
                            ref={streaming.iframeRef}
                            src={selectedServer.url}
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay; fullscreen; picture-in-picture"
                            frameBorder="0"
                            title={selectedServer.server}
                            onLoad={() => setIsIframeLoading(false)}
                            onError={() => {
                                setIsIframeLoading(false);
                                setError('Failed to load video player');
                            }}
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-top-navigation"
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-bg">
                        <div className="text-center">
                            <MonitorPlay size={48} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No stream available</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Server Selection */}
                {streams?.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <MonitorPlay size={18} className="text-primary-400" />
                            <h3 className="text-sm font-semibold text-white">Video Server</h3>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
                                className="w-full sm:w-72 flex items-center justify-between px-4 py-3 bg-dark-surface border border-dark-border rounded-xl hover:border-primary-400/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <MonitorPlay size={18} className="text-primary-400" />
                                    <span className="text-sm font-medium text-white">
                                        {selectedServer?.server || 'Select Server'}
                                    </span>
                                    {selectedServer?.hasAds && (
                                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-bold">
                                            ADS
                                        </span>
                                    )}
                                </div>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isServerDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isServerDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40 sm:hidden"
                                        onClick={() => setIsServerDropdownOpen(false)}
                                    />
                                    <div className="absolute top-full left-0 right-0 sm:w-72 mt-2 bg-dark-surface border border-dark-border rounded-xl overflow-hidden z-50 shadow-xl max-h-96 overflow-y-auto">
                                        {streams.map((server, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleServerChange(server)}
                                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-dark-card transition-colors ${selectedServer?.url === server.url
                                                        ? 'bg-primary-400/10 border-l-2 border-primary-400'
                                                        : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <MonitorPlay size={16} className={selectedServer?.url === server.url ? 'text-primary-400' : 'text-gray-500'} />
                                                    <span className={`text-sm ${selectedServer?.url === server.url ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                        {server.server}
                                                    </span>
                                                </div>
                                                {server.hasAds && (
                                                    <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-bold">
                                                        ADS
                                                    </span>
                                                )}
                                                {selectedServer?.url === server.url && (
                                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Donghua Info Section */}
                {donghua && (
                    <div className="mb-6 bg-dark-surface rounded-xl border border-dark-border p-4">
                        <div className="flex items-start gap-4">
                            {/* Poster */}
                            <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={donghua.image}
                                    alt={donghua.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(donghua.title?.slice(0, 10))}&background=333&color=fff&size=200`;
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-white mb-1">{donghua.title}</h2>

                                {/* Rating */}
                                {donghua.rating?.value > 0 && (
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm text-white">{donghua.rating.value}</span>
                                        {donghua.rating.votes > 0 && (
                                            <span className="text-xs text-gray-500">({donghua.rating.votes} votes)</span>
                                        )}
                                    </div>
                                )}

                                {/* Sinopsis */}
                                <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                    {donghua.synopsis || 'No synopsis available.'}
                                </p>

                                {/* Genres */}
                                {donghua.genres?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {donghua.genres.map((genre, idx) => (
                                            <span key={idx} className="text-xs px-2 py-1 bg-dark-card rounded-full text-gray-300">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Download Links */}
                {downloads?.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Download size={18} className="text-primary-400" />
                            <h3 className="text-sm font-semibold text-white">Download</h3>
                        </div>

                        <div className="space-y-4">
                            {downloads.map((dl, idx) => (
                                <div key={idx} className="bg-dark-surface rounded-xl border border-dark-border p-3">
                                    <h4 className="text-xs font-medium text-gray-400 mb-2">{dl.title}</h4>
                                    <div className="space-y-2">
                                        {dl.qualities.map((quality, qIdx) => (
                                            <div key={qIdx} className="flex items-start gap-2">
                                                <span className="text-xs font-bold text-primary-400 w-16">{quality.quality}</span>
                                                <div className="flex-1 flex flex-wrap gap-2">
                                                    {quality.links.map((link, lIdx) => (
                                                        <a
                                                            key={lIdx}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-dark-card rounded text-xs text-gray-300 hover:text-primary-400 transition-colors"
                                                        >
                                                            <ExternalLink size={10} />
                                                            {link.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Episodes */}
                {relatedEpisodes?.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Film size={18} className="text-primary-400" />
                            <h3 className="text-sm font-semibold text-white">Related Episodes</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {relatedEpisodes.map((ep, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleEpisodeClick(ep)}
                                    className="p-3 bg-dark-surface border border-dark-border rounded-xl text-left hover:border-primary-400/30 transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-dark-card flex items-center justify-center text-xs font-bold text-gray-500">
                                            {ep.number || idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-300 truncate">
                                                {ep.title}
                                            </p>
                                            {ep.info && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {ep.info}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrev}
                        disabled={!navigation?.prev}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${navigation?.prev
                                ? 'bg-dark-surface border border-dark-border text-white hover:bg-primary-400 hover:text-black hover:border-primary-400'
                                : 'bg-dark-surface/50 border border-dark-border/50 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <SkipBack size={18} />
                        <span>Previous</span>
                    </button>

                    <a
                        href={navigation?.allEpisodes}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-dark-surface border border-dark-border rounded-xl text-sm font-medium text-white hover:bg-primary-400 hover:text-black hover:border-primary-400 transition-all text-center"
                    >
                        All Episodes
                    </a>

                    <button
                        onClick={handleNext}
                        disabled={!navigation?.next}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${navigation?.next
                                ? 'bg-dark-surface border border-dark-border text-white hover:bg-primary-400 hover:text-black hover:border-primary-400'
                                : 'bg-dark-surface/50 border border-dark-border/50 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <span>Next</span>
                        <SkipForward size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StreamingDonghua;