import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import FocusStatusBar from '../components/FocusStatusBar';
import { AppNotification } from '../types';
import { formatChatTime } from '../utils/format';

type Props = any;
type Tab = 'all' | 'unread' | 'read';

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();
  const [tab, setTab] = useState<Tab>('all');

  const visible = useMemo(
    () =>
      notifications.filter(n =>
        tab === 'all' ? true : tab === 'unread' ? !n.read : n.read,
      ),
    [notifications, tab],
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'unread', label: `Chưa đọc (${unreadNotificationsCount})` },
    { key: 'read', label: 'Đã đọc' },
  ];

  // Mở cuộc trò chuyện; ChatScreen tự đánh dấu đã đọc khi mở
  const openNotification = (item: AppNotification) => {
    markNotificationRead(item.id);
    navigation.navigate('Chat', { userId: item.userId, name: item.userName });
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      activeOpacity={0.7}
      onPress={() => openNotification(item)}>
      <View style={[styles.iconWrap, !item.read && styles.iconWrapUnread]}>
        <Text style={styles.icon}>🔔</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, !item.read && styles.textUnread]}>
          {item.content}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.preview}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.time}>{formatChatTime(item.time)}</Text>
          {item.read ? (
            <Text style={styles.readText}>✓ Đã đọc</Text>
          ) : (
            <TouchableOpacity
              style={styles.markBtn}
              activeOpacity={0.8}
              onPress={() => markNotificationRead(item.id)}>
              <Text style={styles.markBtnText}>Đánh dấu đã đọc</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FocusStatusBar />
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        <TouchableOpacity onPress={markAllNotificationsRead}>
          <Text style={styles.markAll}>Đánh dấu tất cả</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segment}>
        {tabs.map(t => {
          const active = t.key === tab;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.segmentItem, active && styles.segmentItemActive]}
              activeOpacity={0.8}
              onPress={() => setTab(t.key)}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {tab === 'all'
              ? 'Chưa có thông báo nào. Khi có người nhắn tin cho bạn, thông báo sẽ hiện ở đây.'
              : 'Không có thông báo nào ở mục này.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  markAll: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 11,
  },
  segmentItemActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  segmentTextActive: { color: colors.text, fontWeight: '800' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
  },
  cardUnread: {
    backgroundColor: colors.unreadBg,
    borderColor: colors.unreadBg,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapUnread: { backgroundColor: colors.primary },
  icon: { fontSize: 17 },
  content: { flex: 1 },
  text: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  textUnread: { color: colors.text, fontWeight: '700' },
  preview: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: { fontSize: 12, color: colors.textMuted },
  readText: { fontSize: 12, color: colors.text, fontWeight: '600' },
  markBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  markBtnText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 40,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default NotificationsScreen;
