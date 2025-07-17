import React from 'react';
import { TypingUser } from '../../types';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  roomId: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  roomId
}) => {
  const roomTypingUsers = typingUsers.filter(user => user.roomId === roomId);
  
  if (roomTypingUsers.length === 0) return null;

  const getTypingText = () => {
    if (roomTypingUsers.length === 1) {
      return `${roomTypingUsers[0].username} is typing...`;
    } else if (roomTypingUsers.length === 2) {
      return `${roomTypingUsers[0].username} and ${roomTypingUsers[1].username} are typing...`;
    } else {
      return `${roomTypingUsers[0].username} and ${roomTypingUsers.length - 1} others are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
};