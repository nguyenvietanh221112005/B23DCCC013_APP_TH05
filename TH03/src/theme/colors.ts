export const colors = {
  background: '#F4F0E6',
  card: '#FFFFFF',
  border: '#E8E2D4',
  primary: '#1E6F54',
  primaryDark: '#15523D',
  primaryLight: '#DCEFE6',
  text: '#1A1A1A',
  textMuted: '#8C8C84',
  textLight: '#A6A69C',
  online: '#3BBE6E',
  unread: '#C0392B',
  unreadBg: '#C0392B',
  danger: '#C0392B',
  white: '#FFFFFF',
};

export const avatarPalette = [
  { bg: '#C7E8D4', fg: '#2E7D53' },
  { bg: '#D9CFF2', fg: '#6B4FA0' },
  { bg: '#F6D9B5', fg: '#B5712B' },
  { bg: '#CFE0F6', fg: '#3568A8' },
  { bg: '#F3E6AE', fg: '#9C7F1B' },
  { bg: '#F6CEDB', fg: '#B84F6E' },
];

export const avatarColorFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
};
