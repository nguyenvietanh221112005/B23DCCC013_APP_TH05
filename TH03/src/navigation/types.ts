export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Chat: { conversationId: string; name: string };
};

export type MainTabParamList = {
  Home: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Settings: undefined;
};
