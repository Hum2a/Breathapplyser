import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  StartDrinkingScreen,
  AddEntryScreen,
  ViewEntriesScreen,
  ProfileScreen,
  SettingsScreen,
  HistoryScreen,
  DetailedHistoryScreen,
  EditEntriesScreen,
  ChartsScreen,
  StartScreen,
  LoginScreen,
  RegisterScreen,
} from '../screens/ScreensIndex';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StartDrinking" component={StartDrinkingScreen} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} />
        <Stack.Screen name="ViewEntries" component={ViewEntriesScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="DetailedHistory" component={DetailedHistoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditEntries" component={EditEntriesScreen} />
        <Stack.Screen name="Charts" component={ChartsScreen} />
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;