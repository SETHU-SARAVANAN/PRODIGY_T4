import React from 'react';
import { Notification } from '../../types';
import { MessageCircle, UserPlus, Hash, Check } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationRead: (notificationId: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationRead
}) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'user_join':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'room_invite':
        return <Hash className="w-5 h-5 text-purple-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-lg border ${
            notification.isRead
              ? 'bg-white border-gray-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatTime(notification.timestamp)}
              </p>
            </div>
            {!notification.isRead && (
              <button
                onClick={() => onNotificationRead(notification.id)}
                className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Check className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};