import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, stopPresence } from './userService';

export const subscribeAuth = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await createUserProfile(user.uid, name, email);
  return user;
};

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = async () => {
  const uid = auth.currentUser?.uid;
  if (uid) {
    // Mất mạng thì vẫn cho đăng xuất, onDisconnect phía server sẽ tự set offline
    await stopPresence(uid).catch(() => {});
  }
  await signOut(auth);
};

export const getAuthErrorMessage = (error: unknown) => {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'Sai email hoặc mật khẩu.';
    case 'auth/invalid-email':
      return 'Email không hợp lệ.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký.';
    case 'auth/weak-password':
      return 'Mật khẩu phải có ít nhất 6 ký tự.';
    case 'auth/too-many-requests':
      return 'Bạn thử quá nhiều lần, vui lòng thử lại sau.';
    case 'auth/network-request-failed':
      return 'Không có kết nối mạng.';
    default:
      return 'Đã có lỗi xảy ra, vui lòng thử lại.';
  }
};
