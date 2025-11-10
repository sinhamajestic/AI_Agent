
import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, MenuIcon, FilterIcon, ChevronDownIcon, XCircleIcon } from './Icons';

interface HeaderProps {
  pageTitle: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    setSearchQuery('');
    setActiveFilter(null);
  };

  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex-shrink-0 bg-base-bg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
            >
              <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block" ref={dropdownRef}>
            <div className="flex items-center w-72">
              <div className="relative flex-grow">
                <input
                  type="search"
                  placeholder={activeFilter ? `Filter by ${activeFilter}...` : "Search..."}
                  className="w-full pl-4 pr-10 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {(searchQuery || activeFilter) && (
                  <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Clear search and filters"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
               <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center px-3 h-full bg-gray-100 border-l border-gray-200 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <FilterIcon className={`w-5 h-5 transition-colors ${activeFilter ? 'text-accent-primary' : 'text-gray-500'}`} />
                <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500" />
              </button>
            </div>

            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-base-bg rounded-xl shadow-lg border border-border z-10"
              >
                <div className="py-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Filter by</div>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterSelect('Date'); }} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1">Date</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterSelect('Source'); }} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1">Source</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterSelect('Priority'); }} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1">Priority</a>
                </div>
              </div>
            )}
          </div>
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary">
            <BellIcon />
          </button>
          <div className="flex-shrink-0">
            <img
              className="w-8 h-8 rounded-full"
              src="https://picsum.photos/100/100"
              alt="User profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
