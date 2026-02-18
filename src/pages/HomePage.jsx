// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import HeroSlider from '../components/home/HeroSlider';
import ContinueWatching from '../components/home/ContinueWatching';
import ContentGrid from '../components/home/ContentGrid';
import { useHomeData } from '../hooks/useHomeData';
import { getHistory, removeFromHistory, clearHistory } from '../utils/history';
import AnimeMovie from '../components/home/AnimeMovie';
import PopularTodaySection from '../components/home/PopularToday';

const HomePage = () => { // Hapus props onAnimeSelect karena gak dipake
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [watchHistory, setWatchHistory] = useState([]);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);


  const {
    latestData,
    animeData,
    donghuaData,
    loading,
    getFilteredData
  } = useHomeData();

  useEffect(() => {
    setHistoryLoading(true);

    setTimeout(() => {
      const history = getHistory();
      setWatchHistory(history);
      setHistoryLoading(false);
    }, 800); // delay biar skeleton keliatan smooth
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // src/pages/HomePage.jsx - bagian handleAnimeSelect

  // src/pages/HomePage.jsx - bagian handleAnimeSelect

  const handleAnimeSelect = (item) => {
    // Tentukan kategori berdasarkan source atau type
    const category = item.source === 'samehadaku' || item.type === 'Anime' ? 'anime' : 'donghua';

    // Dapatkan URL yang benar (ada di item.url atau item.link)
    let itemUrl = item.url || item.link;

    if (!itemUrl) {
      console.error('No URL found for item:', item);
      return;
    }

    // Bersihkan URL dari trailing slash ganda
    itemUrl = itemUrl.replace(/\/+$/, ''); // Hapus trailing slash

    console.log('Navigating to detail with URL:', itemUrl); // Debug

    // Encode URL untuk parameter route
    const encodedUrl = encodeURIComponent(itemUrl);

    // Navigasi ke halaman detail
    navigate(`/detail/${category}/${encodedUrl}`);
  };

  const handleContinueWatching = (item) => {
    // Tentukan path berdasarkan kategori
    const path = item.category === 'anime' ? '/anime/watch' : '/donghua/watch';

    // Gunakan episodeUrl yang ada di item
    const episodeUrl = item.episodeUrl || item.url;

    navigate(`${path}?url=${encodeURIComponent(episodeUrl)}`);
  };

  // Handle remove from history
  const handleRemoveFromHistory = (e, id) => {
    e.stopPropagation();
    const newHistory = removeFromHistory(id);
    setWatchHistory(newHistory);
  };

  // Handle clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Clear all watch history?')) {
      const newHistory = clearHistory();
      setWatchHistory(newHistory);
    }
  };

  // Get random 5 items for hero slider
  const getHeroItems = () => {
    if (loading) return [];

    const combined = [
      ...(Array.isArray(animeData) ? animeData.slice(0, 3) : []),
      ...(Array.isArray(donghuaData) ? donghuaData.slice(0, 2) : [])
    ];

    // Acak array
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined.slice(0, 5);
  };

  const heroItems = getHeroItems();

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header scrolled={headerScrolled} />

      <div className="pt-14">
        <HeroSlider
          items={heroItems}
          onAnimeSelect={handleAnimeSelect}
          autoPlayInterval={3000}
          loading={loading}
        />

        <ContinueWatching
          history={watchHistory}
          isLoading={historyLoading}
          onContinue={handleContinueWatching}
          onRemove={handleRemoveFromHistory}
          onClearAll={handleClearAllHistory}
        />


        <ContentGrid
          items={getFilteredData(activeCategory)}
          loading={loading}
          onItemClick={handleAnimeSelect}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <PopularTodaySection/>
        <AnimeMovie/>
      </div>
    </div>
  );
};

export default HomePage;