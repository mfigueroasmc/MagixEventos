
import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Articulos from './components/Articulos';
import Eventos from './components/Eventos';
import Chatbot from './components/Chatbot';
import NotificationContainer from './components/Notification';

type View = 'dashboard' | 'eventos' | 'articulos' | 'reservas';

const MainContent: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const { theme } = useApp();

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard />;
            case 'eventos':
                return <Eventos />;
            case 'articulos':
                return <Articulos />;
            case 'reservas':
                 return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Reservations module is under construction.</div>;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className={`${theme} transition-colors duration-300 font-sans`}>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                        <div className="container mx-auto px-6 py-8">
                            {renderView()}
                        </div>
                    </main>
                </div>
                <Chatbot />
                <NotificationContainer />
            </div>
        </div>
    );
};


const App: React.FC = () => (
    <AppProvider>
        <MainContent />
    </AppProvider>
);

export default App;
