export type AppUser = {
  id: string;
  name: string;
  email: string;
  online: boolean;
  lastSeen?: number;
  createdAt?: number;
};

export type MessageType = 'text' | 'location';

export type ChatMessage = {
  id: string;
  senderId: string;
  type: MessageType;
  text?: string;
  latitude?: number;
  longitude?: number;
  createdAt: number;
};

// Một dòng trong userChats/{uid}/{otherUid}
export type ChatSummary = {
  userId: string;
  lastMessage: string;
  lastSenderId?: string;
  lastTime: number;
  unread: number;
};

// Sinh ra từ userChats: mỗi người đã nhắn tới mình là một thông báo
export type AppNotification = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  preview: string;
  time: number;
  read: boolean;
};
