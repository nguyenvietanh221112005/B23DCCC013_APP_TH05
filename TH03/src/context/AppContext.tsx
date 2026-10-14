import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  AppNotification,
  Contact,
  Conversation,
  Message,
  User,
} from '../types';
import {
  currentUser,
  initialContacts,
  initialConversations,
  initialNotifications,
} from '../data/sampleData';

type AppContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: User;
  conversations: Conversation[];
  contacts: Contact[];
  notifications: AppNotification[];
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (conversationId: string, text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations,
  );
  const [contacts] = useState<Contact[]>(initialContacts);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    initialNotifications,
  );

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const getConversation = (id: string) =>
    conversations.find(c => c.id === id);

  const sendMessage = (conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        const newMessage: Message = {
          id: `m${c.messages.length + 1}-${Date.now()}`,
          text: trimmed,
          time: new Date().toTimeString().slice(0, 5),
          fromMe: true,
        };
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: trimmed,
          time: newMessage.time,
        };
      }),
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadMessagesCount = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations],
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );

  const value: AppContextValue = {
    isLoggedIn,
    login,
    logout,
    user: currentUser,
    conversations,
    contacts,
    notifications,
    unreadMessagesCount,
    unreadNotificationsCount,
    getConversation,
    sendMessage,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
