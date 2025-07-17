import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, email: string): Promise<boolean> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        isOnline: true,
        lastSeen: new Date()
      };
      
      setUser(newUser);
      localStorage.setItem('chatUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
  };

  const updateUserStatus = (isOnline: boolean) => {
    if (user) {
      const updatedUser = {
        ...user,
        isOnline,
        lastSeen: new Date()
      };
      setUser(updatedUser);
      localStorage.setItem('chatUser', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    updateUserStatus
  };
};