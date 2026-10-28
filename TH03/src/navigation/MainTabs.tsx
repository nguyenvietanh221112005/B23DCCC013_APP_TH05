import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  Home: '💬',
  Contacts: '👥',
  Notifications: '🔔',
  Settings: '⚙️',
};

const LABELS: Record<keyof MainTabParamList, string> = {
  Home: 'Tin nhắn',
  Contacts: 'Danh bạ',
  Notifications: 'Thông báo',
  Settings: 'Cài đặt',
};

const MainTabs: React.FC = () => {
  const { unreadNotificationsCount } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        // Chừa chỗ cho thanh điều hướng của máy (app chạy edge-to-edge)
        tabBarStyle: [
          styles.tabBar,
          { height: 66 + insets.bottom, paddingBottom: 8 + insets.bottom },
        ],
        tabBarBadgeStyle: styles.badge,
        tabBarLabel: LABELS[route.name as keyof MainTabParamList],
        tabBarLabelStyle: styles.tabLabel,
        // Tab đang chọn có vạch xanh phía trên, tab khác thì icon mờ đi
        tabBarIcon: ({ color, focused }) => (
          <View style={styles.iconWrap}>
            {focused ? <View style={styles.indicator} /> : null}
            <Text style={[styles.tabIcon, { color }, !focused && styles.tabIconIdle]}>
              {ICONS[route.name as keyof MainTabParamList]}
            </Text>
          </View>
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge:
            unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '700' },
  iconWrap: { alignItems: 'center' },
  indicator: {
    position: 'absolute',
    top: -9,
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  tabIcon: { fontSize: 19 },
  tabIconIdle: { opacity: 0.55 },
  badge: {
    backgroundColor: colors.tabBadge,
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});

export default MainTabs;
