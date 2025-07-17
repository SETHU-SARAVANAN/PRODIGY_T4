export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  roomId?: string;
  isPrivate: boolean;
  recipientId?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  members: string[];
  isPrivate: boolean;
  createdAt: Date;
  lastMessage?: Message;
}

export interface TypingUser {
  userId: string;
  username: string;
  roomId: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'message' | 'room_invite' | 'user_join';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  roomId?: string;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_status' | 'room_update' | 'notification';
  payload: any;
  senderId: string;
  timestamp: Date;
}