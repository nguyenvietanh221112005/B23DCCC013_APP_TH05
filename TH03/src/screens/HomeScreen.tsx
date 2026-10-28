import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { Conversation, useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import FocusStatusBar from '../components/FocusStatusBar';
import {
  formatChatTime,
  getGreeting,
  getInitials,
  getShortName,
} from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'> | any;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { authUser, profile, conversations, unreadMessagesCount } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.trim().toLowerCase();
    return conversations.filter(
      c =>
        c.user.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const openChat = (conversation: Conversation) => {
    navigation.navigate('Chat', {
      userId: conversation.userId,
      name: conversation.user.name,
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const hasUnread = item.unread > 0;
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => openChat(item)}>
        <Avatar
          name={item.user.name}
          initials={getInitials(item.user.name)}
          size={46}
          online={item.user.online}
        />
        <View style={styles.rowContent}>
          <View style={styles.rowLine}>
            <Text style={styles.name} numberOfLines={1}>
              {item.user.name}
            </Text>
            <Text style={[styles.time, hasUnread && styles.timeUnread]}>
              {formatChatTime(item.lastTime)}
            </Text>
          </View>
          <View style={styles.rowLine}>
            <Text
              style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
              numberOfLines={1}>
              {item.lastSenderId === authUser?.uid ? 'Bạn: ' : ''}
              {item.lastMessage}
            </Text>
            {hasUnread ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FocusStatusBar light />
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.greeting}>
          {getGreeting()}
          {profile?.name ? `, ${getShortName(profile.name)}` : ''}
        </Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Tin nhắn</Text>
          {unreadMessagesCount > 0 ? (
            <View style={styles.newPill}>
              <Text style={styles.newPillText}>{unreadMessagesCount} mới</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cuộc trò chuyện"
            placeholderTextColor={colors.textLight}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <View style={styles.card}>
        <FlatList
          data={filtered}
          keyExtractor={item => item.userId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Chưa có cuộc trò chuyện nào.{'\n'}Vào Danh bạ để bắt đầu nhắn tin.
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.88)', marginBottom: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.white },
  newPill: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newPillText: { color: colors.dark, fontSize: 12, fontWeight: '800' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: { fontSize: 13, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  card: {
    flex: 1,
    margin: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowContent: { flex: 1, marginLeft: 12 },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  time: { fontSize: 12, color: colors.textMuted },
  timeUnread: { color: colors.primary, fontWeight: '700' },
  lastMessage: { fontSize: 13, color: colors.textMuted, flex: 1, marginRight: 8 },
  lastMessageUnread: { color: colors.text, fontWeight: '600' },
  badge: {
    minWidth: 22,
    height: 20,
    borderRadius: 6,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  separator: { height: 1, backgroundColor: colors.border },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 40,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
