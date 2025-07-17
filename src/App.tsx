import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useWebSocket } from './hooks/useWebSocket';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatRoom } from './components/Chat/ChatRoom';
import { CreateRoomModal } from './components/Modals/CreateRoomModal';
import { WebSocketMessage } from './types';

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const {
    messages,
    rooms,
    users,
    activeRoom,
    typingUsers,
    notifications,
    setActiveRoom,
    sendMessage,
    sendFile,
    createRoom,
    setUserTyping,
    markNotificationAsRead,
    getMessagesForRoom,
    getPrivateMessages
  } = useChat(user);

  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    // Handle incoming WebSocket messages
    console.log('Received WebSocket message:', message);
    // In a real implementation, you would process different message types
  };

  const { isConnected } = useWebSocket({
    url: 'ws://localhost:3001',
    onMessage: handleWebSocketMessage
  });

  useEffect(() => {
    // Set default active room
    if (rooms.length > 0 && !activeRoom) {
      setActiveRoom(rooms[0].id);
    }
  }, [rooms, activeRoom, setActiveRoom]);

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    setSelectedUser(null);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setActiveRoom(null);
  };

  const handleSendMessage = (content: string) => {
    if (activeRoom) {
      sendMessage(content, activeRoom);
    } else if (selectedUser) {
      sendMessage(content, undefined, selectedUser);
    }
  };

  const handleSendFile = (file: File) => {
    if (activeRoom) {
      sendFile(file, activeRoom);
    } else if (selectedUser) {
      sendFile(file, undefined, selectedUser);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (activeRoom) {
      setUserTyping(activeRoom, isTyping);
    }
  };

  const handleCreateRoom = (name: string, description?: string) => {
    const roomId = createRoom(name, description);
    if (roomId) {
      setActiveRoom(roomId);
    }
  };

  const getCurrentMessages = () => {
    if (activeRoom) {
      return getMessagesForRoom(activeRoom);
    } else if (selectedUser) {
      return getPrivateMessages(selectedUser);
    }
    return [];
  };

  const getCurrentRoom = () => {
    if (activeRoom) {
      return rooms.find(r => r.id === activeRoom);
    } else if (selectedUser) {
      const selectedUserData = users.find(u => u.id === selectedUser);
      if (selectedUserData) {
        return {
          id: selectedUser,
          name: selectedUserData.username,
          description: 'Private conversation',
          members: [user!.id, selectedUser],
          isPrivate: true,
          createdAt: new Date()
        };
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  const currentRoom = getCurrentRoom();
  const currentMessages = getCurrentMessages();

  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar
        user={user}
        rooms={rooms}
        users={users}
        notifications={notifications}
        activeRoomId={activeRoom}
        onRoomSelect={handleRoomSelect}
        onUserSelect={handleUserSelect}
        onCreateRoom={() => setIsCreateRoomModalOpen(true)}
        onLogout={logout}
        onNotificationRead={markNotificationAsRead}
      />

      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <ChatRoom
            room={currentRoom}
            messages={currentMessages}
            currentUserId={user.id}
            typingUsers={typingUsers}
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
            onTyping={handleTyping}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to ChatApp!</h2>
              <p>Select a room or user to start chatting</p>
              {!isConnected && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800">
                    Connecting to server... Some features may be limited.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}

export default App;