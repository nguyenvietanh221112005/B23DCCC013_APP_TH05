import {
  increment,
  onChildAdded,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { db } from './firebase';
import { ChatMessage, ChatSummary } from '../types';

// Hai người luôn ra cùng một chatId dù ai mở cuộc trò chuyện trước
export const getChatId = (uidA: string, uidB: string) =>
  [uidA, uidB].sort().join('_');

/**
 * Mỗi tin nhắn (cũ và mới) được gọi callback đúng một lần.
 * Phải gọi hàm hủy trả về trong cleanup của useEffect, nếu không
 * listener cũ vẫn chạy và tin nhắn bị hiện lặp.
 */
export const subscribeMessages = (
  chatId: string,
  onMessage: (message: ChatMessage) => void,
) =>
  onChildAdded(
    ref(db, `messages/${chatId}`),
    snapshot => {
      onMessage({ id: snapshot.key as string, ...snapshot.val() });
    },
    () => {},
  );

type MessagePayload =
  | { type: 'text'; text: string }
  | { type: 'location'; latitude: number; longitude: number };

const previewOf = (payload: MessagePayload) =>
  payload.type === 'location' ? '📍 Đã gửi một vị trí' : payload.text;

/**
 * Ghi tin nhắn và cập nhật danh sách cuộc trò chuyện của cả hai người
 * trong một lần update để dữ liệu luôn khớp nhau.
 */
export const sendMessage = (
  fromUid: string,
  toUid: string,
  payload: MessagePayload,
) => {
  const chatId = getChatId(fromUid, toUid);
  const messageId = push(ref(db, `messages/${chatId}`)).key as string;
  const lastMessage = previewOf(payload);

  return update(ref(db), {
    [`messages/${chatId}/${messageId}`]: {
      ...payload,
      senderId: fromUid,
      createdAt: serverTimestamp(),
    },
    [`userChats/${fromUid}/${toUid}/lastMessage`]: lastMessage,
    [`userChats/${fromUid}/${toUid}/lastSenderId`]: fromUid,
    [`userChats/${fromUid}/${toUid}/lastTime`]: serverTimestamp(),
    [`userChats/${toUid}/${fromUid}/lastMessage`]: lastMessage,
    [`userChats/${toUid}/${fromUid}/lastSenderId`]: fromUid,
    [`userChats/${toUid}/${fromUid}/lastTime`]: serverTimestamp(),
    [`userChats/${toUid}/${fromUid}/unread`]: increment(1),
  });
};

export const subscribeUserChats = (
  uid: string,
  callback: (chats: ChatSummary[]) => void,
) =>
  onValue(
    ref(db, `userChats/${uid}`),
    snapshot => {
      const chats: ChatSummary[] = [];
      snapshot.forEach(child => {
        const value = child.val() ?? {};
        chats.push({
          userId: child.key as string,
          lastMessage: value.lastMessage ?? '',
          lastSenderId: value.lastSenderId,
          lastTime: value.lastTime ?? 0,
          unread: value.unread ?? 0,
        });
      });
      callback(chats);
    },
    () => callback([]),
  );

export const subscribeUnread = (
  uid: string,
  otherUid: string,
  callback: (count: number) => void,
) =>
  onValue(
    ref(db, `userChats/${uid}/${otherUid}/unread`),
    snapshot => callback(snapshot.val() ?? 0),
    () => {},
  );

export const markChatAsRead = (uid: string, otherUid: string) =>
  set(ref(db, `userChats/${uid}/${otherUid}/unread`), 0);
