import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import FocusStatusBar from '../components/FocusStatusBar';
import { ChatMessage } from '../types';
import type { RootStackParamList } from '../navigation/types';
import {
  getChatId,
  markChatAsRead,
  sendMessage,
  subscribeMessages,
  subscribeUnread,
} from '../services/chatService';
import {
  getCurrentPosition,
  openInGoogleMaps,
  requestLocationPermission,
} from '../services/locationService';
import {
  formatDayLabel,
  formatTime,
  getInitials,
  getStatusText,
  isSameDayTs,
} from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { userId, name } = route.params;
  const { authUser, getUser } = useApp();
  const myId = authUser?.uid ?? '';
  const otherUser = getUser(userId);
  const displayName = otherUser?.name ?? name;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sendingLocation, setSendingLocation] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Nhận tin nhắn realtime; cleanup hủy listener để tin không bị hiện lặp
  useEffect(() => {
    if (!myId) return;
    setMessages([]);
    const unsubscribe = subscribeMessages(getChatId(myId, userId), message => {
      setMessages(prev =>
        prev.some(m => m.id === message.id) ? prev : [...prev, message],
      );
    });
    return unsubscribe;
  }, [myId, userId]);

  // Đang mở cuộc trò chuyện thì số tin chưa đọc luôn về 0
  useEffect(() => {
    if (!myId) return;
    const unsubscribe = subscribeUnread(myId, userId, count => {
      if (count > 0) markChatAsRead(myId, userId).catch(() => {});
    });
    return unsubscribe;
  }, [myId, userId]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    sendMessage(myId, userId, { type: 'text', text: trimmed }).catch(() => {
      setText(trimmed);
      Alert.alert('Lỗi', 'Không gửi được tin nhắn, vui lòng thử lại.');
    });
  };

  const handleSendLocation = async () => {
    setSendingLocation(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert(
          'Không có quyền vị trí',
          'Bạn đã từ chối quyền truy cập vị trí nên không thể gửi vị trí.',
        );
        return;
      }
      const { latitude, longitude } = await getCurrentPosition();
      await sendMessage(myId, userId, { type: 'location', latitude, longitude });
    } catch {
      Alert.alert(
        'Không lấy được vị trí',
        'Hãy bật GPS/định vị trên máy rồi thử lại.',
      );
    } finally {
      setSendingLocation(false);
    }
  };

  const renderItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const fromMe = item.senderId === myId;
    const isLocation =
      item.type === 'location' &&
      item.latitude !== undefined &&
      item.longitude !== undefined;
    // Hiện nhãn ngày khi tin đầu tiên của một ngày mới
    const previous = messages[index - 1];
    const showDay = !previous || !isSameDayTs(previous.createdAt, item.createdAt);

    return (
      <>
        {showDay ? (
          <Text style={styles.dayLabel}>{formatDayLabel(item.createdAt)}</Text>
        ) : null}
        <View
          style={[
            styles.bubbleRow,
            fromMe ? styles.bubbleRowRight : styles.bubbleRowLeft,
          ]}>
          {isLocation ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openInGoogleMaps(item.latitude!, item.longitude!)}
              style={[styles.bubble, fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
              <View style={styles.locationRow}>
                <View
                  style={[
                    styles.locationIconWrap,
                    fromMe && styles.locationIconWrapMine,
                  ]}>
                  <Text style={styles.locationIcon}>📍</Text>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationTitle, fromMe && styles.textMine]}>
                    Vị trí hiện tại
                  </Text>
                  <Text
                    style={[styles.locationCoords, fromMe && styles.textMineMuted]}>
                    {item.latitude!.toFixed(5)}, {item.longitude!.toFixed(5)}
                  </Text>
                  <Text style={[styles.locationHint, fromMe && styles.locationHintMine]}>
                    Nhấn để mở Google Maps
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={[styles.bubble, fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
              <Text style={[styles.bubbleText, fromMe && styles.textMine]}>
                {item.text}
              </Text>
            </View>
          )}
          <Text style={styles.bubbleTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FocusStatusBar light />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.8}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Avatar
          name={displayName}
          initials={getInitials(displayName)}
          size={40}
          bg={colors.white}
          fg={colors.primary}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={styles.statusRow}>
            {otherUser?.online ? <View style={styles.statusDot} /> : null}
            <Text style={styles.headerStatus}>{getStatusText(otherUser)}</Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Hãy gửi lời chào đầu tiên tới {displayName} 👋
          </Text>
        }
      />

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.locationBtn}
          activeOpacity={0.7}
          disabled={sendingLocation}
          onPress={handleSendLocation}>
          {sendingLocation ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.locationBtnIcon}>📍</Text>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Viết tin nhắn..."
          placeholderTextColor={colors.textLight}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          activeOpacity={0.8}
          disabled={!text.trim()}
          onPress={handleSend}>
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 16,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backIcon: { fontSize: 28, color: colors.white, marginTop: -4 },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontSize: 16, fontWeight: '800', color: colors.white },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  headerStatus: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 40,
  },
  dayLabel: {
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textMuted,
    marginVertical: 12,
  },
  bubbleRow: { marginBottom: 12, maxWidth: '78%' },
  bubbleRowLeft: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubbleRowRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { borderRadius: 18, paddingHorizontal: 15, paddingVertical: 11 },
  bubbleTheirs: { backgroundColor: colors.surface },
  bubbleMine: { backgroundColor: colors.primary },
  bubbleText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  textMine: { color: colors.white },
  textMineMuted: { color: 'rgba(255,255,255,0.8)' },
  bubbleTime: { fontSize: 11, color: colors.textMuted, marginTop: 4, marginHorizontal: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationIconWrapMine: { backgroundColor: 'rgba(255,255,255,0.2)' },
  locationIcon: { fontSize: 20 },
  locationInfo: { flexShrink: 1 },
  locationTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  locationCoords: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  locationHint: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  locationHintMine: { color: colors.accent },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  locationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  locationBtnIcon: { fontSize: 18 },
  input: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.text,
    maxHeight: 110,
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: colors.white, fontSize: 15, fontWeight: '800' },
});

export default ChatScreen;
