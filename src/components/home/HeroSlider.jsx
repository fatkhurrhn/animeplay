// src/components/home/HeroSlider.jsx
import { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const HeroSlider = ({ items = [], onAnimeSelect, autoPlayInterval = 3000, loading = false }) => {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider) return;
        const index = Math.round(slider.scrollLeft / slider.clientWidth);
        setCurrentIndex(index);
    };

    const scrollToIndex = (index) => {
        const slider = sliderRef.current;
        if (!slider) return;
        slider.scrollTo({
            left: index * slider.clientWidth,
            behavior: "smooth",
        });
    };

    // Auto play
    useEffect(() => {
        if (!items.length || isHovered || loading) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % items.length;
            scrollToIndex(nextIndex);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [currentIndex, items.length, isHovered, autoPlayInterval, loading]);

    // Loading state
    if (loading) {
        return (
            <section className="relative w-full overflow-hidden">
                <div className="w-screen h-[45vh] bg-dark-surface animate-pulse">
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="w-16 h-5 bg-dark-card rounded mb-3" />
                        <div className="w-3/4 h-8 bg-dark-card rounded mb-2" />
                        <div className="w-32 h-4 bg-dark-card rounded mb-3" />
                        <div className="w-24 h-9 bg-dark-card rounded" />
                    </div>
                </div>

                {/* Dots skeleton */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full bg-dark-card ${index === 0 ? 'w-6' : ''
                                }`}
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (!items.length) return null;

    return (
        <section
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onAnimeSelect(item)} // Panggil handler dari props
                        className="snap-center shrink-0 w-screen h-[45vh] relative cursor-pointer"
                    >
                        <img
                            src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=333&color=fff&size=600`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs rounded">
                                {item.source === "samehadaku" || item.type === "Anime" ? "Anime" : "Donghua"}
                            </span>
                            <h1 className="text-xl md:text-3xl font-bold text-white mt-3 mb-1 line-clamp-1">
                                {item.title}
                            </h1>
                            <p className="text-gray-300 text-sm mb-3">
                                {item.episode ? `Episode ${item.episode}` : "Latest Episode"}
                            </p>
                            <button className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-200 transition">
                                <Play size={16} fill="currentColor" />
                                <span>Watch Now</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;