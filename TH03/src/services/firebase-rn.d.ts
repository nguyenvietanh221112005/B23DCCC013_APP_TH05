import type { Persistence } from 'firebase/auth';

// Hàm này chỉ có trong bản build React Native của firebase/auth
// nên typings mặc định (bản web) không khai báo
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
