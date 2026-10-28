import { StyleSheet } from 'react-native';
import { colors } from './colors';

// Phần tấm trắng bên dưới khối xanh, dùng chung cho Đăng nhập / Đăng ký
export const authStyles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, backgroundColor: colors.background },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 18,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: -6,
    marginBottom: 12,
  },
  spacer: { flex: 1, minHeight: 24 },
  button: {
    backgroundColor: colors.dark,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  linkWrap: { alignItems: 'center', marginTop: 18 },
  linkText: { fontSize: 14, color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '700' },
});
