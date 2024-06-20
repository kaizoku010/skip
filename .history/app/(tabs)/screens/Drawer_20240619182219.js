// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/NewLogin';
import AnotherScreen from '../screens/Login'; // Replace with your other screens
import MyTabs from '../Operations/MyTabs'; // Assuming your tabs component is in the same directory

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="HomeTabs">
      <Drawer.Screen name="Moxie5 Events" component={HomeScreen} />
      <Drawer.Screen name="HomeTabs" component={MyTabs} />
      <Drawer.Screen name="Another" component={AnotherScreen} />
      <Stack.Screen  name="PostDetails" component={PostDetails} />
<Stack.Screen name="requests" component={PendingRequests} />
<Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
