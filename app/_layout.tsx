import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isTVMode = Platform.isTV;
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0a',
            borderBottomWidth: 0,
            height: isTVMode ? 80 : 60,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: isTVMode ? 24 : 18,
          },
          contentStyle: {
            backgroundColor: '#0a0a0a',
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerBackVisible: true,
          animation: 'fade',
          headerLeft: () => isTVMode ? (
            <Ionicons name="tv-outline" size={24} color="#0077ff" style={{ marginLeft: 20 }} />
          ) : undefined,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Movie Streaming',
            headerShown: false, // Hide header on home screen
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: 'Now Playing',
            headerShown: false, // We'll implement a custom header in the VideoPlayer
          }}
        />
      </Stack>
    </>
  );
}