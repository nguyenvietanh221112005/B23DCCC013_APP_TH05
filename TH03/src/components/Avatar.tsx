import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { avatarColorFor, colors } from '../theme/colors';

type Props = {
  name: string;
  initials: string;
  size?: number;
  online?: boolean;
};

const Avatar: React.FC<Props> = ({ name, initials, size = 48, online }) => {
  const palette = avatarColorFor(name);
  const dotSize = Math.max(10, Math.round(size * 0.26));

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: palette.bg,
          },
        ]}>
        <Text
          style={[
            styles.initials,
            { color: palette.fg, fontSize: size * 0.36 },
          ]}>
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
              borderRadius: dotSize / 2,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.background,
  },
});

export default Avatar;
