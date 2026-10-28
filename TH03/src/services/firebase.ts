import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { createAsyncStorage } from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAfGt2kYG0-fNsbTIQs3_6f71noVrY6MHA',
  authDomain: 'chatrealtime-1159f.firebaseapp.com',
  databaseURL:
    'https://chatrealtime-1159f-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chatrealtime-1159f',
  storageBucket: 'chatrealtime-1159f.firebasestorage.app',
  messagingSenderId: '1042033635043',
  appId: '1:1042033635043:web:c6c3d3d7ffacff46c21fd6',
};

// Khi Fast Refresh nạp lại file, app đã được khởi tạo nên chỉ lấy lại instance cũ
const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// Lưu phiên đăng nhập vào AsyncStorage để mở lại app không phải đăng nhập lại
export const auth = isFirstInit
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(createAsyncStorage('firebase-auth')),
    })
  : getAuth(app);

export const db = getDatabase(app);
