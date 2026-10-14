export type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  statusText: string;
  messages: Message[];
};

export type Contact = {
  id: string;
  name: string;
  initials: string;
  online: boolean;
  statusText: string;
  conversationId: string;
};

export type NotificationKind = 'message' | 'friend' | 'system';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  content: string;
  time: string;
  read: boolean;
};

export type User = {
  name: string;
  username: string;
  email: string;
  phone: string;
  joinedDate: string;
};
