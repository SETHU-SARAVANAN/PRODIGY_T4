import React, { useEffect, useRef } from 'react';
import { Message, Room, TypingUser } from '../../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { Hash, Users } from 'lucide-react';

interface ChatRoomProps {
  room: Room;
  messages: Message[];
  currentUserId: string;
  typingUsers: TypingUser[];
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  onTyping: (isTyping: boolean) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  room,
  messages,
  currentUserId,
  typingUsers,
  onSendMessage,
  onSendFile,
  onTyping
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {room.isPrivate ? (
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {room.name[0]}
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Hash className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{room.name}</h1>
            {room.description && (
              <p className="text-sm text-gray-500">{room.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{room.members.length}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))
        )}
        
        <TypingIndicator typingUsers={typingUsers} roomId={room.id} />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onSendFile={onSendFile}
        onTyping={onTyping}
      />
    </div>
  );
};