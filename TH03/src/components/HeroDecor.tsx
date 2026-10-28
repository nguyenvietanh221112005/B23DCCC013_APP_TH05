import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

// Vòng tròn viền mờ và hình tròn vàng trang trí ở góc khối xanh
const HeroDecor: React.FC<{ top?: number }> = ({ top = 0 }) => (
  <>
    <View pointerEvents="none" style={[styles.ring, { top: top - 30 }]} />
    <View pointerEvents="none" style={[styles.sun, { top: top + 110 }]} />
  </>
);

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  sun: {
    position: 'absolute',
    right: 24,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.accent,
  },
});

export default HeroDecor;
