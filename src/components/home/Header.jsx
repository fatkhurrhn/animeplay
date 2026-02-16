import { Search, Bell, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ scrolled }) => {
    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
            }`}>
            <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">
                        <span className="text-white">Anime</span>
                        <span className="text-primary-400">Play</span>
                    </span>

                </div>

                <div className="flex items-center space-x-3">
                    <Link
                    to="/search" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Search size={20} className="text-gray-300" />
                    </Link>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                        <Bell size={20} className="text-gray-300" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-400 rounded-full" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;