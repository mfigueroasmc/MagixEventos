
import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import type { Notification as NotificationType } from '../types';

const NOTIFICATION_ICONS = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
};

const NOTIFICATION_COLORS = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
};

const Notification: React.FC<{ notification: NotificationType, onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(notification.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    return (
        <div className={`flex items-center p-4 mb-4 text-white rounded-lg shadow-lg ${NOTIFICATION_COLORS[notification.type]}`}>
            <span className="mr-3">{NOTIFICATION_ICONS[notification.type]}</span>
            <p className="font-medium">{notification.message}</p>
        </div>
    );
};

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useApp();

    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
            {notifications.map(n => (
                <Notification key={n.id} notification={n} onDismiss={removeNotification} />
            ))}
        </div>
    );
};

export default NotificationContainer;
