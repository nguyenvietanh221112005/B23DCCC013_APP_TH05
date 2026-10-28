export const colors = {
  background: '#FFFFFF',
  surface: '#F1F8F3', // ô nhập, bong bóng chat của người kia
  unreadBg: '#E3F5EA', // tin nhắn / thông báo chưa đọc
  border: '#DDEBE2',
  primary: '#0E8A45',
  primaryDark: '#0A6E37',
  primaryLight: '#E3F5EA',
  accent: '#FFD84D',
  dark: '#0F1A14', // nút chính trên nền trắng, avatar hồ sơ
  text: '#0F1A14',
  textMuted: '#5F6F65',
  textLight: '#97A69D',
  online: '#0E8A45',
  unread: '#0E8A45',
  danger: '#D6455D',
  dangerBorder: '#F2C4CD',
  tabBadge: '#E5484D',
  white: '#FFFFFF',
};

export const avatarPalette = [
  { bg: '#E3F5EA', fg: '#0E8A45' },
  { bg: '#ECE6FB', fg: '#5B3FB0' },
  { bg: '#FFF1BF', fg: '#8A6A00' },
  { bg: '#FDE4E8', fg: '#B23A52' },
  { bg: '#E2EEFB', fg: '#2F62A8' },
];

export const avatarColorFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
};
