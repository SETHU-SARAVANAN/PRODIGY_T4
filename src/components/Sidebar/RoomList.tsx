import React from 'react';
import { Room } from '../../types';
import { Hash, Lock, Plus } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: () => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  activeRoomId,
  onRoomSelect,
  onCreateRoom
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Rooms
        </h2>
        <button
          onClick={onCreateRoom}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
              activeRoomId === room.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {room.isPrivate ? (
                  <Lock className="w-4 h-4 text-gray-500" />
                ) : (
                  <Hash className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {room.name}
                  </span>
                  {room.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatTime(room.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {room.lastMessage && (
                  <p className="text-xs text-gray-500 truncate">
                    {room.lastMessage.senderUsername}: {room.lastMessage.content}
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