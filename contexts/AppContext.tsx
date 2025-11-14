
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Notification, NotificationType } from '../types';

type Theme = 'light' | 'dark';

interface AppContextType {
    theme: Theme;
    toggleTheme: () => void;
    notifications: Notification[];
    addNotification: (message: string, type: NotificationType) => void;
    removeNotification: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme') as Theme;
        return storedTheme || 'light';
      }
      return 'light';
    });
    
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem('theme', newTheme);
            }
            return newTheme;
        });
    }, []);

    const addNotification = useCallback((message: string, type: NotificationType) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const value = { theme, toggleTheme, notifications, addNotification, removeNotification };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
