import { AppUser } from '../types';

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Giờ cho hôm nay, "Hôm qua", còn lại là ngày/tháng
export const formatChatTime = (timestamp: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  if (isSameDay(date, now)) return formatTime(timestamp);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Hôm qua';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
};

export const formatDate = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const getStatusText = (user?: AppUser) => {
  if (!user) return '';
  if (user.online) return 'Đang hoạt động';
  if (!user.lastSeen) return 'Ngoại tuyến';
  const minutes = Math.floor((Date.now() - user.lastSeen) / 60000);
  if (minutes < 1) return 'Vừa mới hoạt động';
  if (minutes < 60) return `Hoạt động ${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hoạt động ${hours} giờ trước`;
  return `Hoạt động ${formatChatTime(user.lastSeen)}`;
};

export const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
};

// "Trực tuyến" hoặc khoảng thời gian ngắn, dùng cho thẻ danh bạ
export const getShortStatus = (user: AppUser) => {
  if (user.online) return 'Trực tuyến';
  if (!user.lastSeen) return 'Ngoại tuyến';
  const minutes = Math.floor((Date.now() - user.lastSeen) / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
};

export const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 13) return 'Chào buổi trưa';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

// "Nguyễn Việt Anh" -> "Việt Anh"
export const getShortName = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.length >= 3 ? words.slice(-2).join(' ') : name.trim();
};

// Nhãn phân cách ngày trong khung chat
export const formatDayLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  if (isSameDay(date, now)) return 'HÔM NAY';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'HÔM QUA';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const isSameDayTs = (a: number, b: number) =>
  isSameDay(new Date(a), new Date(b));
