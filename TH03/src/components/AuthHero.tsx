import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import HeroDecor from './HeroDecor';

type Props = {
  title: string;
  subtitle: string;
  onBack?: () => void;
};

// Khối xanh đầu màn Đăng nhập / Đăng ký
const AuthHero: React.FC<Props> = ({ title, subtitle, onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.hero, { paddingTop: insets.top + 36 }]}>
      <HeroDecor top={insets.top} />
      {onBack ? (
        <TouchableOpacity style={styles.iconBox} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBox}>
          <Text style={styles.logoIcon}>💬</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 64,
    overflow: 'hidden',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logoIcon: { fontSize: 22 },
  backIcon: { fontSize: 30, color: colors.primary, marginTop: -4 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.88)',
    maxWidth: '62%',
  },
});

export default AuthHero;
