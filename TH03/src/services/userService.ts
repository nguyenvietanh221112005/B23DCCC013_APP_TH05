import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { db } from './firebase';
import { AppUser } from '../types';

export const createUserProfile = (uid: string, name: string, email: string) =>
  set(ref(db, `users/${uid}`), {
    name,
    email,
    online: true,
    lastSeen: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

// Lắng nghe toàn bộ danh sách người dùng, trả về hàm hủy lắng nghe
export const subscribeUsers = (callback: (users: AppUser[]) => void) =>
  onValue(
    ref(db, 'users'),
    snapshot => {
      const users: AppUser[] = [];
      snapshot.forEach(child => {
        const value = child.val() ?? {};
        users.push({
          id: child.key as string,
          name: value.name || value.email || 'Người dùng',
          email: value.email ?? '',
          online: value.online === true,
          lastSeen: value.lastSeen,
          createdAt: value.createdAt,
        });
      });
      callback(users);
    },
    () => callback([]),
  );

export const setOnlineStatus = (uid: string, online: boolean) =>
  update(ref(db, `users/${uid}`), { online, lastSeen: serverTimestamp() });

/**
 * Đánh dấu online khi kết nối tới Firebase, và nhờ server tự chuyển
 * sang offline (onDisconnect) khi app mất kết nối hoặc bị tắt.
 */
export const startPresence = (uid: string) => {
  const userRef = ref(db, `users/${uid}`);
  return onValue(ref(db, '.info/connected'), snapshot => {
    if (snapshot.val() !== true) return;
    onDisconnect(userRef)
      .update({ online: false, lastSeen: serverTimestamp() })
      .then(() => setOnlineStatus(uid, true))
      .catch(() => {});
  });
};

export const stopPresence = async (uid: string) => {
  await onDisconnect(ref(db, `users/${uid}`)).cancel();
  await setOnlineStatus(uid, false);
};
