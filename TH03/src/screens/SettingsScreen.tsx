import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import FocusStatusBar from '../components/FocusStatusBar';
import HeroDecor from '../components/HeroDecor';
import { formatDate, getInitials } from '../utils/format';

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { profile, logout } = useApp();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!profile) return null;

  const username = profile.email.split('@')[0];
  const rows = [
    { label: 'Tài khoản', value: username },
    { label: 'Email', value: profile.email },
    { label: 'Ngày tham gia', value: formatDate(profile.createdAt) },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Đăng xuất xong RootNavigator tự quay về màn hình Đăng nhập
      await logout();
    } catch {
      setLoggingOut(false);
      Alert.alert('Lỗi', 'Không thể đăng xuất, vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <FocusStatusBar light />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <HeroDecor top={insets.top - 40} />
          <Text style={styles.title}>Cài đặt</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileHead}>
            <Avatar
              name={profile.name}
              initials={getInitials(profile.name)}
              size={60}
              bg={colors.dark}
              fg={colors.white}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name} numberOfLines={1}>
                {profile.name}
              </Text>
              <Text style={styles.username}>@{username}</Text>
            </View>
          </View>

          {rows.map(row => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {row.value}
              </Text>
            </View>
          ))}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Trực tuyến</Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          disabled={loggingOut}
          onPress={handleLogout}>
          <Text style={styles.logoutText}>
            {loggingOut ? 'Đang đăng xuất...' : '⎋  Đăng xuất'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 24 },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 70,
    overflow: 'hidden',
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.white },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    marginHorizontal: 16,
    marginTop: -50,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
    shadowColor: '#0F1A14',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  profileHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  profileInfo: { flex: 1, marginLeft: 14 },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  username: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoLabel: { fontSize: 14, color: colors.textMuted },
  infoValue: {
    flexShrink: 1,
    marginLeft: 16,
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: colors.unreadBg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  spacer: { flex: 1, minHeight: 32 },
  logoutBtn: {
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.dangerBorder,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontSize: 15, fontWeight: '800' },
});

export default SettingsScreen;
