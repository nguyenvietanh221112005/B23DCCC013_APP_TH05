import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { avatarColorFor, colors } from '../theme/colors';

type Props = {
  name: string;
  initials: string;
  size?: number;
  online?: boolean;
  // Ghi đè màu, ví dụ avatar trắng trên header xanh
  bg?: string;
  fg?: string;
};

// Avatar ô vuông bo góc, chấm online cũng vuông bo góc
const Avatar: React.FC<Props> = ({ name, initials, size = 48, online, bg, fg }) => {
  const palette = avatarColorFor(name);
  const dotSize = Math.max(10, Math.round(size * 0.26));

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.3),
            backgroundColor: bg ?? palette.bg,
          },
        ]}>
        <Text
          style={[styles.initials, { color: fg ?? palette.fg, fontSize: size * 0.34 }]}>
          {initials}
        </Text>
      </View>
      {online ? (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: Math.round(dotSize * 0.3),
              right: -2,
              bottom: -2,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '800',
  },
  dot: {
    position: 'absolute',
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default Avatar;
