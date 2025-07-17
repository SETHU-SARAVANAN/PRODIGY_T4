import React from 'react';
import { Message } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import { Check, CheckCheck, Download, Eye } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true
}) => {
  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <img
              src={message.fileUrl}
              alt={message.fileName}
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
            <p className="text-sm">{message.content}</p>
          </div>
        );
      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{message.fileName}</p>
                <p className="text-xs text-gray-500">{message.content}</p>
              </div>
              <button
                onClick={() => handleFileDownload(message.fileUrl!, message.fileName!)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
            {message.senderUsername[0].toUpperCase()}
          </div>
        )}
        
        <div className="flex flex-col">
          {!isOwn && (
            <span className="text-xs text-gray-500 mb-1 ml-1">
              {message.senderUsername}
            </span>
          )}
          
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }`}
          >
            {renderMessageContent()}
          </div>
          
          <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwn && getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};