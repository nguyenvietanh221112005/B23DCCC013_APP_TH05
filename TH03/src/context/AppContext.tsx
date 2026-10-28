import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import type { User as FirebaseUser } from 'firebase/auth';
import { AppNotification, AppUser, ChatSummary } from '../types';
import { logout as firebaseLogout, subscribeAuth } from '../services/authService';
import {
  setOnlineStatus,
  startPresence,
  subscribeUsers,
} from '../services/userService';
import { markChatAsRead, subscribeUserChats } from '../services/chatService';

export type Conversation = ChatSummary & { user: AppUser };

type AppContextValue = {
  initializing: boolean;
  authUser: FirebaseUser | null;
  profile: AppUser | null;
  contacts: AppUser[];
  conversations: Conversation[];
  getUser: (id: string) => AppUser | undefined;
  logout: () => Promise<void>;
  notifications: AppNotification[];
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initializing, setInitializing] = useState(true);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [chats, setChats] = useState<ChatSummary[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeAuth(user => {
      setAuthUser(user);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const uid = authUser?.uid;

  // Chỉ lắng nghe dữ liệu khi đã đăng nhập, và hủy hết khi đăng xuất
  useEffect(() => {
    if (!uid) {
      setUsers([]);
      setChats([]);
      return;
    }

    const unsubscribeUsers = subscribeUsers(setUsers);
    const unsubscribeChats = subscribeUserChats(uid, setChats);
    const unsubscribePresence = startPresence(uid);

    // Ẩn app xuống nền thì offline, mở lại thì online
    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') setOnlineStatus(uid, true).catch(() => {});
      else if (state === 'background') {
        setOnlineStatus(uid, false).catch(() => {});
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeChats();
      unsubscribePresence();
      appStateSub.remove();
    };
  }, [uid]);

  const profile = useMemo(() => {
    if (!authUser) return null;
    return (
      users.find(u => u.id === authUser.uid) ?? {
        id: authUser.uid,
        name: authUser.displayName || authUser.email || '',
        email: authUser.email ?? '',
        online: true,
      }
    );
  }, [users, authUser]);

  const contacts = useMemo(
    () =>
      users
        .filter(u => u.id !== uid)
        .sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    [users, uid],
  );

  const conversations = useMemo(() => {
    const result: Conversation[] = [];
    chats.forEach(chat => {
      const user = users.find(u => u.id === chat.userId);
      if (user) result.push({ ...chat, user });
    });
    return result.sort((a, b) => b.lastTime - a.lastTime);
  }, [chats, users]);

  const getUser = (id: string) => users.find(u => u.id === id);

  // Chỉ lấy cuộc trò chuyện mà tin cuối do người kia gửi.
  // Đã đọc = unread về 0, nên khớp với tab Tin nhắn và lưu trên Firebase.
  const notifications = useMemo<AppNotification[]>(
    () =>
      conversations
        .filter(c => c.lastSenderId && c.lastSenderId !== uid)
        .map(c => ({
          id: c.userId,
          userId: c.userId,
          userName: c.user.name,
          content:
            c.unread > 0
              ? `${c.user.name} đã gửi cho bạn ${c.unread} tin nhắn mới`
              : `${c.user.name} đã nhắn tin cho bạn`,
          preview: c.lastMessage,
          time: c.lastTime,
          read: c.unread === 0,
        })),
    [conversations, uid],
  );

  const markNotificationRead = (id: string) => {
    if (!uid) return;
    markChatAsRead(uid, id).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    if (!uid) return;
    notifications
      .filter(n => !n.read)
      .forEach(n => markChatAsRead(uid, n.userId).catch(() => {}));
  };

  const unreadMessagesCount = useMemo(
    () => chats.reduce((sum, c) => sum + c.unread, 0),
    [chats],
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );

  const value: AppContextValue = {
    initializing,
    authUser,
    profile,
    contacts,
    conversations,
    getUser,
    logout: firebaseLogout,
    notifications,
    unreadMessagesCount,
    unreadNotificationsCount,
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
