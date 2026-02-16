// src/pages/DetailPage/DetailAnime.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play,
    Star,
    Calendar,
    Clock,
    Film,
    Bookmark,
    Share2,
    ChevronLeft,
    Flag,
    Monitor
} from 'lucide-react';
import { useDetailData } from '../../hooks/useDetailData';
import { addToHistory } from '../../utils/history';

const DetailAnime = () => {
    const navigate = useNavigate();
    const { detail, loading, error } = useDetailData();
    const [activeTab, setActiveTab] = useState('episodes');
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleWatchEpisode = (episode) => {
        if (!detail) return;

        // Add to history
        addToHistory(
            {
                title: detail.title,
                image: detail.image,
                url: detail.url || window.location.href,
                source: detail.source,
                category: detail.category
            },
            {
                title: episode.title || `Episode ${episode.number || episode.episode}`,
                url: episode.url,
                episode: episode.number || episode.episode
            }
        );

        // Navigasi ke halaman streaming dengan query parameter URL episode
        // PERBAIKAN: Gunakan encodeURIComponent untuk URL episode
        navigate(`/anime/watch?url=${encodeURIComponent(episode.url)}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg">
                <div className="fixed top-0 left-0 right-0 z-50 bg-dark-surface/80 backdrop-blur-lg border-b border-dark-border">
                    <div className="flex items-center px-4 h-14">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
                            <ChevronLeft size={20} className="text-white" />
                        </button>
                        <div className="ml-2 h-5 w-48 bg-dark-card rounded animate-pulse" />
                    </div>
                </div>

                <div className="pt-14">
                    <div className="relative w-full h-[50vh] bg-dark-surface animate-pulse" />
                    <div className="px-4 -mt-20 relative z-10">
                        <div className="flex items-end gap-4 mb-4">
                            <div className="w-24 h-32 rounded-lg bg-dark-card animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-8 w-3/4 bg-dark-card rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-dark-card rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-8 w-20 bg-dark-card rounded-full animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Anime</h2>
                    <p className="text-gray-400 mb-4">{error || 'Anime not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-primary-400 text-black rounded-lg font-semibold hover:bg-primary-500 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg pb-6">
            {/* Sticky Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-dark-surface/80 backdrop-blur-lg border-b border-dark-border">
                <div className="flex items-center justify-between px-4 h-14">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
                            <ChevronLeft size={20} className="text-white" />
                        </button>
                        <h1 className="ml-2 text-lg font-semibold text-white line-clamp-1">
                            {detail.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setBookmarked(!bookmarked)}
                            className="p-2 hover:bg-white/10 rounded-full transition"
                        >
                            <Bookmark
                                size={20}
                                className={bookmarked ? 'fill-primary-400 text-primary-400' : 'text-gray-300'}
                            />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition">
                            <Share2 size={20} className="text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="relative w-full h-[50vh]">
                <img
                    src={detail.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.title)}&background=333&color=fff&size=600`}
                    alt={detail.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-20 left-4">
                    <span className="px-3 py-1 bg-primary-400 text-black text-xs font-bold rounded-full">
                        Anime
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 -mt-20 relative z-10">
                {/* Title and Poster Row */}
                <div className="flex items-end gap-4 mb-4">
                    <div className="w-24 h-32 rounded-lg overflow-hidden shadow-lg border-2 border-dark-border flex-shrink-0">
                        <img
                            src={detail.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.title)}&background=333&color=fff&size=200`}
                            alt={detail.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white mb-1">{detail.title}</h1>
                        {detail.altTitles && detail.altTitles.length > 0 && (
                            <p className="text-sm text-gray-400">{detail.altTitles.join(' • ')}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => handleWatchEpisode(detail.episodes?.[0])}
                        className="flex-1 bg-primary-400 text-black py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-500 transition"
                    >
                        <Play size={18} fill="currentColor" />
                        <span>Watch Now</span>
                    </button>
                    <button className="px-4 py-3 bg-dark-surface border border-dark-border rounded-lg hover:border-primary-400/50 transition">
                        <Bookmark size={18} className="text-gray-300" />
                    </button>
                </div>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {detail.status && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.status}
                        </span>
                    )}
                    {detail.type && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.type}
                        </span>
                    )}
                    {detail.totalEpisodes > 0 && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.totalEpisodes} Episodes
                        </span>
                    )}
                    {detail.released && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.released}
                        </span>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-dark-border mb-6">
                    <button
                        onClick={() => setActiveTab('episodes')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'episodes'
                                ? 'text-primary-400 border-b-2 border-primary-400'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        Episodes ({detail.episodes?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'details'
                                ? 'text-primary-400 border-b-2 border-primary-400'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        Details
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'episodes' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold">
                                {detail.episodes?.length || 0} Episodes
                            </h3>
                            <select className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-sm text-gray-300">
                                <option>Latest First</option>
                                <option>Oldest First</option>
                            </select>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {detail.episodes?.map((episode, index) => {
                                const episodeNumber = episode.number ||
                                    episode.episode ||
                                    (episode.title?.match(/\d+/) || [index + 1])[0];
                                const episodeTitle = episode.title || `Episode ${episodeNumber}`;
                                const episodeDate = episode.date || '';

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleWatchEpisode(episode)}
                                        className="w-full flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-dark-border hover:border-primary-400/50 transition group"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 bg-primary-400/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-primary-400 font-semibold text-sm">
                                                    {episodeNumber}
                                                </span>
                                            </div>
                                            <div className="text-left flex-1">
                                                <h4 className="text-sm font-medium text-white group-hover:text-primary-400 transition">
                                                    {episodeTitle}
                                                </h4>
                                                {episodeDate && (
                                                    <p className="text-xs text-gray-500">{episodeDate}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Play size={16} className="text-gray-500 group-hover:text-primary-400 transition flex-shrink-0" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="space-y-6">
                        {/* Synopsis */}
                        <div>
                            <h3 className="text-white font-semibold mb-2">Synopsis</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {detail.description || 'No synopsis available.'}
                            </p>
                        </div>

                        {/* Information Grid */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Information</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {detail.status && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Flag size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Status:</span>
                                        <span className="text-white ml-auto">{detail.status}</span>
                                    </div>
                                )}
                                {detail.type && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Film size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Type:</span>
                                        <span className="text-white ml-auto">{detail.type}</span>
                                    </div>
                                )}
                                {detail.totalEpisodes > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Monitor size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Episodes:</span>
                                        <span className="text-white ml-auto">{detail.totalEpisodes}</span>
                                    </div>
                                )}
                                {detail.released && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Released:</span>
                                        <span className="text-white ml-auto">{detail.released}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Genres - jika ada */}
                        {detail.genres && detail.genres.length > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {detail.genres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailAnime;