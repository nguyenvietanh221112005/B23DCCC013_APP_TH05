import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

const SettingsScreen: React.FC = () => {
  const { user, logout } = useApp();

  const rows = [
    { label: 'Tài khoản', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'Số điện thoại', value: user.phone },
    { label: 'Ngày tham gia', value: user.joinedDate },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cài đặt</Text>

      <View style={styles.profileCard}>
        <Avatar name={user.name} initials="VA" size={72} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Đang hoạt động</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.infoRow,
              index === rows.length - 1 && styles.infoRowLast,
            ]}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        activeOpacity={0.8}
        onPress={logout}>
        <Text style={styles.logoutText}>⎋  Đăng xuất</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 16 },
  profileCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 },
  username: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  statusPill: {
    marginTop: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusPillText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { fontSize: 14, color: colors.textMuted },
  infoValue: { fontSize: 14, color: colors.text, fontWeight: '600' },
  logoutBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
});

export default SettingsScreen;
