import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { AppNotification, NotificationKind } from '../types';

const iconFor = (kind: NotificationKind) => {
  switch (kind) {
    case 'message':
      return '💬';
    case 'friend':
      return '👤';
    case 'system':
    default:
      return '🛡️';
  }
};

const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      activeOpacity={0.7}
      onPress={() => markNotificationRead(item.id)}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{iconFor(item.kind)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>{item.content}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.time}>
            {item.time}
            {item.read ? ' · Đã đọc' : ''}
          </Text>
          {!item.read ? (
            <View style={styles.unreadTag}>
              <Text style={styles.unreadTagText}>Chưa đọc</Text>
            </View>
          ) : null}
        </View>
      </View>
      {!item.read ? <View style={styles.dot} /> : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        <TouchableOpacity onPress={markAllNotificationsRead}>
          <Text style={styles.markAll}>Đọc tất cả</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Bạn có {unreadNotificationsCount} thông báo chưa đọc · nhấn để đánh dấu
        đã đọc
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  markAll: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
  },
  cardUnread: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 16 },
  content: { flex: 1 },
  text: { fontSize: 14, color: colors.text, lineHeight: 20 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  time: { fontSize: 12, color: colors.textMuted, marginRight: 8 },
  unreadTag: {
    backgroundColor: colors.unread,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadTagText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.unread,
    marginLeft: 8,
    marginTop: 4,
  },
});

export default NotificationsScreen;
