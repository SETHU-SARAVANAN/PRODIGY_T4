import { useState, useEffect, useCallback } from 'react';
import { Message, Room, User, TypingUser, Notification } from '../types';

export const useChat = (currentUser: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedRooms = localStorage.getItem('chatRooms');
    const savedUsers = localStorage.getItem('chatUsers');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      // Initialize with default rooms
      const defaultRooms: Room[] = [
        {
          id: 'general',
          name: 'General',
          description: 'General discussion for everyone',
          members: [],
          isPrivate: false,
          createdAt: new Date()
        },
        {
          id: 'random',
          name: 'Random',
          description: 'Random chats and fun',
          members: [],
          isPrivate: false,
          createdAt: new Date()
        }
      ];
      setRooms(defaultRooms);
      localStorage.setItem('chatRooms', JSON.stringify(defaultRooms));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('chatUsers', JSON.stringify(users));
  }, [users]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Update room's last message
    setRooms(prev => prev.map(room => 
      room.id === message.roomId 
        ? { ...room, lastMessage: message }
        : room
    ));
    
    // Add notification if not from current user
    if (currentUser && message.senderId !== currentUser.id) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'message',
        title: `New message from ${message.senderUsername}`,
        message: message.content,
        timestamp: new Date(),
        isRead: false,
        roomId: message.roomId
      };
      setNotifications(prev => [...prev, notification]);
    }
  }, [currentUser]);

  const sendMessage = useCallback((content: string, roomId?: string, recipientId?: string) => {
    if (!currentUser) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      content,
      timestamp: new Date(),
      type: 'text',
      roomId,
      isPrivate: !!recipientId,
      recipientId,
      status: 'sent'
    };

    addMessage(message);
  }, [currentUser, addMessage]);

  const sendFile = useCallback((file: File, roomId?: string, recipientId?: string) => {
    if (!currentUser) return;

    const fileUrl = URL.createObjectURL(file);
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      content: `Shared ${file.type.startsWith('image/') ? 'an image' : 'a file'}`,
      timestamp: new Date(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      fileUrl,
      fileName: file.name,
      roomId,
      isPrivate: !!recipientId,
      recipientId,
      status: 'sent'
    };

    addMessage(message);
  }, [currentUser, addMessage]);

  const createRoom = useCallback((name: string, description?: string) => {
    if (!currentUser) return;

    const room: Room = {
      id: Date.now().toString(),
      name,
      description,
      members: [currentUser.id],
      isPrivate: false,
      createdAt: new Date()
    };

    setRooms(prev => [...prev, room]);
    return room.id;
  }, [currentUser]);

  const joinRoom = useCallback((roomId: string) => {
    if (!currentUser) return;

    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, members: [...room.members, currentUser.id] }
        : room
    ));
  }, [currentUser]);

  const setUserTyping = useCallback((roomId: string, isTyping: boolean) => {
    if (!currentUser) return;

    if (isTyping) {
      setTypingUsers(prev => [
        ...prev.filter(u => u.userId !== currentUser.id || u.roomId !== roomId),
        { userId: currentUser.id, username: currentUser.username, roomId, timestamp: new Date() }
      ]);
    } else {
      setTypingUsers(prev => prev.filter(u => u.userId !== currentUser.id || u.roomId !== roomId));
    }
  }, [currentUser]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  }, []);

  const getMessagesForRoom = useCallback((roomId: string) => {
    return messages.filter(m => m.roomId === roomId);
  }, [messages]);

  const getPrivateMessages = useCallback((otherUserId: string) => {
    if (!currentUser) return [];
    return messages.filter(m => 
      m.isPrivate && (
        (m.senderId === currentUser.id && m.recipientId === otherUserId) ||
        (m.senderId === otherUserId && m.recipientId === currentUser.id)
      )
    );
  }, [messages, currentUser]);

  return {
    messages,
    rooms,
    users,
    activeRoom,
    typingUsers,
    notifications,
    setActiveRoom,
    addMessage,
    sendMessage,
    sendFile,
    createRoom,
    joinRoom,
    setUserTyping,
    markNotificationAsRead,
    getMessagesForRoom,
    getPrivateMessages
  };
};