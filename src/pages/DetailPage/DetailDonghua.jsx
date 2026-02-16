// src/pages/DetailPage/DetailDonghua.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play,
    Star,
    Calendar,
    Clock,
    Film,
    Users,
    Bookmark,
    Share2,
    ChevronLeft,
    Globe,
    Flag,
    Monitor,
    Award,
    User,
    CalendarClock,
    Heart
} from 'lucide-react';
import { useDetailData } from '../../hooks/useDetailData';
import { addToHistory } from '../../utils/history';

const DetailDonghua = () => {
    const navigate = useNavigate();
    const { detail, loading, error } = useDetailData();
    const [activeTab, setActiveTab] = useState('episodes');
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleWatchEpisode = (episode) => {
        if (!detail) return;

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

        // Navigasi ke halaman streaming donghua dengan query parameter
        navigate(`/donghua/watch?url=${encodeURIComponent(episode.url)}`);
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
                            {[...Array(6)].map((_, i) => (
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
                    <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Donghua</h2>
                    <p className="text-gray-400 mb-4">{error || 'Donghua not found'}</p>
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

    const ratingValue = detail.rating?.value || 0;
    const ratingPercentage = detail.rating?.percentage || ratingValue * 10 || 0;

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
                        Donghua
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
                            <div className="flex flex-wrap gap-1">
                                {detail.altTitles.map((alt, index) => (
                                    <span key={index} className="text-sm text-gray-400">
                                        {alt}{index < detail.altTitles.length - 1 ? ' • ' : ''}
                                    </span>
                                ))}
                            </div>
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
                    {detail.duration && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.duration}
                        </span>
                    )}
                    {detail.released && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.released}
                        </span>
                    )}
                    {detail.country && detail.country !== 'China' && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border">
                            {detail.country}
                        </span>
                    )}
                    {detail.followers > 0 && (
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border flex items-center gap-1">
                            <Heart size={12} className="text-red-400" />
                            {detail.followers} Followers
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
                    {detail.characters?.length > 0 && (
                        <button
                            onClick={() => setActiveTab('characters')}
                            className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'characters'
                                    ? 'text-primary-400 border-b-2 border-primary-400'
                                    : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            Characters
                        </button>
                    )}
                </div>


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
                            {detail.episodes && detail.episodes.length > 0 ? (
                                detail.episodes.map((episode, index) => {
                                    // Handle berbagai format episode
                                    const episodeNumber = episode.number ||
                                        episode.episode ||
                                        (episode.title?.match(/\d+/) || [index + 1])[0];

                                    const episodeTitle = episode.title || `Episode ${episodeNumber}`;
                                    const episodeDate = episode.releaseDate || episode.date || '';
                                    const hasSubtitle = episode.hasSubtitle || false;

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
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-medium text-white group-hover:text-primary-400 transition">
                                                            {episodeTitle}
                                                        </h4>
                                                        {hasSubtitle && (
                                                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">
                                                                SUB
                                                            </span>
                                                        )}
                                                    </div>
                                                    {episodeDate && (
                                                        <p className="text-xs text-gray-500">{episodeDate}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <Play size={16} className="text-gray-500 group-hover:text-primary-400 transition flex-shrink-0" />
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No episodes available
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="space-y-6">
                        {/* Synopsis */}
                        <div>
                            <h3 className="text-white font-semibold mb-2">Synopsis</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {detail.description || detail.synopsis || 'No synopsis available.'}
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
                                {detail.studio && detail.studio !== 'Unknown' && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Studio:</span>
                                        <span className="text-white ml-auto">{detail.studio}</span>
                                    </div>
                                )}
                                {detail.network && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Globe size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Network:</span>
                                        <span className="text-white ml-auto">{detail.network}</span>
                                    </div>
                                )}
                                {detail.released && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Released:</span>
                                        <span className="text-white ml-auto">{detail.released}</span>
                                    </div>
                                )}
                                {detail.duration && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Duration:</span>
                                        <span className="text-white ml-auto">{detail.duration}</span>
                                    </div>
                                )}
                                {detail.season && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarClock size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Season:</span>
                                        <span className="text-white ml-auto">{detail.season}</span>
                                    </div>
                                )}
                                {detail.country && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Flag size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Country:</span>
                                        <span className="text-white ml-auto">{detail.country}</span>
                                    </div>
                                )}
                                {detail.fansub && (
                                    <div className="flex items-center gap-2 text-sm col-span-2">
                                        <Award size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Fansub:</span>
                                        <span className="text-white ml-auto">{detail.fansub}</span>
                                    </div>
                                )}
                                {detail.postedBy && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <User size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Posted:</span>
                                        <span className="text-white ml-auto">{detail.postedBy}</span>
                                    </div>
                                )}
                                {detail.postedOn && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Posted on:</span>
                                        <span className="text-white ml-auto">{detail.postedOn}</span>
                                    </div>
                                )}
                                {detail.updatedOn && (
                                    <div className="flex items-center gap-2 text-sm col-span-2">
                                        <Clock size={14} className="text-gray-500" />
                                        <span className="text-gray-400">Updated:</span>
                                        <span className="text-white ml-auto">{detail.updatedOn}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Genres */}
                        {detail.genres && detail.genres.length > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-2">
                                    {detail.genres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-300 border border-dark-border hover:border-primary-400/50 transition cursor-pointer"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rating */}
                        {ratingValue > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-2">Rating</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-white font-bold text-lg">{ratingValue}</span>
                                    </div>
                                    <div className="flex-1 h-2 bg-dark-surface rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full"
                                            style={{ width: `${ratingPercentage}%` }}
                                        />
                                    </div>
                                    {detail.rating?.votes > 0 && (
                                        <span className="text-xs text-gray-500">
                                            ({detail.rating.votes} votes)
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'characters' && detail.characters?.length > 0 && (
                    <div>
                        <h3 className="text-white font-semibold mb-3">Characters</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {detail.characters.map((char, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-dark-surface rounded-lg border border-dark-border">
                                    {char.image ? (
                                        <img
                                            src={char.image}
                                            alt={char.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-primary-400/20 flex items-center justify-center">
                                            <User size={20} className="text-primary-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{char.name}</p>
                                        <p className="text-xs text-gray-500">{char.role || 'Character'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailDonghua;