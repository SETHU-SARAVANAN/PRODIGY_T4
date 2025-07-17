import React from 'react';
import { User } from '../../types';
import { Circle } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUserId: string;
  onUserSelect: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  currentUserId,
  onUserSelect
}) => {
  const otherUsers = users.filter(user => user.id !== currentUserId);

  return (
    <div className="space-y-2">
      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Users
        </h2>
      </div>
      
      <div className="space-y-1">
        {otherUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Circle
                    className={`w-3 h-3 ${
                      user.isOnline ? 'text-green-500 fill-current' : 'text-gray-400'
                    }`}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {user.username}
                  </span>
                  {user.isOnline && (
                    <span className="text-xs text-green-500 font-medium">Online</span>
                  )}
                </div>
                {!user.isOnline && (
                  <p className="text-xs text-gray-500">
                    Last seen {user.lastSeen.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};