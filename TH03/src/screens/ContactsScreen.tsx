import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import { Contact } from '../types';

type Props = any;

const ContactsScreen: React.FC<Props> = ({ navigation }) => {
  const { contacts } = useApp();
  const [query, setQuery] = useState('');

  const onlineCount = useMemo(
    () => contacts.filter(c => c.online).length,
    [contacts],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return contacts;
    const q = query.trim().toLowerCase();
    return contacts.filter(c => c.name.toLowerCase().includes(q));
  }, [contacts, query]);

  const openChat = (contact: Contact) => {
    navigation.navigate('Chat', {
      conversationId: contact.conversationId,
      name: contact.name,
    });
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.row}>
      <Avatar name={item.name} initials={item.initials} online={item.online} />
      <View style={styles.rowContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text
          style={[
            styles.status,
            { color: item.online ? colors.online : colors.textMuted },
          ]}>
          {item.statusText}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.chatBtn}
        activeOpacity={0.7}
        onPress={() => openChat(item)}>
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh bạ</Text>
        <Text style={styles.onlineText}>{onlineCount} đang hoạt động</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm danh bạ"
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
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
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  onlineText: { fontSize: 12, color: colors.textMuted },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowContent: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  status: { fontSize: 12, marginTop: 2 },
  chatBtn: { padding: 6 },
  chatIcon: { fontSize: 18 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 60 },
});

export default ContactsScreen;
