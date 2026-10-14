import { AppNotification, Contact, Conversation, User } from '../types';

export const currentUser: User = {
  name: 'Nguyễn Việt Anh',
  username: 'vietanh',
  email: 'vietanh@example.com',
  phone: '090 123 4567',
  joinedDate: '14/10/2026',
};

export const initialConversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Nguyễn Minh Anh',
    initials: 'MA',
    lastMessage: 'Tối nay đi ăn lẩu không?',
    time: '14:02',
    unreadCount: 3,
    online: true,
    statusText: 'Đang hoạt động',
    messages: [
      { id: 'm1', text: 'Chào bạn, chiều nay rảnh không?', time: '13:58', fromMe: false },
      { id: 'm2', text: 'Rảnh nè, có gì vui không?', time: '13:59', fromMe: true },
      { id: 'm3', text: 'Nhóm mình định đi ăn ở quán mới mở gần trường', time: '14:00', fromMe: false },
      { id: 'm4', text: 'Tối nay đi ăn lẩu không?', time: '14:02', fromMe: false },
    ],
  },
  {
    id: 'c2',
    name: 'Nhóm Lớp CNTT K21',
    initials: 'CK',
    lastMessage: 'Lan: Mai nộp bài trước 9 giờ nhé',
    time: '13:45',
    unreadCount: 12,
    online: false,
    statusText: 'Hoạt động gần đây',
    messages: [
      { id: 'm1', text: 'Mọi người nhớ nộp bài tập nhóm nhé', time: '13:30', fromMe: false },
      { id: 'm2', text: 'Mình nộp rồi ạ', time: '13:40', fromMe: true },
      { id: 'm3', text: 'Lan: Mai nộp bài trước 9 giờ nhé', time: '13:45', fromMe: false },
    ],
  },
  {
    id: 'c3',
    name: 'Trần Quốc Bảo',
    initials: 'QB',
    lastMessage: 'Mình gửi file báo cáo rồi nhé',
    time: '11:20',
    unreadCount: 1,
    online: true,
    statusText: 'Đang hoạt động',
    messages: [
      { id: 'm1', text: 'Báo cáo mình làm xong rồi', time: '11:15', fromMe: false },
      { id: 'm2', text: 'Mình gửi file báo cáo rồi nhé', time: '11:20', fromMe: false },
    ],
  },
  {
    id: 'c4',
    name: 'Lê Thu Hà',
    initials: 'TH',
    lastMessage: 'Cảm ơn bạn nhiều!',
    time: '09:15',
    unreadCount: 0,
    online: true,
    statusText: 'Đang hoạt động',
    messages: [
      { id: 'm1', text: 'Mình gửi tài liệu cho bạn rồi đó', time: '09:10', fromMe: true },
      { id: 'm2', text: 'Cảm ơn bạn nhiều!', time: '09:15', fromMe: false },
    ],
  },
  {
    id: 'c5',
    name: 'Phạm Đức Huy',
    initials: 'ĐH',
    lastMessage: 'Ok, hẹn gặp chiều nay',
    time: 'Hôm qua',
    unreadCount: 0,
    online: false,
    statusText: 'Hoạt động 20 phút trước',
    messages: [
      { id: 'm1', text: 'Chiều nay gặp ở canteen nhé', time: 'Hôm qua', fromMe: true },
      { id: 'm2', text: 'Ok, hẹn gặp chiều nay', time: 'Hôm qua', fromMe: false },
    ],
  },
  {
    id: 'c6',
    name: 'Võ Thanh Tâm',
    initials: 'TT',
    lastMessage: 'Ảnh chụp hôm qua đẹp quá',
    time: 'Hôm qua',
    unreadCount: 0,
    online: true,
    statusText: 'Đang hoạt động',
    messages: [
      { id: 'm1', text: 'Ảnh chụp hôm qua đẹp quá', time: 'Hôm qua', fromMe: false },
    ],
  },
  {
    id: 'c7',
    name: 'Đặng Ngọc Mai',
    initials: 'NM',
    lastMessage: 'Bạn: Để mình xem lại đã',
    time: 'T2',
    unreadCount: 0,
    online: false,
    statusText: 'Hoạt động 3 giờ trước',
    messages: [
      { id: 'm1', text: 'Cho mình xin lại file ảnh nhé', time: 'T2', fromMe: false },
      { id: 'm2', text: 'Để mình xem lại đã', time: 'T2', fromMe: true },
    ],
  },
];

export const initialContacts: Contact[] = [
  { id: 'u7', name: 'Đặng Ngọc Mai', initials: 'NM', online: false, statusText: 'Hoạt động 3 giờ trước', conversationId: 'c7' },
  { id: 'u4', name: 'Lê Thu Hà', initials: 'TH', online: true, statusText: 'Đang hoạt động', conversationId: 'c4' },
  { id: 'u1', name: 'Nguyễn Minh Anh', initials: 'MA', online: true, statusText: 'Đang hoạt động', conversationId: 'c1' },
  { id: 'u5', name: 'Phạm Đức Huy', initials: 'ĐH', online: false, statusText: 'Hoạt động 20 phút trước', conversationId: 'c5' },
  { id: 'u3', name: 'Trần Quốc Bảo', initials: 'QB', online: true, statusText: 'Đang hoạt động', conversationId: 'c3' },
  { id: 'u8', name: 'Hoàng Gia Khánh', initials: 'GK', online: false, statusText: 'Hoạt động Hôm qua', conversationId: 'c1' },
  { id: 'u6', name: 'Võ Thanh Tâm', initials: 'TT', online: true, statusText: 'Đang hoạt động', conversationId: 'c6' },
  { id: 'u9', name: 'Bùi Phương Linh', initials: 'PL', online: false, statusText: 'Hoạt động 2 ngày trước', conversationId: 'c1' },
];

export const initialNotifications: AppNotification[] = [
  { id: 'n1', kind: 'message', content: 'Nguyễn Minh Anh đã gửi cho bạn 3 tin nhắn mới', time: '5 phút trước', read: false },
  { id: 'n2', kind: 'friend', content: 'Hoàng Gia Khánh đã gửi lời mời kết bạn', time: '1 giờ trước', read: false },
  { id: 'n3', kind: 'message', content: 'Bạn được thêm vào nhóm "Lớp CNTT K21"', time: '3 giờ trước', read: false },
  { id: 'n4', kind: 'system', content: 'Mật khẩu của bạn đã được thay đổi thành công', time: 'Hôm qua', read: true },
  { id: 'n5', kind: 'friend', content: 'Lê Thu Hà đã chấp nhận lời mời kết bạn', time: 'Hôm qua', read: true },
  { id: 'n6', kind: 'system', content: 'Chào mừng bạn đến với Chạm Chat!', time: '3 ngày trước', read: true },
];
