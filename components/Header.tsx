
import React from 'react';
import { useApp } from '../contexts/AppContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useApp();

    return (
        <header className="flex items-center justify-end px-6 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
            </div>
        </header>
    );
};

export default Header;
