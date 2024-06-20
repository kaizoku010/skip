import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  registerRootComponent(App);

  return (
    <EventsDataProvider>

    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
       <NavigationContainer>
    <Stack.Navigator initialRouteName="SignupForm">
      <Stack.Screen options={{headerShown:false}} name="Moxie5 Events"  component={NewLogin} />
      <Stack.Screen options={{headerShown:false}} name="Login"  component={SignupForm} />
      <Stack.Screen options={{headerShown:false}}  name="HomeTabs" component={MyTabs} />
      <Stack.Screen  name="PostDetails" component={PostDetails} />

      <Stack.Screen name="requests" component={PendingRequests} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  </NavigationContainer>
    </Provider>
    
    </GestureHandlerRootView>
</EventsDataProvider>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
