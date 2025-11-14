
import { useApp } from '../contexts/AppContext';
import type { NotificationType } from '../types';

export const useNotifications = () => {
    const { addNotification } = useApp();

    const notify = (message: string, type: NotificationType = 'info') => {
        addNotification(message, type);
    };

    return notify;
};
