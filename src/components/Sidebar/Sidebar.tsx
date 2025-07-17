import React, { useState } from 'react';
import { User, Room, Notification } from '../../types';
import { RoomList } from './RoomList';
import { UserList } from './UserList';
import { NotificationList } from './NotificationList';
import { Settings, LogOut, Bell, Hash, Users as UsersIcon } from 'lucide-react';

interface SidebarProps {
  user: User;
  rooms: Room[];
  users: User[];
  notifications: Notification[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onUserSelect: (userId: string) => void;
  onCreateRoom: () => void;
  onLogout: () => void;
  onNotificationRead: (notificationId: string) => void;
}

type SidebarTab = 'rooms' | 'users' | 'notifications';

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  rooms,
  users,
  notifications,
  activeRoomId,
  onRoomSelect,
  onUserSelect,
  onCreateRoom,
  onLogout,
  onNotificationRead
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('rooms');
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.username}</h3>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'rooms'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Hash className="w-4 h-4" />
            <span>Rooms</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <UsersIcon className="w-4 h-4" />
            <span>Users</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 px-4 py-3 text-sm font-medium relative ${
            activeTab === 'notifications'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'rooms' && (
          <RoomList
            rooms={rooms}
            activeRoomId={activeRoomId}
            onRoomSelect={onRoomSelect}
            onCreateRoom={onCreateRoom}
          />
        )}
        {activeTab === 'users' && (
          <UserList
            users={users}
            currentUserId={user.id}
            onUserSelect={onUserSelect}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationList
            notifications={notifications}
            onNotificationRead={onNotificationRead}
          />
        )}
      </div>
    </div>
  );
};