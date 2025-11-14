
import React from 'react';
import DashboardIcon from './icons/DashboardIcon';
import EventsIcon from './icons/EventsIcon';
import ItemsIcon from './icons/ItemsIcon';
import BookingIcon from './icons/BookingIcon';

type View = 'dashboard' | 'eventos' | 'articulos' | 'reservas';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'eventos', label: 'Eventos', icon: EventsIcon },
        { id: 'articulos', label: 'Artículos', icon: ItemsIcon },
        { id: 'reservas', label: 'Reservas', icon: BookingIcon },
    ];

    const NavLink: React.FC<{item: typeof navItems[0]}> = ({ item }) => {
        const isActive = activeView === item.id;
        return (
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveView(item.id as View);
                }}
                className={`flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300' : ''
                }`}
            >
                <item.icon className="h-5 w-5" />
                <span className="mx-4 font-medium">{item.label}</span>
            </a>
        );
    };

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-md">
            <div className="flex items-center justify-center h-20 shadow-sm">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-300">AV Manager</h1>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map(item => (
                    <NavLink key={item.id} item={item} />
                ))}
            </nav>
            <div className="px-4 py-4">
                 <p className="text-xs text-center text-gray-400 dark:text-gray-500">© 2024 AV Pro</p>
            </div>
        </aside>
    );
};

export default Sidebar;
