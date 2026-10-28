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
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import FocusStatusBar from '../components/FocusStatusBar';
import { AppUser } from '../types';
import { getInitials, getShortStatus } from '../utils/format';

type Props = any;
type Filter = 'all' | 'online';

const ContactsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { contacts } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const onlineCount = useMemo(
    () => contacts.filter(c => c.online).length,
    [contacts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter(
      c =>
        (filter === 'all' || c.online) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)),
    );
  }, [contacts, query, filter]);

  const openChat = (contact: AppUser) => {
    navigation.navigate('Chat', {
      userId: contact.id,
      name: contact.name,
    });
  };

  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: `Tất cả · ${contacts.length}` },
    { key: 'online', label: `Trực tuyến · ${onlineCount}` },
  ];

  const renderItem = ({ item }: { item: AppUser }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => openChat(item)}>
      <Avatar
        name={item.name}
        initials={getInitials(item.name)}
        size={58}
        online={item.online}
      />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={[styles.statusPill, item.online && styles.statusPillOnline]}>
        <Text style={[styles.statusText, item.online && styles.statusTextOnline]}>
          {getShortStatus(item)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FocusStatusBar />
      <Text style={styles.title}>Danh bạ</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm bạn bè"
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.chipRow}>
        {chips.map(chip => {
          const active = chip.key === filter;
          return (
            <TouchableOpacity
              key={chip.key}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.8}
              onPress={() => setFilter(chip.key)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query.trim() || filter === 'online'
              ? 'Không tìm thấy người dùng phù hợp.'
              : 'Chưa có người dùng nào khác đăng ký.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: { fontSize: 13, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.dark },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: colors.white, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  column: { justifyContent: 'space-between' },
  card: {
    width: '48.5%',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  statusPill: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillOnline: { backgroundColor: colors.unreadBg },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  statusTextOnline: { color: colors.primary, fontWeight: '700' },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 40,
  },
});

export default ContactsScreen;
