import React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

// Các tab đều được mount cùng lúc, nên chỉ màn đang xem mới đặt màu thanh trạng thái
const FocusStatusBar: React.FC<{ light?: boolean }> = ({ light }) =>
  useIsFocused() ? (
    <StatusBar barStyle={light ? 'light-content' : 'dark-content'} />
  ) : null;

export default FocusStatusBar;
