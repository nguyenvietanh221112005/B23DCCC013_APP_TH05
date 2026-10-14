import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import { Message } from '../types';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId } = route.params;
  const { getConversation, sendMessage } = useApp();
  const conversation = getConversation(conversationId);
  const [text, setText] = useState('');

  if (!conversation) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(conversationId, text);
    setText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubbleRow,
        item.fromMe ? styles.bubbleRowRight : styles.bubbleRowLeft,
      ]}>
      <View
        style={[
          styles.bubble,
          item.fromMe ? styles.bubbleMine : styles.bubbleTheirs,
        ]}>
        <Text
          style={item.fromMe ? styles.bubbleTextMine : styles.bubbleTextTheirs}>
          {item.text}
        </Text>
      </View>
      <Text
        style={[
          styles.bubbleTime,
          item.fromMe ? styles.bubbleTimeRight : styles.bubbleTimeLeft,
        ]}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Avatar
          name={conversation.name}
          initials={conversation.initials}
          size={38}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation.name}</Text>
          <Text
            style={[
              styles.headerStatus,
              { color: conversation.online ? colors.online : colors.textMuted },
            ]}>
            {conversation.statusText}
          </Text>
        </View>
      </View>

      <View style={styles.dayLabelWrap}>
        <Text style={styles.dayLabel}>Hôm nay</Text>
      </View>

      <FlatList
        data={conversation.messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={colors.textLight}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendBtn}
          activeOpacity={0.8}
          onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backBtn: { paddingRight: 4, paddingVertical: 4 },
  backIcon: { fontSize: 30, color: colors.text, marginTop: -4 },
  headerInfo: { marginLeft: 10 },
  headerName: { fontSize: 16, fontWeight: '700', color: colors.text },
  headerStatus: { fontSize: 12, marginTop: 2 },
  dayLabelWrap: { alignItems: 'center', paddingVertical: 10 },
  dayLabel: { fontSize: 12, color: colors.textMuted },
  listContent: { paddingHorizontal: 16, paddingBottom: 12 },
  bubbleRow: { marginBottom: 14, maxWidth: '78%' },
  bubbleRowLeft: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubbleRowRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleTheirs: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  bubbleTextTheirs: { color: colors.text, fontSize: 14 },
  bubbleTextMine: { color: colors.white, fontSize: 14 },
  bubbleTime: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  bubbleTimeLeft: { marginLeft: 4 },
  bubbleTimeRight: { marginRight: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendIcon: { color: colors.white, fontSize: 16 },
});

export default ChatScreen;
